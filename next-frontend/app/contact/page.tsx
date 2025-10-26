"use client";

import { Navbar } from "@/components/custom/Navbar";
import { Footer } from "@/components/custom/footer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mail, MapPin, Phone, Clock, Send } from "lucide-react";
import { toast } from "sonner";

const contactInfo = [
  {
    icon: Mail,
    title: "Email",
    value: "support@bemahub.com",
    link: "mailto:support@bemahub.com"
  },
  {
    icon: Phone,
    title: "Phone",
    value: "+1 (555) 123-4567",
    link: "tel:+15551234567"
  },
  {
    icon: MapPin,
    title: "Address",
    value: "123 Music Street, LA, CA 90001",
    link: "#"
  },
  {
    icon: Clock,
    title: "Hours",
    value: "Mon-Fri: 9:00 AM - 6:00 PM PST",
    link: "#"
  }
];

const departments = [
  { value: "general", label: "General Inquiry" },
  { value: "support", label: "Technical Support" },
  { value: "partnerships", label: "Partnerships" },
  { value: "press", label: "Press & Media" },
  { value: "careers", label: "Careers" }
];

export default function ContactPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent successfully! We'll get back to you soon.");
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <div className="bg-muted/30 border-b">
          <div className="container max-w-7xl px-4 py-16 sm:px-6 mx-auto text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">Get in Touch</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>
        </div>

        <div className="container max-w-7xl px-4 py-16 sm:px-6 mx-auto">
          <div className="grid lg:grid-cols-5 gap-16">
            <div className="lg:col-span-2 space-y-12">
              <div>
                <h2 className="text-2xl font-bold mb-8">Contact Information</h2>
                <div className="space-y-6">
                  {contactInfo.map((item) => (
                    <a
                      key={item.title}
                      href={item.link}
                      className="flex items-start gap-4 group"
                    >
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <item.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">{item.title}</p>
                        <p className="font-medium group-hover:text-primary transition-colors">{item.value}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Office Location</h3>
                <div className="aspect-video w-full bg-muted rounded-lg overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3305.4537534778894!2d-118.24532!3d34.05223!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDAzJzA4LjAiTiAxMTjCsDE0JzQzLjEiVw!5e0!3m2!1sen!2sus!4v1234567890"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Office Location"
                  />
                </div>
              </div>
            </div>

            <div className="lg:col-span-3">
              <h2 className="text-2xl font-bold mb-8">Send us a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="John" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Doe" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="you@example.com" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number (Optional)</Label>
                  <Input id="phone" type="tel" placeholder="+1 (555) 123-4567" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <select 
                    id="department"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {departments.map((dept) => (
                      <option key={dept.value} value={dept.value}>
                        {dept.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="How can we help?" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea 
                    id="message" 
                    placeholder="Tell us more about your inquiry..." 
                    rows={6}
                    required 
                  />
                </div>

                <Button type="submit" size="lg" className="w-full sm:w-auto">
                  <Send className="mr-2 h-4 w-4" />
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>

        <div className="bg-muted/30 border-y">
          <div className="container max-w-7xl px-4 py-16 sm:px-6 mx-auto">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
              <div className="grid gap-8 md:grid-cols-2 text-left mt-12">
                <div>
                  <h3 className="font-semibold mb-2">How quickly will I receive a response?</h3>
                  <p className="text-sm text-muted-foreground">We typically respond to all inquiries within 24 hours during business days.</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Can I schedule a call with your team?</h3>
                  <p className="text-sm text-muted-foreground">Yes! Mention your preferred time in the message and we'll arrange a call.</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Do you offer enterprise solutions?</h3>
                  <p className="text-sm text-muted-foreground">Absolutely. Contact our partnerships team for custom enterprise packages.</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Where can I find documentation?</h3>
                  <p className="text-sm text-muted-foreground">Visit our help center for comprehensive guides and documentation.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
