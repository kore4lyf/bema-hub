"use client";

import { useState } from "react";
import { Navbar } from "@/components/custom/Navbar";
import { Footer } from "@/components/custom/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Clock, 
  Radio, 
  Users, 
  Play, 
  Share2,
  Filter,
  Search,
  Music,
  Crown,
  Star,
  Mic
} from "lucide-react";
import { Input } from "@/components/ui/input";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const liveEvents = [
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
  },
  {
    id: 2,
    title: "Echo Loop Ambassador Meetup",
    description: "Exclusive gathering for Echo Loop Ambassadors. Network with fellow ambassadors, get updates on upcoming campaigns, and provide feedback directly to the Bema Music team.",
    date: "2025-11-02",
    time: "7:00 PM EST",
    location: "Private Stream",
    attendees: 45,
    isLive: false,
    isUpcoming: true,
    category: "Community",
    level: "Ambassador Only",
    tags: ["Ambassador", "Networking", "Exclusive"],
    image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&q=80"
  },
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
    isUpcoming: true,
    category: "Education",
    level: "New Members",
    tags: ["Onboarding", "Introduction", "Echo Loop"],
    image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80"
  }
];

const categories = [
  "All",
  "Live Performance", 
  "Studio Session",
  "Community",
  "Community Showcase",
  "Education"
];

export default function EventsPage() {
  return (
    <ProtectedRoute>
      <EventsContent />
    </ProtectedRoute>
  );
}

function EventsContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredEvents = liveEvents.filter(event => {
    const matchesSearch = searchQuery === "" || 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "All" || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <Navbar />
      <main className="min-h-screen w-full bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
        <div className="container py-12 px-4 sm:px-6 mx-auto">
          <div className="mb-12 text-center">
            <Badge variant="secondary" className="mb-4 px-4 py-2">
              <Radio className="h-4 w-4 mr-2" /> Live Sessions </Badge>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Connect Live with <span className="text-purple-600">Bema Music</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Join exclusive live sessions, studio visits, and community events. Experience direct engagement with artists through the Echo Loop.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="Search live sessions..." 
                className="pl-10" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              {filteredEvents.map((event) => (
                <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="aspect-video md:aspect-auto overflow-hidden bg-muted">
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
                          {event.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
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
                          <Button variant="outline" size="sm">
                            <Share2 className="mr-2 h-4 w-4" />
                            Share
                          </Button>
                        </div>
                      </CardContent>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            
            <div className="space-y-6">
              <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950 border-purple-200 dark:border-purple-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Music className="h-5 w-5 text-purple-600" />
                    Session Categories
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <Button
                        key={category}
                        variant={category === selectedCategory ? "default" : "ghost"}
                        className="w-full justify-start"
                        size="sm"
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>
                    Upcoming Sessions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {liveEvents.filter(event => event.isUpcoming).slice(0, 3).map((event) => (
                      <div key={event.id} className="flex items-center p-3 rounded-lg bg-muted/50">
                        <div className="flex flex-col gap-2 items-center pr-3 mr-3  border-r border-gray-600  text-sm font-medium text-purple-600 min-w-[3rem]">
                          <Calendar className="h-5 w-5 text-purple-600" />
                          {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-sm line-clamp-1">{event.title}</h3>
                          <div className="flex justify-between items-end">
                          <p className="text-xs text-muted-foreground">{event.time}</p>
                          <Badge variant="outline" className="text-xs mt-1">
                            {event.level}
                          </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mic className="h-5 w-5" />
                    Host Your Session
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/90 mb-4 text-sm">
                    Echo Loop Ambassadors can host their own live sessions and engage directly with the community.
                  </p>
                  <Button className="w-full bg-white text-purple-600 hover:bg-white/90">
                    Apply to Host
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
