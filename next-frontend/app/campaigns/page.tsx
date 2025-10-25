"use client";

import { Navbar } from "@/components/custom/Navbar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Users, Calendar, Target, TrendingUp, Search, Filter } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const stats = [
  { label: "Active Campaigns", value: "24", icon: Target },
  { label: "Total Participants", value: "15.2k", icon: Users },
  { label: "Success Rate", value: "94%", icon: TrendingUp }
];

const featuredCampaign = {
  slug: "global-artist-summit-2025",
  title: "Global Artist Summit 2025",
  description: "Join the largest gathering of artists and industry professionals. Network, learn, and grow together.",
  status: "Featured",
  progress: 85,
  participants: 3456,
  goal: 5000,
  endDate: "2025-11-15",
  daysLeft: 21,
  image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=1200&q=80"
};

const campaigns = [
  {
    slug: "summer-music-festival-2025",
    title: "Summer Music Festival 2025",
    description: "Help us bring together artists and fans for the biggest music festival of the year.",
    status: "Active",
    progress: 75,
    participants: 1234,
    goal: 2000,
    endDate: "2025-11-30",
    daysLeft: 36,
    category: "Event",
    image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&q=80"
  },
  {
    slug: "artist-development-program",
    title: "Artist Development Program",
    description: "Support emerging artists with mentorship, resources, and exposure opportunities.",
    status: "Active",
    progress: 45,
    participants: 856,
    goal: 1500,
    endDate: "2025-12-15",
    daysLeft: 51,
    category: "Education",
    image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=80"
  },
  {
    slug: "community-art-showcase",
    title: "Community Art Showcase",
    description: "Celebrate creativity by showcasing diverse art forms from our community members.",
    status: "Active",
    progress: 60,
    participants: 432,
    goal: 800,
    endDate: "2025-12-01",
    daysLeft: 37,
    category: "Showcase",
    image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&q=80"
  },
  {
    slug: "music-production-workshop",
    title: "Music Production Workshop Series",
    description: "Learn from industry experts in this comprehensive workshop series.",
    status: "Upcoming",
    progress: 20,
    participants: 234,
    goal: 500,
    endDate: "2025-12-20",
    daysLeft: 56,
    category: "Workshop",
    image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80"
  },
  {
    slug: "fan-appreciation-month",
    title: "Fan Appreciation Month",
    description: "Special rewards and exclusive content for our amazing community.",
    status: "Active",
    progress: 90,
    participants: 2145,
    goal: 2500,
    endDate: "2025-10-31",
    daysLeft: 6,
    category: "Community",
    image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80"
  },
  {
    slug: "charity-concert-series",
    title: "Charity Concert Series",
    description: "Music for a cause - supporting local communities through art.",
    status: "Active",
    progress: 55,
    participants: 678,
    goal: 1000,
    endDate: "2025-11-25",
    daysLeft: 31,
    category: "Charity",
    image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&q=80"
  }
];

const categories = ["All", "Event", "Education", "Showcase", "Workshop", "Community", "Charity"];

export default function CampaignsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("trending");

  return (
    <>
      <Navbar />
      <main className="container px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">Campaigns</h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Join community-driven initiatives and make an impact
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 mb-12">
            {stats.map((stat) => (
              <Card key={stat.label} className="p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Featured Campaign</h2>
            </div>
            <Link href={`/campaigns/${featuredCampaign.slug}`}>
              <Card className="overflow-hidden transition-all hover:shadow-xl">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="aspect-video md:aspect-auto overflow-hidden bg-muted">
                    <img src={featuredCampaign.image} alt={featuredCampaign.title} className="h-full w-full object-cover" />
                  </div>
                  <div className="p-6 md:p-8 flex flex-col justify-center">
                    <Badge className="mb-4 w-fit">{featuredCampaign.status}</Badge>
                    <h3 className="mb-3 text-3xl font-bold">{featuredCampaign.title}</h3>
                    <p className="mb-6 text-muted-foreground">{featuredCampaign.description}</p>
                    
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div>
                        <p className="text-2xl font-bold">{featuredCampaign.participants.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Participants</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{featuredCampaign.progress}%</p>
                        <p className="text-xs text-muted-foreground">Complete</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{featuredCampaign.daysLeft}</p>
                        <p className="text-xs text-muted-foreground">Days Left</p>
                      </div>
                    </div>

                    <Progress value={featuredCampaign.progress} className="h-2 mb-2" />
                    <p className="text-xs text-muted-foreground mb-4">
                      {featuredCampaign.participants.toLocaleString()} of {featuredCampaign.goal.toLocaleString()} goal
                    </p>
                    
                    <Button size="lg" className="w-full">Join Now</Button>
                  </div>
                </div>
              </Card>
            </Link>
          </div>

          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search campaigns..." className="pl-10" />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <select 
                className="px-3 py-2 text-sm border rounded-md bg-background"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="trending">Trending</option>
                <option value="newest">Newest</option>
                <option value="ending-soon">Ending Soon</option>
                <option value="most-popular">Most Popular</option>
              </select>
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

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {campaigns.map((campaign) => (
              <Card key={campaign.slug} className="overflow-hidden flex flex-col transition-all hover:shadow-lg">
                <div className="aspect-video w-full overflow-hidden bg-muted">
                  <img src={campaign.image} alt={campaign.title} className="h-full w-full object-cover transition-transform hover:scale-105" />
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="mb-3 flex items-center justify-between">
                    <Badge variant={campaign.status === "Active" ? "default" : "secondary"}>
                      {campaign.status}
                    </Badge>
                    <Badge variant="outline">{campaign.category}</Badge>
                  </div>
                  
                  <h2 className="mb-2 text-xl font-semibold line-clamp-2">{campaign.title}</h2>
                  <p className="mb-4 text-sm text-muted-foreground line-clamp-2 flex-1">{campaign.description}</p>
                  
                  <div className="mb-4 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-semibold">{campaign.progress}%</span>
                    </div>
                    <Progress value={campaign.progress} />
                    <p className="text-xs text-muted-foreground">
                      {campaign.participants.toLocaleString()} of {campaign.goal.toLocaleString()} participants
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{campaign.daysLeft} days left</span>
                    </div>
                    <Link href={`/campaigns/${campaign.slug}`}>
                      <Button size="sm">View Details</Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Card className="p-8 bg-primary/5">
              <h3 className="text-2xl font-bold mb-2">Want to Create Your Own Campaign?</h3>
              <p className="text-muted-foreground mb-6">
                Launch your initiative and rally the community around your vision.
              </p>
              <Button size="lg">Start a Campaign</Button>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
}
