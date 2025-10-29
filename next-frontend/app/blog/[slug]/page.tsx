"use client";

import { Navbar } from "@/components/custom/Navbar";
import { Footer } from "@/components/custom/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Clock, Eye, Share2, Bookmark, Twitter, Facebook, Linkedin, Link as LinkIcon } from "lucide-react";
import Link from "next/link";

const relatedPosts = [
  {
    slug: "artist-spotlight-october",
    title: "Artist Spotlight: October Edition",
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&q=80",
    category: "Spotlight"
  },
  {
    slug: "building-your-fanbase",
    title: "Building Your Fanbase: Tips for Artists",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80",
    category: "Tips"
  },
  {
    slug: "community-success-stories",
    title: "Community Success Stories",
    image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&q=80",
    category: "Community"
  }
];

const tableOfContents = [
  { id: "what-is-bema", title: "What is Bema Hub?" },
  { id: "getting-started", title: "Getting Started" },
  { id: "building-presence", title: "Building Your Presence" },
  { id: "engagement", title: "Community Engagement" }
];

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  return (
    <>
      <Navbar />
      <main className="container max-w-7xl px-4 py-16 sm:px-6 mx-auto">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-12">
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>

          <div className="grid lg:grid-cols-4 gap-12">
            <article className="lg:col-span-3">
              <div className="mb-8">
                <Badge variant="secondary" className="mb-6">Guide</Badge>
                <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl leading-tight">
                  Getting Started with Bema Hub
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8 bg-primary/10" />
                    <span className="font-medium">Bema Team</span>
                  </div>
                  <span>•</span>
                  <time>October 20, 2025</time>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>5 min read</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    <span>2.3k views</span>
                  </div>
                </div>
              </div>

              <div className="mb-8 flex gap-2">
                <Button size="sm" variant="outline">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button size="sm" variant="outline">
                  <Bookmark className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button size="sm" variant="ghost">
                  <Twitter className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost">
                  <Facebook className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost">
                  <Linkedin className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost">
                  <LinkIcon className="h-4 w-4" />
                </Button>
              </div>

              <div className="mb-12 aspect-video w-full overflow-hidden rounded-lg bg-muted">
                <img 
                  src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&q=80" 
                  alt="Blog post cover" 
                  className="h-full w-full object-cover" 
                />
              </div>

              <div className="prose prose-neutral dark:prose-invert max-w-none prose-lg">
                <p className="lead text-xl leading-relaxed mb-8">
                  Welcome to Bema Hub, where artists and fans come together to create, celebrate, and connect. 
                  This guide will help you navigate our platform and make the most of your experience.
                </p>

                <h2 id="what-is-bema" className="mt-12 mb-6">What is Bema Hub?</h2>
                <p className="mb-6">
                  Bema Hub is a community-driven platform designed to empower artists and engage fans. 
                  Whether you're a musician, visual artist, or creative enthusiast, our platform provides 
                  the tools you need to showcase your work and build meaningful connections.
                </p>
                <p className="mb-8">
                  Our mission is to democratize access to audiences and create opportunities for artists 
                  at every stage of their journey. From emerging talents to established professionals, 
                  everyone has a place in our vibrant community.
                </p>

                <h2 id="getting-started" className="mt-12 mb-6">Getting Started</h2>
                <p className="mb-4">
                  Creating your account is simple. Click the "Join Now" button in the navigation bar and 
                  follow the registration process. Once registered, you can:
                </p>
                <ul className="mb-8 space-y-2">
                  <li>Create and customize your profile with photos and bio</li>
                  <li>Participate in campaigns and events to gain visibility</li>
                  <li>Connect with other artists and fans through our social features</li>
                  <li>Track your progress on the leaderboard and earn rewards</li>
                  <li>Access exclusive content and early opportunities</li>
                </ul>

                <h2 id="building-presence" className="mt-12 mb-6">Building Your Presence</h2>
                <p className="mb-6">
                  Your profile is your digital identity on Bema Hub. Take time to add a compelling bio, 
                  showcase your best work, and engage with the community through comments and collaborations.
                </p>
                <p className="mb-8">
                  Consistency is key. Regular updates, authentic engagement, and quality content will help 
                  you build a loyal following. Don't forget to participate in community events and campaigns 
                  to increase your visibility.
                </p>

                <h2 id="engagement" className="mt-12 mb-6">Community Engagement</h2>
                <p className="mb-6">
                  The heart of Bema Hub is our community. Engage authentically, support fellow artists, 
                  and contribute to discussions. The more you give, the more you'll receive in return.
                </p>
                <p className="mb-8">
                  Join our campaigns, attend virtual events, and collaborate with other members. These 
                  activities not only boost your profile but also create lasting connections that can 
                  lead to exciting opportunities.
                </p>
              </div>

              <Separator className="my-12" />

              <Card className="p-8 mb-12">
                <div className="flex gap-6">
                  <Avatar className="h-16 w-16 bg-primary/10" />
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2">Bema Hub Team</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Community & Content • Passionate about connecting artists and fans worldwide
                    </p>
                    <p className="text-sm mb-4">
                      We're dedicated to building the best platform for artists to thrive and fans to discover amazing talent.
                    </p>
                    <Button size="sm" variant="outline">Follow</Button>
                  </div>
                </div>
              </Card>

              <div className="mb-12">
                <h3 className="text-2xl font-bold mb-8">Comments (12)</h3>
                <Card className="p-6 mb-6">
                  <div className="space-y-4">
                    <Textarea placeholder="Share your thoughts..." rows={3} />
                    <Button>Post Comment</Button>
                  </div>
                </Card>
                
                <div className="space-y-6">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="p-6">
                      <div className="flex gap-4">
                        <Avatar className="h-10 w-10 bg-primary/10" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold text-sm">User {i}</span>
                            <span className="text-xs text-muted-foreground">2 days ago</span>
                          </div>
                          <p className="text-sm mb-3">Great article! This really helped me understand how to get started.</p>
                          <Button variant="ghost" size="sm" className="h-8">Reply</Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold mb-8">Related Articles</h3>
                <div className="grid sm:grid-cols-3 gap-6">
                  {relatedPosts.map((post) => (
                    <Link key={post.slug} href={`/blog/${post.slug}`}>
                      <Card className="overflow-hidden transition-all hover:shadow-lg">
                        <div className="aspect-video overflow-hidden bg-muted">
                          <img src={post.image} alt={post.title} className="h-full w-full object-cover" />
                        </div>
                        <div className="p-6">
                          <Badge variant="secondary" className="mb-3">{post.category}</Badge>
                          <h4 className="font-semibold text-sm line-clamp-2">{post.title}</h4>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            </article>

            <aside className="space-y-8">
              <Card className="p-6 sticky top-20">
                <h3 className="font-semibold mb-6">Table of Contents</h3>
                <nav className="space-y-3">
                  {tableOfContents.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className="block text-sm text-muted-foreground hover:text-primary transition-colors py-1"
                    >
                      {item.title}
                    </a>
                  ))}
                </nav>
              </Card>
            </aside>
          </div>
      </main>
      <Footer />
    </>
  );
}
