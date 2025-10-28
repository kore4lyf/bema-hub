"use client";

import { Navbar } from "@/components/custom/Navbar";
import { Footer } from "@/components/custom/footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, TrendingUp, Clock, Music, Users, Plus, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useGetPostsQuery, useGetCategoriesQuery } from "@/lib/api/blogApi";

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  const { data: categories = [] } = useGetCategoriesQuery();
  const { data: posts = [], isLoading, error } = useGetPostsQuery({
    page,
    per_page: 12,
    search: searchQuery || undefined,
    categories: selectedCategory !== "All" ? 
      categories.find(cat => cat.name === selectedCategory)?.id.toString() : undefined,
    orderby: 'date',
    order: 'desc'
  });

  const categoryOptions = ["All", ...categories.map(cat => cat.name)];
  const featuredPost = posts[0];
  const regularPosts = posts.slice(1);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>/g, '').substring(0, 150) + '...';
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
        <div className="container py-12 px-4 sm:px-6 mx-auto">
          <div className="mb-12 text-center">
            <Badge variant="secondary" className="mb-4 px-4 py-2">
              <Music className="h-4 w-4 mr-2" />
              Bema Music Blog
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Stories from the <span className="text-purple-600">Echo Loop</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Stay updated with the latest from Bema Music, community highlights, and insider stories from our Echo Loop ecosystem.
            </p>
            <Link href="/blog/create">
              <Button className="mt-6">
                <Plus className="h-4 w-4 mr-2" />
                Create Post
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500">Failed to load blog posts</p>
            </div>
          ) : (
            <>
              {featuredPost && (
                <div className="mb-8">
                  <Link href={`/blog/${featuredPost.slug}`}>
                    <Card className="overflow-hidden hover:shadow-xl transition-all bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                      <div className="grid md:grid-cols-2 gap-6">
                        {featuredPost._embedded?.['wp:featuredmedia']?.[0] && (
                          <div className="aspect-video md:aspect-auto overflow-hidden">
                            <img 
                              src={featuredPost._embedded['wp:featuredmedia'][0].source_url} 
                              alt={featuredPost._embedded['wp:featuredmedia'][0].alt_text || featuredPost.title.rendered}
                              className="h-full w-full object-cover" 
                            />
                          </div>
                        )}
                        <div className="p-8 flex flex-col justify-center">
                          <Badge className="mb-4 w-fit bg-yellow-500 text-black">Featured</Badge>
                          <h2 className="text-3xl font-bold mb-4" dangerouslySetInnerHTML={{ __html: featuredPost.title.rendered }} />
                          <p className="text-white/90 mb-6">{stripHtml(featuredPost.excerpt.rendered)}</p>
                          <div className="flex items-center gap-4 text-sm text-white/80">
                            <span>{featuredPost._embedded?.author?.[0]?.name || 'Bema Music'}</span>
                            <span>•</span>
                            <span>{formatDate(featuredPost.date)}</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Link>
                </div>
              )}

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
                {categoryOptions.map((cat) => (
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
                    {regularPosts.map((post) => (
                      <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-all group">
                        {post._embedded?.['wp:featuredmedia']?.[0] && (
                          <div className="aspect-video overflow-hidden bg-muted">
                            <img 
                              src={post._embedded['wp:featuredmedia'][0].source_url}
                              alt={post._embedded['wp:featuredmedia'][0].alt_text || post.title.rendered}
                              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" 
                            />
                          </div>
                        )}
                        <div className="p-6">
                          {post._embedded?.['wp:term']?.[0] && (
                            <div className="flex flex-wrap gap-2 mb-3">
                              {post._embedded['wp:term'][0].slice(0, 3).map((category) => (
                                <Badge 
                                  key={category.id}
                                  variant="secondary" 
                                  className="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                                >
                                  {category.name}
                                </Badge>
                              ))}
                            </div>
                          )}
                          
                          <Link href={`/blog/${post.slug}`}>
                            <h2 
                              className="text-xl font-semibold mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors"
                              dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                            />
                          </Link>
                          
                          <p className="text-muted-foreground mb-4 line-clamp-2 text-sm">
                            {stripHtml(post.excerpt.rendered)}
                          </p>
                          
                          <div className="space-y-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <span>{post._embedded?.author?.[0]?.name || 'Bema Music'}</span>
                              <span>•</span>
                              <span>{formatDate(post.date)}</span>
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
                        Categories
                      </h3>
                      <div className="space-y-3">
                        {categories.slice(0, 5).map((category) => (
                          <div key={category.id} className="flex items-center justify-between p-2 rounded-lg bg-white/50 dark:bg-black/20">
                            <span className="text-sm font-medium">{category.name}</span>
                            <Badge variant="outline" className="text-xs">{category.count}</Badge>
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
                          <Link key={post.id} href={`/blog/${post.slug}`}>
                            <div className="flex gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                              {post._embedded?.['wp:featuredmedia']?.[0] && (
                                <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                                  <img 
                                    src={post._embedded['wp:featuredmedia'][0].source_url} 
                                    alt={post.title.rendered}
                                    className="w-full h-full object-cover" 
                                  />
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <h4 
                                  className="font-medium text-sm line-clamp-2 mb-1"
                                  dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                                />
                                <p className="text-xs text-muted-foreground">{formatDate(post.date)}</p>
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
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
