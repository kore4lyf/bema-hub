"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Calendar, 
  User, 
  Tag,
  ChevronLeft,
  ChevronRight,
  Clock
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Mock data for blog posts
const blogPosts = [
  {
    id: 1,
    title: "How Echo Loop Boosts Your Earnings",
    excerpt: "Discover how our innovative system helps artists earn more directly from their fans through meaningful engagement.",
    image: "/placeholder.svg",
    author: "Alex Morgan",
    date: "2025-10-15",
    readTime: "5 min read",
    category: "Earnings",
    tags: ["Echo Loop", "Revenue", "Fan Engagement"]
  },
  {
    id: 2,
    title: "Behind the Scenes of Christmas EP",
    excerpt: "Get an exclusive look at the making of our upcoming holiday release, featuring special guest collaborations.",
    image: "/placeholder.svg",
    author: "Taylor Swift",
    date: "2025-10-10",
    readTime: "8 min read",
    category: "Music",
    tags: ["Christmas EP", "Behind the Scenes", "Collaboration"]
  },
  {
    id: 3,
    title: "Artist Ownership 101",
    excerpt: "Learn why data ownership matters and how Bema Hub puts you in control of your creative journey.",
    image: "/placeholder.svg",
    author: "Chris Evans",
    date: "2025-10-05",
    readTime: "6 min read",
    category: "Education",
    tags: ["Data Ownership", "Control", "Creative Freedom"]
  },
  {
    id: 4,
    title: "Building Community Through Live Streaming",
    excerpt: "Tips and tricks for creating engaging live stream experiences that foster genuine connections with your audience.",
    image: "/placeholder.svg",
    author: "Emma Watson",
    date: "2025-09-28",
    readTime: "7 min read",
    category: "Community",
    tags: ["Live Streaming", "Engagement", "Audience Building"]
  },
  {
    id: 5,
    title: "The Power of Referrals: Growing Your Fanbase",
    excerpt: "How the Echo Loop referral system helps artists expand their reach while rewarding their most loyal supporters.",
    image: "/placeholder.svg",
    author: "Michael Jordan",
    date: "2025-09-20",
    readTime: "4 min read",
    category: "Growth",
    tags: ["Referrals", "Fanbase", "Echo Loop"]
  },
  {
    id: 6,
    title: "Maximizing Your Membership Benefits",
    excerpt: "A comprehensive guide to getting the most out of your Bema Hub membership tiers and exclusive features.",
    image: "/placeholder.svg",
    author: "Beyoncé Knowles",
    date: "2025-09-15",
    readTime: "9 min read",
    category: "Membership",
    tags: ["Membership", "Benefits", "Tiers"]
  }
];

const categories = [
  "All",
  "Earnings",
  "Music",
  "Education",
  "Community",
  "Growth",
  "Membership"
];

const tags = [
  "Echo Loop",
  "Revenue",
  "Fan Engagement",
  "Christmas EP",
  "Behind the Scenes",
  "Collaboration",
  "Data Ownership",
  "Control",
  "Creative Freedom"
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8 px-4 sm:px-6 mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight">Bema Hub Blog</h1>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Insights, tips, and stories from our community of artists and fans
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-4">
          <div className="lg:col-span-3">
            <div className="grid gap-6 md:grid-cols-2">
              {blogPosts.map((post) => (
                <Card key={post.id} className="overflow-hidden flex flex-col">
                  <div className="relative h-48">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary">{post.category}</Badge>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="mr-1 h-4 w-4" />
                        {post.readTime}
                      </div>
                    </div>
                    <CardTitle className="text-xl">
                      <Link href={`/blog/${post.id}`} className="hover:text-primary transition-colors">
                        {post.title}
                      </Link>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="text-muted-foreground mb-4">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <User className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{post.author}</span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="mr-1 h-4 w-4" />
                        {new Date(post.date).toLocaleDateString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-center mt-12">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline">1</Button>
                <Button variant="outline">2</Button>
                <Button variant="outline">3</Button>
                <Button variant="outline" size="icon">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Search className="mr-2 h-5 w-5" />
                  Search
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Input placeholder="Search articles..." className="pl-10" />
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={category === "All" ? "default" : "ghost"}
                      className="w-full justify-start"
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Popular Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Newsletter</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Get the latest posts delivered right to your inbox.
                </p>
                <div className="space-y-3">
                  <Input placeholder="Your email" type="email" />
                  <Button className="w-full">Subscribe</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}