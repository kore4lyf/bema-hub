"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

interface Testimonial {
  id: number;
  quote: string;
  author: string;
  role: string;
}

export function TestimonialsSection() {
  const testimonials: Testimonial[] = [
    {
      id: 1,
      quote: "Bema Hub transformed my fan engagement! The Echo Loop system helped me connect with my audience in ways I never thought possible.",
      author: "Artist Jane",
      role: "Music Artist",
    },
    {
      id: 2,
      quote: "The Echo Loop system helped me earn 3x more from my music. I can now focus on creating instead of worrying about promotion.",
      author: "Musician John",
      role: "Electronic Producer",
    },
    {
      id: 3,
      quote: "As a fan, I love being part of the creative process. Supporting artists through Bema Hub makes me feel connected to their journey.",
      author: "Fan Sarah",
      role: "Ambassador",
    },
    {
      id: 4,
      quote: "The analytics dashboard gives me insights into my fanbase that I've never had before. It's revolutionized how I approach my marketing.",
      author: "Producer Mike",
      role: "Hip-Hop Artist",
    },
    {
      id: 5,
      quote: "Bema Hub's community features have helped me discover new artists and connect with like-minded music lovers around the world.",
      author: "Fan David",
      role: "Music Blogger",
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-advance slider
  useEffect(() => {
    if (testimonials.length <= 3 || !isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex >= testimonials.length - 3 ? 0 : prevIndex + 3
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonials.length, isAutoPlaying]);

  const nextTestimonials = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex >= testimonials.length - 3 ? 0 : prevIndex + 3
    );
  };

  const prevTestimonials = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 3 : prevIndex - 3
    );
  };

  // Get testimonials to display in the current slide
  const getCurrentTestimonials = () => {
    if (testimonials.length <= 3) {
      return testimonials;
    }
    
    const endIndex = Math.min(currentIndex + 3, testimonials.length);
    return testimonials.slice(currentIndex, endIndex);
  };

  const visibleTestimonials = getCurrentTestimonials();

  return (
    <section className="py-20 bg-muted/30">
      <div className="container px-4 sm:px-6 mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Community Voices</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Hear from artists and supporters who are thriving with Bema Hub
          </p>
        </div>

        {testimonials.length > 3 ? (
          // Slider view for more than 3 testimonials
          <div 
            className="relative"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            <div className="overflow-hidden">
              <div className="grid gap-6 md:grid-cols-3 transition-transform duration-500 ease-in-out">
                {visibleTestimonials.map((testimonial) => (
                  <Card key={testimonial.id} className="text-left">
                    <CardContent className="flex flex-col justify-between items-between">
                      <blockquote className="mb-3 pt-6">
                        {testimonial.quote}
                      </blockquote>

                      <div className="flex gap-2 items-center">
                        <p className="font-semibold">{testimonial.author}</p> <span className="text-muted-foreground">|</span> 
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Navigation controls with dots between arrows - Hero section style */}
            <div className="flex items-center justify-center gap-4 mt-10">
              <button 
                onClick={prevTestimonials}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <ChevronLeft className="h-5 w-5 text-foreground" />
              </button>
              <div className="flex gap-2">
                {Array.from({ length: Math.ceil(testimonials.length / 3) }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index * 3)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      Math.floor(currentIndex / 3) === index ? "bg-primary" : "bg-muted"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
              <button 
                onClick={nextTestimonials}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <ChevronRight className="h-5 w-5 text-foreground" />
              </button>
            </div>
          </div>
        ) : (
          // Grid view for 3 or fewer testimonials
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {visibleTestimonials.map((testimonial) => (
              <Card key={testimonial.id} className="text-left">
                <CardContent>
                  <blockquote className="mb-3 pt-6">
                    "{testimonial.quote}"
                  </blockquote>
                  <p className="text-muted-foreground font-semibold">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
