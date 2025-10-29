"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Radio, Calendar, Users, Play, Clock, ChevronLeft, ChevronRight, Share2, Crown, Star } from "lucide-react";
import { useState, useEffect } from "react";

export function LiveSessionsSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [viewMode, setViewMode] = useState<'live' | 'upcoming' | 'recent'>('live');

  interface Event {
    id: number;
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    attendees: number;
    isLive: boolean;
    isUpcoming: boolean;
    category: string;
    level: string;
    tags: string[];
    image: string;
  }

  const liveEvents: Event[] = [
    {
      id: 1,
      title: "Bema Music Acoustic Live",
      description: "Intimate acoustic performance featuring new tracks from the upcoming album. Direct interaction with the artist and exclusive Q&A session.",
      date: "2025-10-26",
      time: "8:00 PM EST",
      location: "Live Stream",
      attendees: 1247,
      isLive: true,
      isUpcoming: false,
      category: "Live Performance",
      level: "All Members",
      tags: ["Acoustic", "New Music", "Q&A"],
      image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=80"
    }
  ];

  const upcomingEvents: Event[] = [
    {
      id: 3,
      title: "Behind the Scenes: Studio Session",
      description: "Get an exclusive look into the creative process as Bema Music works on new material. Watch the magic happen in real-time and ask questions about the songwriting process.",
      date: "2025-11-08",
      time: "6:00 PM EST",
      location: "Studio Live Stream",
      attendees: 892,
      isLive: false,
      isUpcoming: true,
      category: "Studio Session",
      level: "Pro & Ambassador",
      tags: ["Studio", "Creative Process", "Exclusive"],
      image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80"
    },
    {
      id: 2,
      title: "Echo Loop Ambassador Meetup",
      description: "Exclusive gathering for Echo Loop Ambassadors. Network with fellow ambassadors, get updates on upcoming campaigns, and provide feedback directly to the Bema Music team.",
      date: "2025-11-02",
      time: "7:00 PM EST",
      location: "Private Stream",
      attendees: 45,
      isLive: true,
      isUpcoming: true,
      category: "Community",
      level: "Ambassador Only",
      tags: ["Ambassador", "Networking", "Exclusive"],
      image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&q=80"
    },
    {
      id: 2,
      title: "Echo Loop Ambassador Meetup",
      description: "Exclusive gathering for Echo Loop Ambassadors. Network with fellow ambassadors, get updates on upcoming campaigns, and provide feedback directly to the Bema Music team.",
      date: "2025-11-02",
      time: "7:00 PM EST",
      location: "Private Stream",
      attendees: 45,
      isLive: true,
      isUpcoming: true,
      category: "Community",
      level: "Ambassador Only",
      tags: ["Ambassador", "Networking", "Exclusive"],
      image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&q=80"
    }
  ];

  const pastEvents: Event[] = [
    {
      id: 4,
      title: "Fan Spotlight Session",
      description: "Monthly session where Echo Loop members can showcase their own music and get feedback from Bema Music. Open to all levels with priority given to Pro and Ambassador members.",
      date: "2025-11-15",
      time: "7:30 PM EST",
      location: "Community Stream",
      attendees: 234,
      isLive: false,
      isUpcoming: true,
      category: "Community Showcase",
      level: "All Members",
      tags: ["Fan Music", "Feedback", "Showcase"],
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80"
    },
    {
      id: 5,
      title: "Echo Loop Onboarding Session",
      description: "New to the Echo Loop? Join this comprehensive introduction to the Bema Music community, learn about referral benefits, and discover how to maximize your experience.",
      date: "2025-11-22",
      time: "5:00 PM EST",
      location: "Welcome Stream",
      attendees: 156,
      isLive: false,
      isUpcoming: false,
      category: "Education",
      level: "New Members",
      tags: ["Onboarding", "Introduction", "Echo Loop"],
      image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80"
    }
  ];

  const getEventsToShow = () => {
    switch (viewMode) {
      case 'live':
        return liveEvents;
      case 'upcoming':
        return upcomingEvents.slice(0, 2);
      case 'recent':
        return pastEvents.slice(0, 2);
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

  const renderEventCard = (event: any) => (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow w-full">
      <div className={viewMode === 'live' ? "grid md:grid-cols-3 gap-3" : "flex flex-col gap-3"}>
        <div className="aspect-ratio w-full overflow-hidden bg-muted">
          <img src={event.image} alt={event.title} className="h-full w-full object-cover" />
        </div>
        <div className="md:col-span-2 p-6">
          <CardHeader className="p-0 pb-4">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{event.category}</Badge>
                {event.isLive && (
                  <Badge className="bg-red-500 hover:bg-red-500 animate-pulse">
                    <Radio className="h-3 w-3 mr-1" />
                    LIVE NOW
                  </Badge>
                )}
                {event.level === "Ambassador Only" && (
                  <Badge className="bg-yellow-600">
                    <Crown className="h-3 w-3 mr-1" />
                    Ambassador
                  </Badge>
                )}
                {event.level === "Pro & Ambassador" && (
                  <Badge className="bg-blue-600">
                    <Star className="h-3 w-3 mr-1" />
                    Pro+
                  </Badge>
                )}
              </div>
            </div>
            <CardTitle className="text-xl mb-2">{event.title}</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <p className="text-muted-foreground mb-4 text-sm">
              {event.description}
            </p>
            
            <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4 text-purple-600" />
                <span>{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              </div>
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4 text-purple-600" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center">
                <Radio className="mr-2 h-4 w-4 text-purple-600" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center">
                <Users className="mr-2 h-4 w-4 text-purple-600" />
                <span>{event.attendees} {event.isLive ? 'watching' : 'registered'}</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-1 mb-4">
              {event.tags.map((tag: string, index: number) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
            
            <div className="flex flex-wrap gap-2">
              {event.isLive ? (
                <Button className="bg-red-500 hover:bg-red-600 text-white">
                  <Play className="mr-2 h-4 w-4" />
                  Join Live Now
                </Button>
              ) : event.isUpcoming ? (
                <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                  <Calendar className="mr-2 h-4 w-4" />
                  RSVP
                </Button>
              ) : (
                <Button variant="outline" disabled>
                  Session Ended
                </Button>
              )}
              <Button variant="outline">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>
          </CardContent>
        </div>
      </div>
    </Card>
  );

  return (
    <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/30 to-pink-900/20"></div>
      <div className="container px-4 sm:px-6 relative z-10 mx-auto">
        <div className="text-center mb-16">
          <div className="flex justify-center gap-2 mb-6">
            <Button
              variant={viewMode === 'live' ? "default" : "outline"}
              onClick={() => setViewMode('live')}
              className={viewMode === 'live' ? 'bg-gray-500 hover:bg-gray-600 text-white hover:text-white' : 'text-white hover:bg-white/10 hover:text-white bg-transparent border-0'}
              disabled={liveEvents.length === 0}
            >
              Live Events
            </Button>
            <Button
              variant={viewMode === 'upcoming' ? "default" : "outline"}
              onClick={() => setViewMode('upcoming')}
              className={viewMode === 'upcoming' ? 'bg-gray-500 hover:bg-gray-600 text-white hover:text-white' : 'text-white hover:bg-white/10 hover:text-white bg-transparent border-0'}
              disabled={upcomingEvents.length === 0}
            >
              Upcoming Events
            </Button>
            <Button
              variant={viewMode === 'recent' ? "default" : "outline"}
              onClick={() => setViewMode('recent')}
              className={viewMode === 'recent' ? 'bg-gray-500 hover:bg-gray-600 text-white hover:text-white' : 'text-white hover:bg-white/10 hover:text-white bg-transparent border-0'}
            >
              Past Events
            </Button>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Connect Live with <span className="text-blue-400">Bema Music</span>
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Experience exclusive live performances, studio sessions, and direct conversations with the artists. 
            Get closer to the music than ever before.
          </p>
        </div>

        {eventsToShow.length > 0 ? (
          viewMode === 'live' && showAsSlider ? (
            <div className="relative max-w-6xl mx-auto">
              {renderEventCard(liveEvents[currentSlide])}
              
              {/* Navigation controls with dots between arrows - Hero section style */}
              <div className="flex items-center justify-center gap-4 mt-6">
                <button 
                  onClick={prevSlide}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                  disabled={liveEvents.length <= 1}
                >
                  <ChevronLeft className="h-5 w-5 text-white" />
                </button>
                <div className="flex gap-2">
                  {liveEvents.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentSlide ? 'bg-white' : 'bg-white/40'
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
                <button 
                  onClick={nextSlide}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                  disabled={liveEvents.length <= 1}
                >
                  <ChevronRight className="h-5 w-5 text-white" />
                </button>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
              {eventsToShow.map((event) => (
                <div key={event.id} className="h-full">
                  {renderEventCard(event)}
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="text-center py-12">
            <p className="text-2xl font-bold text-white/80">
              {viewMode === 'live' && "No live events currently."}
              {viewMode === 'upcoming' && "No upcoming events scheduled."}
              {viewMode === 'recent' && "No past events available."}
            </p>
            <p className="text-white/60 mt-2">
              {viewMode === 'live' && "Check back later for live sessions."}
              {viewMode === 'upcoming' && "Stay tuned for upcoming events."}
              {viewMode === 'recent' && "No recent events to display."}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}