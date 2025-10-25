"use client";

import { Navbar } from "@/components/custom/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Avatar } from "@/components/ui/avatar";
import { Users, Calendar, Target, ArrowLeft, Share2, Heart, Trophy, CheckCircle2, Clock, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const milestones = [
  { target: 500, label: "Early Supporter Badge", completed: true },
  { target: 1000, label: "Exclusive Content Access", completed: true },
  { target: 1500, label: "VIP Event Tickets", completed: false },
  { target: 2000, label: "Meet & Greet Pass", completed: false }
];

const updates = [
  {
    date: "2025-10-23",
    title: "We've reached 1,000 participants!",
    content: "Thank you all for your amazing support. We're halfway to our goal!"
  },
  {
    date: "2025-10-20",
    title: "New rewards unlocked",
    content: "Check out the exclusive merchandise now available for participants."
  },
  {
    date: "2025-10-15",
    title: "Campaign launch",
    content: "Welcome to the Summer Music Festival 2025 campaign!"
  }
];

const topParticipants = [
  { name: "Sarah M.", points: 2450, avatar: "SM" },
  { name: "Alex K.", points: 2180, avatar: "AK" },
  { name: "Jordan P.", points: 1920, avatar: "JP" },
  { name: "Taylor R.", points: 1750, avatar: "TR" },
  { name: "Morgan L.", points: 1680, avatar: "ML" }
];

const faqs = [
  {
    question: "How do I participate?",
    answer: "Click the 'Join Campaign' button and complete the registration. You'll receive instructions on how to earn points and unlock rewards."
  },
  {
    question: "What are the rewards?",
    answer: "Rewards include exclusive badges, early access to content, VIP event tickets, and special merchandise."
  },
  {
    question: "Can I invite friends?",
    answer: "Yes! Share your unique referral link to earn bonus points when friends join."
  },
  {
    question: "When does the campaign end?",
    answer: "The campaign runs until November 30, 2025. Make sure to complete your activities before then!"
  }
];

export default function CampaignDetailPage({ params }: { params: { slug: string } }) {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <>
      <Navbar />
      <main className="container px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <Link href="/campaigns" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8">
            <ArrowLeft className="h-4 w-4" />
            Back to Campaigns
          </Link>

          <div className="mb-8 aspect-[21/9] w-full overflow-hidden rounded-lg bg-muted">
            <img 
              src="https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=1400&q=80" 
              alt="Campaign cover" 
              className="h-full w-full object-cover" 
            />
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Badge>Active</Badge>
                  <Badge variant="outline">Event</Badge>
                </div>
                <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
                  Summer Music Festival 2025
                </h1>
                <p className="text-lg text-muted-foreground mb-6">
                  Help us bring together artists and fans for the biggest music festival of the year.
                </p>
                
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-10 w-10 bg-primary/10" />
                    <div>
                      <p className="text-sm font-medium">Bema Hub</p>
                      <p className="text-xs text-muted-foreground">Campaign Organizer</p>
                    </div>
                  </div>
                  <Separator orientation="vertical" className="h-10" />
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                    <Button size="sm" variant="outline">
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 border-b">
                {["overview", "updates", "leaderboard", "faq"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 text-sm font-medium capitalize transition-colors ${
                      activeTab === tab
                        ? "border-b-2 border-primary text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {activeTab === "overview" && (
                <div className="space-y-8">
                  <div className="prose prose-neutral dark:prose-invert max-w-none">
                    <h2>About This Campaign</h2>
                    <p>
                      The Summer Music Festival 2025 is our most ambitious project yet. We're bringing together 
                      talented artists from across the globe to create an unforgettable experience for music lovers 
                      everywhere.
                    </p>
                    <p>
                      This isn't just a festival—it's a movement. A celebration of creativity, community, and the 
                      power of music to bring people together. Your participation helps make this vision a reality.
                    </p>

                    <h2>Campaign Goals</h2>
                    <ul>
                      <li>Bring together 50+ artists from around the world</li>
                      <li>Create an inclusive, accessible event for all music lovers</li>
                      <li>Support emerging artists with performance opportunities</li>
                      <li>Build lasting connections within the music community</li>
                      <li>Raise awareness for music education programs</li>
                    </ul>

                    <h2>How to Participate</h2>
                    <ol>
                      <li>Join the campaign by clicking the button in the sidebar</li>
                      <li>Complete campaign activities to earn points</li>
                      <li>Unlock milestones and receive exclusive rewards</li>
                      <li>Share with friends to amplify the impact</li>
                      <li>Track your progress on the leaderboard</li>
                    </ol>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4">Campaign Milestones</h3>
                    <div className="space-y-4">
                      {milestones.map((milestone, idx) => (
                        <Card key={idx} className={`p-4 ${milestone.completed ? "bg-primary/5" : ""}`}>
                          <div className="flex items-center gap-4">
                            <div className={`flex h-12 w-12 items-center justify-center rounded-full ${
                              milestone.completed ? "bg-primary text-primary-foreground" : "bg-muted"
                            }`}>
                              {milestone.completed ? (
                                <CheckCircle2 className="h-6 w-6" />
                              ) : (
                                <Trophy className="h-6 w-6" />
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold">{milestone.target.toLocaleString()} Participants</p>
                              <p className="text-sm text-muted-foreground">{milestone.label}</p>
                            </div>
                            {milestone.completed && (
                              <Badge variant="outline">Unlocked</Badge>
                            )}
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "updates" && (
                <div className="space-y-6">
                  {updates.map((update, idx) => (
                    <Card key={idx} className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          <TrendingUp className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{update.title}</h3>
                            <span className="text-xs text-muted-foreground">{update.date}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{update.content}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              {activeTab === "leaderboard" && (
                <div>
                  <Card className="p-6">
                    <h3 className="text-xl font-semibold mb-6">Top Participants</h3>
                    <div className="space-y-4">
                      {topParticipants.map((participant, idx) => (
                        <div key={idx} className="flex items-center gap-4">
                          <div className={`flex h-8 w-8 items-center justify-center rounded-full font-bold ${
                            idx === 0 ? "bg-yellow-500 text-white" :
                            idx === 1 ? "bg-gray-400 text-white" :
                            idx === 2 ? "bg-amber-600 text-white" :
                            "bg-muted"
                          }`}>
                            {idx + 1}
                          </div>
                          <Avatar className="h-10 w-10 bg-primary/10">
                            <div className="flex h-full w-full items-center justify-center text-sm font-semibold">
                              {participant.avatar}
                            </div>
                          </Avatar>
                          <div className="flex-1">
                            <p className="font-medium">{participant.name}</p>
                            <p className="text-sm text-muted-foreground">{participant.points.toLocaleString()} points</p>
                          </div>
                          {idx < 3 && <Trophy className="h-5 w-5 text-primary" />}
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              )}

              {activeTab === "faq" && (
                <div className="space-y-4">
                  {faqs.map((faq, idx) => (
                    <Card key={idx} className="p-6">
                      <h3 className="font-semibold mb-2">{faq.question}</h3>
                      <p className="text-sm text-muted-foreground">{faq.answer}</p>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            <aside className="space-y-6">
              <Card className="p-6 sticky top-20">
                <div className="mb-6 grid gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">1,234</p>
                      <p className="text-sm text-muted-foreground">Participants</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <Target className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">75%</p>
                      <p className="text-sm text-muted-foreground">Complete</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <Calendar className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">36</p>
                      <p className="text-sm text-muted-foreground">Days Left</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Campaign Progress</span>
                    <span className="font-semibold">75%</span>
                  </div>
                  <Progress value={75} className="h-3" />
                  <p className="text-xs text-muted-foreground">1,234 of 2,000 goal</p>
                </div>

                <Button size="lg" className="w-full mb-3">Join Campaign</Button>
                <Button size="lg" variant="outline" className="w-full">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Campaign
                </Button>

                <Separator className="my-6" />

                <div className="space-y-3">
                  <h4 className="font-semibold text-sm">Campaign Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Start Date</span>
                      <span>Oct 15, 2025</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">End Date</span>
                      <span>Nov 30, 2025</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Category</span>
                      <Badge variant="outline" className="h-5">Event</Badge>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h4 className="font-semibold mb-4">Recent Participants</h4>
                <div className="space-y-3">
                  {topParticipants.slice(0, 3).map((participant, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 bg-primary/10">
                        <div className="flex h-full w-full items-center justify-center text-xs font-semibold">
                          {participant.avatar}
                        </div>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{participant.name}</p>
                        <p className="text-xs text-muted-foreground">Just joined</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}
