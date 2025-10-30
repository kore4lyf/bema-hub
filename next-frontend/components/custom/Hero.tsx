"use client";

import { Button } from "@/components/ui/button";
import { Music, Radio, Users2, Crown, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useAppSelector } from "@/lib/hooks";
import { useState, useEffect } from "react";

const heroSlides = [
  {
    title: "Join the Echo Loop",
    subtitle: "Connect with faith-driven artists and help them share their music with people who will actually appreciate it",
    gradient: "from-blue-900 via-blue-800 to-pink-900"
  },
  {
    title: "Exclusive Live Sessions",
    subtitle: "Get access to intimate performances and behind-the-scenes content you won't find anywhere else",
    gradient: "from-purple-900 via-blue-900 to-indigo-900"
  },
  {
    title: "Support Real Artists",
    subtitle: "Help independent faith-based musicians grow their audience and make a living doing what they love",
    gradient: "from-indigo-900 via-purple-900 to-pink-900"
  }
];

export function Hero() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);

  return (
    <section className={`relative overflow-hidden py-24 md:py-32 bg-gradient-to-br ${heroSlides[currentSlide].gradient} transition-all duration-1000`}>
      <div className="absolute inset-0 opacity-40"></div>
      
      <div className="container relative z-10 px-4 sm:px-6 mx-auto">
        <div className="mx-auto max-w-5xl text-center">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6">
            {heroSlides[currentSlide].title.includes("Echo Loop") ? (
              <>
                Join the <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Echo Loop</span>
              </>
            ) : (
              heroSlides[currentSlide].title
            )}
          </h1>
          
          <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto mb-8">
            {heroSlides[currentSlide].subtitle}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto mb-12">
            <div className="p-4">
              <Radio className="h-8 w-8 text-blue-400 mx-auto mb-2" />
              <p className="text-white/90 font-medium">Live Sessions</p>
            </div>
            <div className="p-4">
              <Users2 className="h-8 w-8 text-green-400 mx-auto mb-2" />
              <p className="text-white/90 font-medium">Campaigns</p>
            </div>
            <div className="p-4">
              <Crown className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
              <p className="text-white/90 font-medium">Ambassador</p>
            </div>
            <div className="p-4">
              <Music className="h-8 w-8 text-purple-400 mx-auto mb-2" />
              <p className="text-white/90 font-medium">Pro Access</p>
            </div>
          </div>

          <div className="flex flex-row gap-4 justify-center mb-8">
              <Link href="/signup">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white border-0 px-8 py-3 text-lg">
                  Sign Up
                </Button>
              </Link>
            <Link href="/signin">
              <Button size="lg" variant="outline" className="bg-white/10 text-white border-white/30 hover:bg-white/20 px-8 py-3 text-lg backdrop-blur-sm">
                Sign In
              </Button>
            </Link>
          </div>

          {/* <div className="flex items-center justify-center gap-4">
            <button onClick={prevSlide} className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
              <ChevronLeft className="h-5 w-5 text-white" />
            </button>
            <div className="flex gap-2">
              {heroSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentSlide ? 'bg-white' : 'bg-white/40'
                  }`}
                />
              ))}
            </div>
            <button onClick={nextSlide} className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
              <ChevronRight className="h-5 w-5 text-white" />
            </button>
          </div> */}
        </div>
      </div>
    </section>
  );
}