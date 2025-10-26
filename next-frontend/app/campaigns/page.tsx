"use client";

import { Navbar } from "@/components/custom/Navbar";
import { Footer } from "@/components/custom/footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Users, Calendar, Music, Crown, Star, Search, Filter, Radio, Mic } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const liveCampaigns = [
  {
    slug: "live-album-recording",
    title: "Live Album Recording Session",
    description: "Join us for a live recording session of our upcoming album. Real-time participation and exclusive behind-the-scenes access.",
    status: "Live Now",
    participants: 1247,
    endDate: "2025-10-26",
    category: "Live Recording",
    level: "All Members",
    rewards: ["Live Access", "Recording Credits", "Exclusive Content"],
    image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=80"
  },
  {
    slug: "live-qa-session",
    title: "Live Q&A with Bema Music",
    description: "Ask your questions directly to the artists in this live interactive session. Pro and Ambassador members get priority.",
    status: "Live Now",
    participants: 892,
    endDate: "2025-10-26",
    category: "Interactive",
    level: "Pro & Ambassador",
    rewards: ["Direct Access", "Q&A Participation", "Exclusive Insights"],
    image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&q=80"
  }
];

const campaigns = [
  {
    slug: "new-album-launch",
    title: "New Album Launch Campaign",
    description: "Be part of the exclusive launch of Bema Music's latest album. Early access, signed copies, and studio footage for Echo Loop members.",
    status: "Active",
    participants: 1567,
    endDate: "2025-11-15",
    daysLeft: 21,
    category: "Music Release",
    level: "All Members",
    rewards: ["Early Access", "Signed Album", "Studio Footage"],
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80"
  },
  {
    slug: "acoustic-sessions-series",
    title: "Intimate Acoustic Sessions",
    description: "Join exclusive acoustic performances in unique venues. Limited to Pro and Ambassador members only.",
    status: "Pro Only",
    participants: 234,
    endDate: "2025-12-10",
    daysLeft: 46,
    category: "Live Performance",
    level: "Pro & Ambassador",
    rewards: ["Live Performance", "Q&A Session", "Photo Opportunity"],
    image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=80"
  },
  {
    slug: "music-video-collaboration",
    title: "Fan-Featured Music Video",
    description: "Submit your content to be featured in Bema Music's next official music video. Ambassadors get priority selection.",
    status: "Active",
    participants: 892,
    endDate: "2025-11-30",
    daysLeft: 36,
    category: "Collaboration",
    level: "All Members",
    rewards: ["Video Feature", "Credits", "Exclusive Screening"],
    image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80"
  },
  {
    slug: "echo-loop-ambassador-program",
    title: "Echo Loop Ambassador Program",
    description: "Apply to become an official Bema Music Ambassador. Get direct access to the team and exclusive perks.",
    status: "Application Open",
    participants: 156,
    endDate: "2025-12-20",
    daysLeft: 56,
    category: "Community",
    level: "Pro Members",
    rewards: ["Ambassador Status", "Direct Access", "Exclusive Perks"],
    image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80"
  },
  {
    slug: "charity-concert-series",
    title: "Music for Change Concert",
    description: "Support local communities through music. All Echo Loop levels can participate in this charity initiative.",
    status: "Active",
    participants: 1234,
    endDate: "2025-11-25",
    daysLeft: 31,
    category: "Charity",
    level: "All Members",
    rewards: ["Concert Access", "Charity Recognition", "Special Merchandise"],
    image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&q=80"
  }
];

const categories = ["All", "Music Release", "Live Performance", "Collaboration", "Community", "Charity"];

export default function CampaignsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("trending");

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
        <div className="container max-w-7xl px-4 py-12 sm:px-6 mx-auto">
          <div className="mb-12 text-center">
            <Badge variant="secondary" className="mb-4 px-4 py-2">
              <Music className="h-4 w-4 mr-2" />
              Bema Music Campaigns
            </Badge>
            <h1 className="mb-4 text-4xl md:text-5xl font-bold tracking-tight">
              Join the <span className="text-blue-600">Echo Loop</span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Participate in exclusive Bema Music campaigns and unlock rewards through our community-driven initiatives
            </p>
          </div>

          {liveCampaigns.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center gap-2 mb-6">
                <Radio className="h-5 w-5 text-red-500 animate-pulse" />
                <h2 className="text-2xl font-bold">Live Campaigns</h2>
                <Badge className="bg-red-500 animate-pulse">LIVE</Badge>
              </div>
              <div className="overflow-x-auto pb-4">
                <div className="flex gap-6 min-w-max">
                  {liveCampaigns.map((campaign) => (
                    <Card key={campaign.slug} className="min-w-[400px] overflow-hidden bg-gradient-to-r from-red-600 to-pink-600 text-white hover:shadow-xl transition-all">
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <Badge className="bg-white/20 text-white animate-pulse">
                            <Radio className="h-3 w-3 mr-1" />
                            {campaign.status}
                          </Badge>
                          <div className="flex items-center gap-1 text-sm">
                            <Users className="h-4 w-4" />
                            {campaign.participants.toLocaleString()}
                          </div>
                        </div>
                        
                        <h3 className="text-xl font-bold mb-2">{campaign.title}</h3>
                        <p className="text-white/90 mb-4 text-sm">{campaign.description}</p>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          {campaign.rewards.slice(0, 2).map((reward, index) => (
                            <Badge key={index} variant="secondary" className="bg-white/20 text-white text-xs">
                              {reward}
                            </Badge>
                          ))}
                        </div>
                        
                        <Link href={`/campaigns/${campaign.slug}`}>
                          <Button className="w-full bg-white text-red-600 hover:bg-white/90">
                            Join Live Campaign
                          </Button>
                        </Link>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search Bema Music campaigns..." className="pl-10" />
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
                <div className="aspect-video w-full overflow-hidden bg-muted relative">
                  <img src={campaign.image} alt={campaign.title} className="h-full w-full object-cover transition-transform hover:scale-105" />
                  {campaign.status === "Pro Only" && (
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-blue-600">
                        <Crown className="h-3 w-3 mr-1" />
                        Pro Only
                      </Badge>
                    </div>
                  )}
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="mb-3 flex items-center justify-between">
                    <Badge variant={campaign.status === "Active" ? "default" : campaign.status === "Pro Only" ? "secondary" : "outline"}>
                      {campaign.status}
                    </Badge>
                    <Badge variant="outline">{campaign.category}</Badge>
                  </div>
                  
                  <h2 className="mb-2 text-xl font-semibold line-clamp-2">{campaign.title}</h2>
                  <p className="mb-3 text-sm text-muted-foreground line-clamp-2 flex-1">{campaign.description}</p>
                  
                  <div className="mb-4">
                    <p className="text-xs text-muted-foreground mb-2">Echo Loop Level: {campaign.level}</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {campaign.rewards.slice(0, 2).map((reward, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {reward}
                        </Badge>
                      ))}
                      {campaign.rewards.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{campaign.rewards.length - 2} more
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {campaign.participants.toLocaleString()} members joined
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{campaign.daysLeft} days left</span>
                    </div>
                    <Link href={`/campaigns/${campaign.slug}`}>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                        Join Campaign
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Card className="p-8 bg-gradient-to-r from-blue-50 to-pink-50 dark:from-blue-950 dark:to-pink-950 border-blue-200 dark:border-blue-800">
              <Music className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Become an Echo Loop Ambassador</h3>
              <p className="text-muted-foreground mb-6">
                Ready to take your Bema Music journey to the next level? Apply for Ambassador status and get direct access to the team.
              </p>
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                Apply for Ambassador
              </Button>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
