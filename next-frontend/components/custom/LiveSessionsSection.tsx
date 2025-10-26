"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Radio, Calendar, Users, Play, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";

export function LiveSessionsSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [viewMode, setViewMode] = useState<'live' | 'upcoming' | 'recent'>('live');

  const liveEvents = [
    {
      title: "Live Album Recording",
      date: "Oct 26, 2024",
      time: "9:00 PM EST",
      type: "Live Recording",
      participants: 1247,
      status: "live",
      image: "/api/placeholder/400/200"
    },
    {
      title: "Live Q&A Session",
      date: "Oct 26, 2024",
      time: "10:00 PM EST",
      type: "Interactive",
      participants: 892,
      status: "live",
      image: "/api/placeholder/400/200"
    }
  ];

  const upcomingEvents = [
    {
      title: "Acoustic Unplugged",
      date: "Nov 2, 2024",
      time: "8:00 PM EST",
      type: "Live Performance",
      participants: 234,
      status: "upcoming",
      image: "/api/placeholder/400/200"
    },
    {
      title: "Behind the Beat",
      date: "Nov 5, 2024", 
      time: "7:00 PM EST",
      type: "Studio Session",
      participants: 156,
      status: "upcoming",
      image: "/api/placeholder/400/200"
    },
    {
      title: "Fan Q&A Session",
      date: "Nov 8, 2024",
      time: "6:00 PM EST", 
      type: "Interactive",
      participants: 89,
      status: "pro-only",
      image: "/api/placeholder/400/200"
    }
  ];

  const pastEvents = [
    {
      title: "October Highlights",
      date: "Oct 20, 2024",
      time: "8:00 PM EST",
      type: "Recap Session",
      participants: 567,
      status: "past",
      image: "/api/placeholder/400/200"
    },
    {
      title: "Studio Tour",
      date: "Oct 15, 2024",
      time: "7:00 PM EST",
      type: "Behind the Scenes",
      participants: 423,
      status: "past",
      image: "/api/placeholder/400/200"
    },
    {
      title: "Community Showcase",
      date: "Oct 10, 2024",
      time: "6:30 PM EST",
      type: "Fan Content",
      participants: 312,
      status: "past",
      image: "/api/placeholder/400/200"
    }
  ];

  const getEventsToShow = () => {
    switch (viewMode) {
      case 'live':
        return liveEvents.length > 0 ? liveEvents : [];
      case 'upcoming':
        return upcomingEvents;
      case 'recent':
        return pastEvents.slice(0, 3);
      default:
        return [];
    }
  };

  const eventsToShow = getEventsToShow();
  const showAsSlider = viewMode === 'live' && liveEvents.length > 1;

  useEffect(() => {
    if (liveEvents.length > 0) {
      setViewMode('live');
    } else if (upcomingEvents.length > 0) {
      setViewMode('upcoming');
    } else {
      setViewMode('recent');
    }
  }, []);

  useEffect(() => {
    if (showAsSlider) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % liveEvents.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [showAsSlider, liveEvents.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % liveEvents.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + liveEvents.length) % liveEvents.length);

  return (
    <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/30 to-pink-900/20"></div>
      <div className="container px-4 sm:px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="flex justify-center gap-2 mb-6">
            <Button
              variant={viewMode === 'live' ? 'default' : 'outline'}
              onClick={() => setViewMode('live')}
              className={viewMode === 'live' ? 'bg-red-500 hover:bg-red-600' : 'border-white/20 text-white hover:bg-white/10'}
              disabled={liveEvents.length === 0}
            >
              Live Events
            </Button>
            <Button
              variant={viewMode === 'upcoming' ? 'default' : 'outline'}
              onClick={() => setViewMode('upcoming')}
              className={viewMode === 'upcoming' ? 'bg-blue-500 hover:bg-blue-600' : 'border-white/20 text-white hover:bg-white/10'}
            >
              Upcoming Events
            </Button>
            <Button
              variant={viewMode === 'recent' ? 'default' : 'outline'}
              onClick={() => setViewMode('recent')}
              className={viewMode === 'recent' ? 'bg-gray-500 hover:bg-gray-600' : 'border-white/20 text-white hover:bg-white/10'}
            >
              Last 3 Events
            </Button>
          </div>
          
          <Badge variant="secondary" className="mb-4 px-4 py-2 bg-white/10 text-white border-white/20">
            <Radio className="h-4 w-4 mr-2" />
            {viewMode === 'live' ? "Live Now" : viewMode === 'upcoming' ? "Upcoming Sessions" : "Recent Sessions"}
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Connect Live with <span className="text-blue-400">Bema Music</span>
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Experience exclusive live performances, studio sessions, and direct conversations with the artists. 
            Get closer to the music than ever before.
          </p>
        </div>

        {showAsSlider ? (
          <div className="relative max-w-2xl mx-auto">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white shadow-lg">
              <div className="relative h-48 w-full">
                <Image
                  src={liveEvents[currentSlide].image}
                  alt={liveEvents[currentSlide].title}
                  fill
                  className="object-cover rounded-t-lg"
                />
              </div>
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <Badge className="bg-red-500 hover:bg-red-500 animate-pulse">
                    <Radio className="h-3 w-3 mr-1" />
                    LIVE NOW
                  </Badge>
                  <div className="flex items-center gap-1 text-sm text-white/60">
                    <Users className="h-4 w-4" />
                    {liveEvents[currentSlide].participants.toLocaleString()}
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold mb-2">{liveEvents[currentSlide].title}</h3>
                <p className="text-white/60 mb-6">{liveEvents[currentSlide].type}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-blue-400" />
                    {liveEvents[currentSlide].date}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-blue-400" />
                    {liveEvents[currentSlide].time}
                  </div>
                </div>
                
                <Button className="w-full bg-red-500 hover:bg-red-600 border-0 text-white">
                  <Play className="h-4 w-4 mr-2" />
                  Join Live Now
                </Button>
              </CardContent>
            </Card>

            <button 
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <ChevronLeft className="h-5 w-5 text-white" />
            </button>
            <button 
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <ChevronRight className="h-5 w-5 text-white" />
            </button>

            <div className="flex justify-center gap-2 mt-6">
              {liveEvents.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentSlide ? 'bg-white' : 'bg-white/40'
                  }`}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {eventsToShow.map((event, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 text-white shadow-lg hover:shadow-xl transition-shadow">
                <div className="relative h-48 w-full">
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-cover rounded-t-lg"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Badge 
                      variant={event.status === 'pro-only' ? 'default' : 'secondary'}
                      className={
                        event.status === 'live' ? 'bg-red-500 hover:bg-red-500 animate-pulse' :
                        event.status === 'pro-only' ? 'bg-yellow-600 hover:bg-yellow-700' : 
                        event.status === 'past' ? 'bg-gray-600 hover:bg-gray-700' :
                        'bg-blue-600 hover:bg-blue-700'
                      }
                    >
                      {event.status === 'live' && <Radio className="h-3 w-3 mr-1" />}
                      {event.status === 'live' ? 'LIVE' : 
                       event.status === 'pro-only' ? 'Pro Only' : 
                       event.status === 'past' ? 'Replay' : 'Open'}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm text-white/60">
                      <Users className="h-4 w-4" />
                      {event.participants}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                  <p className="text-white/60 mb-4">{event.type}</p>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-blue-400" />
                      {event.date}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-blue-400" />
                      {event.time}
                    </div>
                  </div>
                  
                  <Button 
                    className={`w-full border-0 text-white ${
                      event.status === 'live' ? 'bg-red-500 hover:bg-red-600' :
                      event.status === 'past' ? 'bg-gray-600 hover:bg-gray-700' :
                      'bg-blue-600 hover:bg-blue-700'
                    }`}
                    disabled={event.status === 'pro-only'}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    {event.status === 'live' ? 'Join Live' :
                     event.status === 'past' ? 'Watch Replay' :
                     event.status === 'pro-only' ? 'Upgrade to Join' : 'Join Session'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
