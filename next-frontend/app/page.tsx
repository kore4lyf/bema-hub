"use client";

import { Navbar } from "@/components/custom/Navbar";
import { Hero } from "@/components/custom/Hero";
import { EchoLoopSection } from "@/components/custom/EchoLoopSection";
import { LiveSessionsSection } from "@/components/custom/LiveSessionsSection";
import { BlogSection } from "@/components/custom/BlogSection";
import { TestimonialsSection } from "@/components/custom/TestimonialsSection";
import { FAQSection } from "@/components/custom/FAQSection";
import { CTASection } from "@/components/custom/CTASection";
import { ContactSection } from "@/components/custom/ContactSection";
import { Footer } from "@/components/custom/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <EchoLoopSection />
        <LiveSessionsSection />
        <BlogSection />
        <TestimonialsSection />
        <FAQSection />
        <CTASection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}