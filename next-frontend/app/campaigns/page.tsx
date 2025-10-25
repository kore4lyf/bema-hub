"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Filter,
  Search,
  Eye
} from "lucide-react";
import { Input } from "@/components/ui/input";

// Mock data for campaigns
const campaigns = [
  {
    id: 1,
    title: "Christmas EP Recording Fund",
    description: "Help us record our special holiday EP featuring 5 original songs and 3 traditional arrangements with guest musicians.",
    creator: "Taylor Swift",
    image: "/placeholder.svg"
  },
  {
    id: 2,
    title: "New Studio Equipment",
    description: "Upgrading our home studio with professional recording equipment to improve sound quality for all future releases.",
    creator: "Alex Morgan",
    image: "/placeholder.svg"
  },
  {
    id: 3,
    title: "Music Video Production",
    description: "Creating a high-quality music video for our latest single to promote it across streaming platforms and social media.",
    creator: "Chris Evans",
    image: "/placeholder.svg"
  },
  {
    id: 4,
    title: "Tour Support Fund",
    description: "Raising funds to cover travel and accommodation costs for our upcoming regional tour dates.",
    creator: "Emma Watson",
    image: "/placeholder.svg"
  },
  {
    id: 5,
    title: "Art Collaboration Project",
    description: "Partnering with visual artists to create unique album artwork and merchandise for our next release.",
    creator: "Michael Jordan",
    image: "/placeholder.svg"
  }
];

const categories = [
  "All",
  "Music",
  "Equipment",
  "Video",
  "Tour",
  "Art"
];

export default function CampaignsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8 px-4 sm:px-6 mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight">Campaigns</h1>
          <p className="text-muted-foreground mt-4 max-w-2xl">
            Support your favorite creators and help bring their creative projects to life
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search campaigns..." className="pl-10" />
          </div>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {campaigns.map((campaign) => (
              <Card key={campaign.id} className="overflow-hidden transition-all hover:shadow-md">
                <div className="relative h-48">
                  <img
                    src={campaign.image}
                    alt={campaign.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl">{campaign.title}</CardTitle>
                  <p className="text-muted-foreground text-sm">
                    by {campaign.creator}
                  </p>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-6 line-clamp-2">
                    {campaign.description}
                  </p>
                  
                  <div className="flex gap-2">
                    <Button className="flex-1" variant="default">
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="space-y-6">
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
                <CardTitle>Create Campaign</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Are you a creator looking to fund your next project?
                </p>
                <Button className="w-full">Start Campaign</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}