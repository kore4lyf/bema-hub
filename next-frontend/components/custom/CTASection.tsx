"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";
import { useState } from "react";

export function CTASection() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter signup
    console.log("Newsletter signup:", email);
    setEmail("");
  };

  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-pink-700">
      <div className="container px-4 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-white/10 rounded-full">
              <Mail className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-4">
            Stay in the Loop
          </h2>
          <p className="text-lg text-white/90 max-w-2xl mx-auto mb-8">
            Get exclusive updates, early access to campaigns, and behind-the-scenes content delivered straight to your inbox
          </p>
          
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex gap-3">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-white/10 border-white/30 text-white placeholder:text-white/60 focus:border-white/50"
                required
              />
              <Button 
                type="submit" 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-white/90 px-8"
              >
                Subscribe
              </Button>
            </div>
          </form>
          
          <p className="text-sm text-white/70 mt-4">
            No spam, unsubscribe at any time. We respect your privacy.
          </p>
        </div>
      </div>
    </section>
  );
}