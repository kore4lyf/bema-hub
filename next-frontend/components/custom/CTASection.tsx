"use client";

import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-700">
      <div className="container px-4 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Start Your Journey with Bema Hub
          </h2>
          <p className="mt-4 text-lg text-white/90 max-w-2xl mx-auto">
            Join thousands of artists and fans already thriving in our community
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-white/90">
              Sign Up
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/10">
              Donate
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/10">
              Refer a Friend
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}