"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Users, Zap, Target, Gift, TrendingUp } from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      icon: Trophy,
      title: "Scoring System",
      description: "Earn points for every interaction, post, and community contribution",
      color: "text-yellow-500"
    },
    {
      icon: TrendingUp,
      title: "Leaderboards",
      description: "Compete with artists and supporters, climb the ranks and showcase your engagement",
      color: "text-blue-500"
    },
    {
      icon: Gift,
      title: "Rewards Program",
      description: "Redeem your points for exclusive content, merchandise, and experiences",
      color: "text-green-500"
    },
    {
      icon: Users,
      title: "Community Hub",
      description: "Connect with like-minded supporters and discover new artists in your network",
      color: "text-purple-500"
    },
    {
      icon: Target,
      title: "Campaigns",
      description: "Participate in artist campaigns and earn bonus points for special activities",
      color: "text-orange-500"
    },
    {
      icon: Zap,
      title: "Real-time Updates",
      description: "Get instant notifications for new opportunities to earn and engage",
      color: "text-pink-500"
    }
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container px-4 sm:px-6 mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Choose Bema Hub?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Experience the future of artist-fan interaction with our comprehensive scoring and rewards ecosystem
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <feature.icon className={`h-12 w-12 ${feature.color} mb-4`} />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
