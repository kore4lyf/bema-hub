"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Gift, Users, ChevronDown, Play } from "lucide-react";

export function EventsSection() {
  const events = [
    {
      title: "Ecosystem Introduction",
      date: "November 15, 2025 • 6:00 PM EST",
      description: "Learn how Bema Hub's ecosystem works and how you can benefit as an artist or fan.",
      icon: Calendar
    },
    {
      title: "Christmas EP Promotion",
      date: "November 22, 2025 • 7:00 PM EST",
      description: "Exclusive preview of our Christmas EP with special guest performances.",
      icon: Gift
    }
  ];

  return (
    <section className="py-20">
      <div className="container px-4 sm:px-6 mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Upcoming Events</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Join us for exciting events and community gatherings
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {events.map((event, index) => {
            const IconComponent = event.icon;
            return (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold">{event.title}</h3>
                      <p className="text-muted-foreground">{event.date}</p>
                    </div>
                    <IconComponent className="h-6 w-6 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    {event.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button>RSVP</Button>
                    <Button variant="outline">
                      <Play className="mr-2 h-4 w-4" />
                      Watch Live
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        <div className="mt-12 text-center">
          <Button variant="outline">
            View All Events
            <ChevronDown className="ml-2 h-4 w-4 rotate-[-90deg]" />
          </Button>
        </div>
      </div>
    </section>
  );
}