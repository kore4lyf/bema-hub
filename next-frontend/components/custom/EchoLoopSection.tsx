"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Crown, Star, Gift, Zap, Music, Repeat } from "lucide-react";
import Link from "next/link";

export function EchoLoopSection() {
  return (
    <section className="py-20 bg-background">
      <div className="container px-4 sm:px-6 mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Community <span className="text-blue-600">Membership</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            BemaHub helps faith-driven artists connect with listeners who truly get their message. 
            No algorithms, no industry gatekeepers - just real community supporting real artists.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16">
          <Card className="relative overflow-hidden border-2 border-blue-200 dark:border-blue-800">
            <div className="absolute top-0 right-0 bg-blue-600 text-white px-3 py-1 text-sm font-medium">
              Pro Level
            </div>
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                  <Star className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold">Pro Member</h3>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-blue-600" />
                  <span>Discover new artists before they blow up</span>
                </li>
                <li className="flex items-center gap-2">
                  <Music className="h-4 w-4 text-blue-600" />
                  <span>Behind-the-scenes content and stories</span>
                </li>
                <li className="flex items-center gap-2">
                  <Gift className="h-4 w-4 text-blue-600" />
                  <span>Help artists reach their goals</span>
                </li>
                <li className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-600" />
                  <span>Join a community that shares your values</span>
                </li>
              </ul>
              <p className="text-sm text-muted-foreground">
                Unlock Pro status through active participation and successful referrals
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-2 border-purple-200 dark:border-purple-800">
            <div className="absolute top-0 right-0 bg-purple-600 text-white px-3 py-1 text-sm font-medium">
              VIP Access
            </div>
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
                  <Star className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold">VIP Member</h3>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-purple-600" />
                  <span>Backstage access to events</span>
                </li>
                <li className="flex items-center gap-2">
                  <Music className="h-4 w-4 text-purple-600" />
                  <span>Private listening parties</span>
                </li>
                <li className="flex items-center gap-2">
                  <Gift className="h-4 w-4 text-purple-600" />
                  <span>Limited edition collectibles</span>
                </li>
                <li className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-purple-600" />
                  <span>VIP community access</span>
                </li>
              </ul>
              <p className="text-sm text-muted-foreground">
                Premium tier for dedicated Echo Loop members
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-2 border-gold-200 dark:border-yellow-600 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950">
            <div className="absolute top-0 right-0 bg-yellow-600 text-white px-3 py-1 text-sm font-medium">
              Ambassador
            </div>
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-full">
                  <Crown className="h-6 w-6 text-yellow-600" />
                </div>
                <h3 className="text-2xl font-bold">Ambassador</h3>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2">
                  <Crown className="h-4 w-4 text-yellow-600" />
                  <span>Direct line to Bema Music team</span>
                </li>
                <li className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-600" />
                  <span>Co-create campaigns & content</span>
                </li>
                <li className="flex items-center gap-2">
                  <Gift className="h-4 w-4 text-yellow-600" />
                  <span>Exclusive merchandise & rewards</span>
                </li>
                <li className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-yellow-600" />
                  <span>Higher referral commissions</span>
                </li>
                <li className="flex items-center gap-2">
                  <Music className="h-4 w-4 text-yellow-600" />
                  <span>Behind-the-scenes access</span>
                </li>
              </ul>
              <p className="text-sm text-muted-foreground">
                Elite status for top contributors and community builders
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}