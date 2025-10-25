"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Play, 
  Share2,
  Filter,
  Search
} from "lucide-react";
import { Input } from "@/components/ui/input";

// Mock data for events
const events = [
  {
    id: 1,
    title: "Ecosystem Introduction",
    description: "Learn how Bema Hub's ecosystem works and how you can benefit as an artist or fan. We'll cover the core features of Echo Loop and how to maximize your engagement.",
    date: "2025-11-15",
    time: "6:00 PM EST",
    location: "Online via Zoom",
    attendees: 128,
    isLive: false,
    isUpcoming: true,
    category: "Education",
    tags: ["Introduction", "Ecosystem", "Basics"]
  },
  {
    id: 2,
    title: "Christmas EP Promotion",
    description: "Exclusive preview of our Christmas EP with special guest performances. Get early access to tracks and interact with the artists during the live session.",
    date: "2025-11-22",
    time: "7:00 PM EST",
    location: "Online via Zoom",
    attendees: 256,
    isLive: false,
    isUpcoming: true,
    category: "Music",
    tags: ["Christmas", "EP", "Preview"]
  },
  {
    id: 3,
    title: "Fan Engagement Masterclass",
    description: "Learn advanced techniques for building and maintaining meaningful connections with your fanbase. Featuring case studies from top creators in our community.",
    date: "2025-11-30",
    time: "5:00 PM EST",
    location: "Online via Zoom",
    attendees: 89,
    isLive: false,
    isUpcoming: true,
    category: "Community",
    tags: ["Engagement", "Masterclass", "Fanbase"]
  },
  {
    id: 4,
    title: "Live Performance: Artist Showcase",
    description: "Weekly live performance series featuring emerging artists from our community. This week's spotlight: Indie folk duo Mountain Echo.",
    date: "2025-10-25",
    time: "8:00 PM EST",
    location: "Online via Twitch",
    attendees: 0,
    isLive: true,
    isUpcoming: false,
    category: "Performance",
    tags: ["Live", "Performance", "Showcase"]
  },
  {
    id: 5,
    title: "Creator Meetup: Networking Night",
    description: "Informal networking event for creators to connect, share experiences, and collaborate. Bring your questions and be ready to share your wins!",
    date: "2025-10-18",
    time: "7:00 PM EST",
    location: "Online via Discord",
    attendees: 64,
    isLive: false,
    isUpcoming: false,
    category: "Community",
    tags: ["Networking", "Meetup", "Community"]
  }
];

const categories = [
  "All",
  "Education",
  "Music",
  "Community",
  "Performance"
];

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8 px-4 sm:px-6 mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight">Events</h1>
          <p className="text-muted-foreground mt-4 max-w-2xl">
            Join us for exciting events, workshops, and community gatherings
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search events..." className="pl-10" />
          </div>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {events.map((event) => (
              <Card key={event.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary">{event.category}</Badge>
                        {event.isLive && (
                          <Badge className="bg-red-500 hover:bg-red-500">LIVE</Badge>
                        )}
                      </div>
                      <CardTitle className="text-2xl">{event.title}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-6">
                    {event.description}
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-5 w-5 text-muted-foreground" />
                      <span>{new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="mr-2 h-5 w-5 text-muted-foreground" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="mr-2 h-5 w-5 text-muted-foreground" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="mr-2 h-5 w-5 text-muted-foreground" />
                      <span>{event.attendees} attending</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {event.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    {event.isUpcoming ? (
                      <>
                        <Button>
                          RSVP
                        </Button>
                        <Button variant="outline">
                          <Share2 className="mr-2 h-4 w-4" />
                          Share
                        </Button>
                      </>
                    ) : event.isLive ? (
                      <Button className="bg-red-500 hover:bg-red-600">
                        <Play className="mr-2 h-4 w-4" />
                        Join Live Stream
                      </Button>
                    ) : (
                      <Button variant="outline" disabled>
                        Event Ended
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={category === "All" ? "default" : "ghost"}
                      className="w-full justify-start"
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {events.filter(event => event.isUpcoming).map((event) => (
                    <div key={event.id} className="flex items-start gap-3">
                      <div className="mt-1 text-sm font-medium">
                        {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                      <div>
                        <h3 className="font-medium">{event.title}</h3>
                        <p className="text-sm text-muted-foreground">{event.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Create Event</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Are you a creator looking to host your own event?
                </p>
                <Button className="w-full">Create Event</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}