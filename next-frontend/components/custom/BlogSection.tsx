"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export function BlogSection() {
  const blogPosts = [
    {
      title: "How Echo Loop Boosts Your Earnings",
      excerpt: "Discover how our innovative system helps artists earn more directly from their supporters.",
      image: "/placeholder.svg"
    },
    {
      title: "Behind the Scenes of Christmas EP",
      excerpt: "Get an exclusive look at the making of our upcoming holiday release.",
      image: "/placeholder.svg"
    },
    {
      title: "Artist Ownership 101",
      excerpt: "Learn why data ownership matters and how Bema Hub puts you in control.",
      image: "/placeholder.svg"
    }
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container px-4 sm:px-6 mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Latest from Bema Hub</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Insights, tips, and stories from our community
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post, index) => (
            <Card key={index} className="overflow-hidden">
              <div className="h-48 bg-gray-200 relative">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle>{post.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  {post.excerpt}
                </p>
                <Button variant="link" className="p-0 h-auto font-medium">
                  Read More
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}