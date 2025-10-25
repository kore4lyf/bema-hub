"use client";

import { Navbar } from "@/components/custom/Navbar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, TrendingUp, Clock, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const categories = ["All", "Guide", "Spotlight", "Tips", "News", "Tutorial", "Community"];

const featuredPost = {
  slug: "state-of-music-industry-2025",
  title: "The State of Music Industry in 2025",
  excerpt: "An in-depth analysis of how technology and community platforms are reshaping the music landscape.",
  category: "News",
  date: "2025-10-24",
  readTime: "12 min read",
  author: "Sarah Johnson",
  image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=1200&q=80"
};

const posts = [
  {
    slug: "getting-started-with-bema-hub",
    title: "Getting Started with Bema Hub",
    excerpt: "Learn how to connect with artists and fans in our vibrant community platform.",
    category: "Guide",
    date: "2025-10-20",
    readTime: "5 min read",
    author: "Bema Team",
    views: "2.3k",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80"
  },
  {
    slug: "artist-spotlight-october",
    title: "Artist Spotlight: October Edition",
    excerpt: "Discover the talented artists making waves this month on Bema Hub.",
    category: "Spotlight",
    date: "2025-10-18",
    readTime: "8 min read",
    author: "Maria Garcia",
    views: "5.1k",
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80"
  },
  {
    slug: "building-your-fanbase",
    title: "Building Your Fanbase: Tips for Artists",
    excerpt: "Proven strategies to grow your audience and engage with fans effectively.",
    category: "Tips",
    date: "2025-10-15",
    readTime: "6 min read",
    author: "David Chen",
    views: "3.8k",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80"
  },
  {
    slug: "community-success-stories",
    title: "Community Success Stories: From Zero to Hero",
    excerpt: "Real stories of artists who found success through community engagement.",
    category: "Community",
    date: "2025-10-12",
    readTime: "10 min read",
    author: "Alex Thompson",
    views: "4.2k",
    image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&q=80"
  },
  {
    slug: "mastering-social-media",
    title: "Mastering Social Media for Musicians",
    excerpt: "Essential social media strategies every musician should know in 2025.",
    category: "Tutorial",
    date: "2025-10-10",
    readTime: "7 min read",
    author: "Emma Wilson",
    views: "6.5k",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80"
  },
  {
    slug: "monetization-strategies",
    title: "Monetization Strategies for Independent Artists",
    excerpt: "Explore diverse revenue streams beyond traditional music sales.",
    category: "Guide",
    date: "2025-10-08",
    readTime: "9 min read",
    author: "Michael Brown",
    views: "7.2k",
    image: "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=800&q=80"
  }
];

const trendingTopics = [
  "Artist Development",
  "Fan Engagement",
  "Music Marketing",
  "Community Building",
  "Digital Strategy"
];

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  return (
    <>
      <Navbar />
      <main className="container px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">Blog</h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Insights, stories, and updates from the Bema Hub community
            </p>
          </div>

          <div className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Featured Article</h2>
            </div>
            <Link href={`/blog/${featuredPost.slug}`}>
              <Card className="overflow-hidden transition-all hover:shadow-xl">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="aspect-video md:aspect-auto overflow-hidden bg-muted">
                    <img src={featuredPost.image} alt={featuredPost.title} className="h-full w-full object-cover" />
                  </div>
                  <div className="p-6 md:p-8 flex flex-col justify-center">
                    <Badge className="mb-4 w-fit">{featuredPost.category}</Badge>
                    <h3 className="mb-3 text-3xl font-bold">{featuredPost.title}</h3>
                    <p className="mb-4 text-muted-foreground">{featuredPost.excerpt}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{featuredPost.author}</span>
                      <span>•</span>
                      <time>{featuredPost.date}</time>
                      <span>•</span>
                      <span>{featuredPost.readTime}</span>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <div className="mb-6 flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Search articles..." className="pl-10" />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {categories.map((cat) => (
                    <Button
                      key={cat}
                      variant={selectedCategory === cat ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(cat)}
                      className="whitespace-nowrap"
                    >
                      {cat}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                {posts.map((post) => (
                  <Link key={post.slug} href={`/blog/${post.slug}`}>
                    <Card className="h-full overflow-hidden transition-all hover:shadow-lg">
                      <div className="aspect-video w-full overflow-hidden bg-muted">
                        <img src={post.image} alt={post.title} className="h-full w-full object-cover transition-transform hover:scale-105" />
                      </div>
                      <div className="p-6">
                        <div className="mb-3 flex items-center gap-2">
                          <Badge variant="secondary">{post.category}</Badge>
                          <span className="text-xs text-muted-foreground">{post.views} views</span>
                        </div>
                        <h2 className="mb-2 text-xl font-semibold line-clamp-2">{post.title}</h2>
                        <p className="mb-4 text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{post.author}</span>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{post.readTime}</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>

              <div className="mt-8 flex justify-center gap-2">
                <Button variant="outline" size="sm">Previous</Button>
                <Button variant="outline" size="sm">1</Button>
                <Button size="sm">2</Button>
                <Button variant="outline" size="sm">3</Button>
                <Button variant="outline" size="sm">Next</Button>
              </div>
            </div>

            <aside className="space-y-6">
              <Card className="p-6">
                <h3 className="mb-4 font-semibold">Subscribe to Newsletter</h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  Get the latest articles and updates delivered to your inbox.
                </p>
                <div className="space-y-2">
                  <Input placeholder="Your email" type="email" />
                  <Button className="w-full">Subscribe</Button>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="mb-4 font-semibold">Trending Topics</h3>
                <div className="flex flex-wrap gap-2">
                  {trendingTopics.map((topic) => (
                    <Badge key={topic} variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                      {topic}
                    </Badge>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="mb-4 font-semibold">Popular Posts</h3>
                <div className="space-y-4">
                  {posts.slice(0, 3).map((post, idx) => (
                    <Link key={post.slug} href={`/blog/${post.slug}`} className="block group">
                      <div className="flex gap-3">
                        <span className="text-2xl font-bold text-muted-foreground/30">{idx + 1}</span>
                        <div>
                          <h4 className="text-sm font-medium group-hover:text-primary line-clamp-2">{post.title}</h4>
                          <p className="text-xs text-muted-foreground">{post.views} views</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </Card>

              <Card className="p-6 bg-primary text-primary-foreground">
                <h3 className="mb-2 font-semibold">Join Our Community</h3>
                <p className="mb-4 text-sm opacity-90">
                  Connect with artists and fans worldwide.
                </p>
                <Button variant="secondary" className="w-full">
                  Get Started
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Card>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}
