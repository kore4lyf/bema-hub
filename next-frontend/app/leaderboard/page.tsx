"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Trophy, 
  Medal, 
  Crown, 
  Star,
  ArrowUp,
  ArrowDown,
  Minus
} from "lucide-react";

// Mock data for leaderboard
const leaderboardData = [
  {
    id: 1,
    name: "Alex Morgan",
    username: "@alexmorgan",
    avatar: "/placeholder.svg",
    points: 12500,
    rank: 1,
    previousRank: 2,
    isOnline: true,
    badges: ["Top Creator", "Community Leader"]
  },
  {
    id: 2,
    name: "Taylor Swift",
    username: "@taylorswift",
    avatar: "/placeholder.svg",
    points: 11800,
    rank: 2,
    previousRank: 1,
    isOnline: false,
    badges: ["Top Earner", "Fan Favorite"]
  },
  {
    id: 3,
    name: "Chris Evans",
    username: "@chrisevans",
    avatar: "/placeholder.svg",
    points: 9450,
    rank: 3,
    previousRank: 4,
    isOnline: true,
    badges: ["Rising Star"]
  },
  {
    id: 4,
    name: "Emma Watson",
    username: "@emmawatson",
    avatar: "/placeholder.svg",
    points: 8900,
    rank: 4,
    previousRank: 3,
    isOnline: false,
    badges: ["Consistent Creator"]
  },
  {
    id: 5,
    name: "Michael Jordan",
    username: "@michaelj",
    avatar: "/placeholder.svg",
    points: 7600,
    rank: 5,
    previousRank: 5,
    isOnline: true,
    badges: ["Veteran"]
  },
  {
    id: 6,
    name: "Beyoncé Knowles",
    username: "@beyonce",
    avatar: "/placeholder.svg",
    points: 6800,
    rank: 6,
    previousRank: 7,
    isOnline: true,
    badges: ["Top Performer"]
  },
  {
    id: 7,
    name: "Leonardo DiCaprio",
    username: "@leonardod",
    avatar: "/placeholder.svg",
    points: 5900,
    rank: 7,
    previousRank: 6,
    isOnline: false,
    badges: ["Quality Creator"]
  },
  {
    id: 8,
    name: "Scarlett Johansson",
    username: "@scarlettj",
    avatar: "/placeholder.svg",
    points: 5200,
    rank: 8,
    previousRank: 8,
    isOnline: true,
    badges: ["Engager"]
  }
];

const categoryData = [
  { name: "Overall", active: true },
  { name: "Music" },
  { name: "Visual Arts" },
  { name: "Writing" },
  { name: "Performance" }
];

export default function LeaderboardPage() {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Medal className="h-5 w-5 text-amber-600" />;
      default:
        return <Trophy className="h-5 w-5 text-blue-500" />;
    }
  };

  const getRankChangeIcon = (current: number, previous: number) => {
    if (current < previous) {
      return <ArrowUp className="h-4 w-4 text-green-500" />;
    } else if (current > previous) {
      return <ArrowDown className="h-4 w-4 text-red-500" />;
    } else {
      return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8 px-4 sm:px-6 mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Creator Leaderboard</h1>
          <p className="text-muted-foreground mt-2">
            Discover the top creators in our community based on engagement and contributions
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <CardTitle>Top Creators</CardTitle>
                  <div className="flex flex-wrap gap-2">
                    {categoryData.map((category) => (
                      <Button
                        key={category.name}
                        variant={category.active ? "default" : "outline"}
                        size="sm"
                        className={category.active ? "" : "text-muted-foreground"}
                      >
                        {category.name}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {leaderboardData.map((creator) => (
                    <div 
                      key={creator.id} 
                      className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <div className="relative">
                            <div className="relative h-12 w-12 rounded-full overflow-hidden bg-gray-200">
                              <img 
                                src={creator.avatar} 
                                alt={creator.name} 
                                className="h-full w-full object-cover"
                              />
                              <div className="absolute inset-0 flex items-center justify-center bg-gray-200 text-gray-600 font-medium">
                                {creator.name.charAt(0)}
                              </div>
                            </div>
                            {creator.isOnline && (
                              <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 ring-2 ring-background"></div>
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              {getRankIcon(creator.rank)}
                              <span className="font-semibold">{creator.name}</span>
                              {creator.rank <= 3 && (
                                <Badge variant="secondary" className="text-xs">
                                  Top {creator.rank}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{creator.username}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6">
                        <div className="flex flex-wrap gap-1">
                          {creator.badges.map((badge, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {badge}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <div className="text-right">
                            <div className="font-semibold">{creator.points.toLocaleString()}</div>
                            <div className="text-xs text-muted-foreground">points</div>
                          </div>
                          <div className="flex flex-col items-center">
                            {getRankChangeIcon(creator.rank, creator.previousRank)}
                            <span className="text-xs text-muted-foreground">
                              {Math.abs(creator.rank - creator.previousRank) || "-"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>How It Works</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Star className="h-5 w-5 text-yellow-500 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Points System</h3>
                    <p className="text-sm text-muted-foreground">
                      Earn points through engagement, content creation, and community contributions.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Trophy className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Rankings</h3>
                    <p className="text-sm text-muted-foreground">
                      Climb the leaderboard by consistently creating valuable content.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Medal className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Rewards</h3>
                    <p className="text-sm text-muted-foreground">
                      Top creators receive exclusive rewards and recognition.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Top Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Music</span>
                    <span className="font-semibold">12,500 pts</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Visual Arts</span>
                    <span className="font-semibold">9,800 pts</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Writing</span>
                    <span className="font-semibold">7,200 pts</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Performance</span>
                    <span className="font-semibold">5,600 pts</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Your Position</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4">
                  <div className="text-3xl font-bold mb-2">-</div>
                  <p className="text-muted-foreground mb-4">Sign in to see your rank</p>
                  <Button className="w-full">Sign In</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
