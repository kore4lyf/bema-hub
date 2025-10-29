"use client";

import { Navbar } from "@/components/custom/Navbar";
import { Footer } from "@/components/custom/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, TrendingUp, Clock, ChevronRight, Music, Users, Crown } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const categories = ["All", "Music Updates", "Echo Loop", "Artist Stories", "Community", "Behind the Scenes", "Tutorials"];

const featuredPost = {
  slug: "bema-music-2025-vision",
  title: "Bema Music 2025: Our Vision for the Echo Loop Community",
  excerpt: "Discover how we're revolutionizing artist-fan relationships through our innovative referral ecosystem and what's coming next for the Bema Music community.",
  category: "Music Updates",
  date: "2025-10-24",
  readTime: "8 min read",
  author: "Bema Music Team",
  image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=1200&q=80"
};

const posts = [
  {
    slug: "echo-loop-ambassador-program-launch",
    title: "Introducing the Echo Loop Ambassador Program",
    excerpt: "Learn about our new Ambassador program and how top community members can get direct access to the Bema Music team.",
    category: "Echo Loop",
    tags: ["Echo Loop", "Ambassador", "Community"],
    date: "2025-10-22",
    readTime: "6 min read",
    author: "Community Team",
    views: "3.2k",
    image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&q=80"
  },
  {
    slug: "behind-the-scenes-new-album",
    title: "Behind the Scenes: Creating Our Latest Album",
    excerpt: "Get an exclusive look into the creative process behind Bema Music's upcoming release and the stories behind each track.",
    category: "Behind the Scenes",
    tags: ["Behind the Scenes", "Music Production", "Album"],
    date: "2025-10-20",
    readTime: "10 min read",
    author: "Bema Music",
    views: "5.7k",
    image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80"
  },
  {
    slug: "pro-member-success-stories",
    title: "Pro Member Success Stories: How Echo Loop Changed Lives",
    excerpt: "Real stories from Pro members who've built amazing connections and opportunities through the Echo Loop referral system.",
    category: "Community",
    tags: ["Community", "Success Stories", "Pro Members"],
    date: "2025-10-18",
    readTime: "7 min read",
    author: "Sarah Chen",
    views: "4.1k",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80"
  },
  {
    slug: "maximizing-echo-loop-referrals",
    title: "Maximizing Your Echo Loop Referral Potential",
    excerpt: "Expert tips on how to grow your network, earn more rewards, and climb the ranks from member to Pro to Ambassador.",
    category: "Tutorials",
    tags: ["Tutorials", "Referrals", "Growth"],
    date: "2025-10-16",
    readTime: "5 min read",
    author: "Growth Team",
    views: "6.3k",
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80"
  },
  {
    slug: "live-session-highlights-october",
    title: "October Live Session Highlights",
    excerpt: "Missed our live sessions this month? Catch up on the best moments, fan interactions, and exclusive performances.",
    category: "Music Updates",
    tags: ["Music Updates", "Live Sessions", "Highlights"],
    date: "2025-10-14",
    readTime: "4 min read",
    author: "Events Team",
    views: "2.8k",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80"
  },
  {
    slug: "artist-collaboration-opportunities",
    title: "New Artist Collaboration Opportunities in Echo Loop",
    excerpt: "Discover how emerging artists can collaborate with Bema Music and get featured in our campaigns and live sessions.",
    category: "Artist Stories",
    tags: ["Artist Stories", "Collaboration", "Opportunities"],
    date: "2025-10-12",
    readTime: "6 min read",
    author: "A&R Team",
    views: "3.9k",
    image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80"
  },
  {
    slug: "community-spotlight-top-ambassadors",
    title: "Community Spotlight: Meet Our Top Ambassadors",
    excerpt: "Get to know the passionate community leaders who are driving the Echo Loop forward and making a difference.",
    category: "Community",
    tags: ["Community", "Spotlight", "Ambassadors"],
    date: "2025-10-10",
    readTime: "8 min read",
    author: "Community Team",
    views: "4.5k",
    image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&q=80"
  },
  {
    slug: "upcoming-campaigns-november",
    title: "Upcoming Campaigns: November Preview",
    excerpt: "Get ready for exciting new campaigns launching next month, including exclusive album previews and live performance opportunities.",
    category: "Music Updates",
    tags: ["Music Updates", "Campaigns", "Preview"],
    date: "2025-10-08",
    readTime: "5 min read",
    author: "Campaign Team",
    views: "7.2k",
    image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&q=80"
  }
];

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    const matchesSearch = searchQuery === "" || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
        <div className="container py-12 px-4 sm:px-6 mx-auto">
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Stories from the <span className="text-purple-600">Echo Loop</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Stay updated with the latest from Bema Music, community highlights, and insider stories from our Echo Loop ecosystem.
            </p>
          </div>

          <div className="mb-8">
            <Link href={`/blog/${featuredPost.slug}`}>
              <Card className="overflow-hidden hover:shadow-xl transition-all bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="aspect-video md:aspect-auto overflow-hidden">
                    <img src={featuredPost.image} alt={featuredPost.title} className="h-full w-full object-cover" />
                  </div>
                  <div className="p-8 flex flex-col justify-center">
                    <Badge className="mb-4 w-fit bg-yellow-500 text-black">Featured</Badge>
                    <h2 className="text-3xl font-bold mb-4">{featuredPost.title}</h2>
                    <p className="text-white/90 mb-6">{featuredPost.excerpt}</p>
                    <div className="flex items-center gap-4 text-sm text-white/80">
                      <span>{featuredPost.author}</span>
                      <span>•</span>
                      <span>{new Date(featuredPost.date).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{featuredPost.readTime}</span>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="Search Echo Loop stories..." 
                className="pl-10" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
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

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="grid gap-6 md:grid-cols-2">
                {filteredPosts.map((post) => (
                  <Card key={post.slug} className="overflow-hidden hover:shadow-lg transition-all group">
                    <div className="aspect-video overflow-hidden bg-muted">
                      <img 
                        src={post.image} 
                        alt={post.title} 
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" 
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex flex-wrap gap-2 mb-3">
                        {post.tags.map((tag) => (
                          <Badge 
                            key={tag}
                            variant="secondary" 
                            className="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      
                      <Link href={`/blog/${post.slug}`}>
                        <h2 className="text-xl font-semibold mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                          {post.title}
                        </h2>
                      </Link>
                      
                      <p className="text-muted-foreground mb-4 line-clamp-2 text-sm">
                        {post.excerpt}
                      </p>
                      
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <span>{post.author}</span>
                          <span>•</span>
                          <span>{new Date(post.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>{post.views} views</span>
                          <span>•</span>
                          <span>{post.readTime}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
            
            <div className="space-y-6">
              <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950 border-purple-200 dark:border-purple-800">
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                    Trending Topics
                  </h3>
                  <div className="space-y-3">
                    {["Echo Loop Referrals", "Ambassador Program", "Live Sessions", "New Music Releases", "Community Stories"].map((topic, index) => (
                      <div key={topic} className="flex items-center justify-between p-2 rounded-lg bg-white/50 dark:bg-black/20">
                        <span className="text-sm font-medium">{topic}</span>
                        <Badge variant="outline" className="text-xs">#{index + 1}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
              
              <Card>
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Recent Updates</h3>
                  <div className="space-y-4">
                    {posts.slice(0, 3).map((post) => (
                      <Link key={post.slug} href={`/blog/${post.slug}`}>
                        <div className="flex gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                          <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                            <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm line-clamp-2 mb-1">{post.title}</h4>
                            <p className="text-xs text-muted-foreground">{new Date(post.date).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </Card>

              <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-2">Join the Echo Loop</h3>
                  <p className="text-white/90 mb-4 text-sm">
                    Get exclusive access to Bema Music content, early releases, and community perks.
                  </p>
                  <Link href="/signup">
                    <Button className="w-full bg-white text-purple-600 hover:bg-white/90">
                      Join Now
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
