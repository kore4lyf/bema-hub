"use client";

import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

export function TestimonialsSection() {
  const testimonials = [
    {
      quote: "Bema Hub transformed my fan engagement!",
      author: "Artist Jane",
      avatar: "/placeholder.svg"
    },
    {
      quote: "The Echo Loop system helped me earn 3x more from my music.",
      author: "Musician John",
      avatar: "/placeholder.svg"
    },
    {
      quote: "As a fan, I love being part of the creative process.",
      author: "Fan Sarah",
      avatar: "/placeholder.svg"
    }
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Community Voices</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Hear from artists and fans who are thriving with Bema Hub
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="text-center">
              <CardContent className="pt-6">
                <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-gray-200 relative">
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.author}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
                <blockquote className="text-lg font-medium mb-2">
                  "{testimonial.quote}"
                </blockquote>
                <p className="text-muted-foreground">- {testimonial.author}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}