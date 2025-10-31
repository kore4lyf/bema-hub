"use client";

import { Navbar } from "@/components/custom/Navbar";
import { Footer } from "@/components/custom/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, TrendingUp, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useMemo } from "react";
import { useGetPostsQuery, useGetCategoriesQuery } from "@/lib/api/blogApi";

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: categories = [] } = useGetCategoriesQuery();

  const categoryOptions = useMemo(() => {
    return ["All", ...categories.map(cat => cat.name)];
  }, [categories]);

  const selectedCategoryId = useMemo(() => {
    if (selectedCategory === "All") return null;
    const category = categories.find(cat => cat.name === selectedCategory);
    return category?.id || null;
  }, [selectedCategory, categories]);

  const { data: posts = [], isLoading: postsLoading, error: postsError } = useGetPostsQuery({
    per_page: 20,
    orderby: 'date',
    order: 'desc',
    categories: selectedCategoryId ? [selectedCategoryId] : undefined,
    search: searchQuery || undefined,
    _embed: true
  });

  const featuredPost = posts[0];
  const regularPosts = posts.slice(1);

  const getPostImage = (post: any) => {
    return post._embedded?.['wp:featuredmedia']?.[0]?.source_url || null;
  };

  const getPostAuthor = (post: any) => {
    return post._embedded?.author?.[0]?.name || "Bema Music Team";
  };

  const getPostTags = (post: any) => {
    return post._embedded?.['wp:term']?.[1] || [];
  };

  const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>/g, '');
  };

  const calculateReadTime = (content: string) => {
    const words = stripHtml(content).split(' ').length;
    const readTime = Math.ceil(words / 200);
    return `${readTime} min read`;
  };

  if (postsLoading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-background">
          <div className="container py-12 px-4 sm:px-6 mx-auto">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Loading blog posts...</p>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (postsError) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-background">
          <div className="container py-12 px-4 sm:px-6 mx-auto">
            <div className="mb-12 text-center">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                Latest <span className="text-purple-600">Updates</span>
              </h1>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                Stay updated with the latest from Bema Music, community highlights, and insider stories from our Echo Loop ecosystem.
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <Card className="p-12 text-center border-2 border-dashed border-gray-300 dark:border-gray-700">
                  <div className="max-w-md mx-auto">
                    <div className="mb-6">
                      <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        Unable to Load Posts
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-6">
                        We're having trouble connecting to our content server. This might be a temporary issue.
                      </p>
                    </div>
                    <div className="space-y-3">
                      <Button 
                        onClick={() => window.location.reload()} 
                        className="w-full"
                      >
                        Refresh Page
                      </Button>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        If the problem persists, please check your internet connection or try again later.
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
              
              <div className="space-y-6">
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
                
                <Card className="p-6">
                  <h3 className="font-semibold mb-4">Need Help?</h3>
                  <div className="space-y-3 text-sm">
                    <Link href="/contact" className="block text-blue-600 hover:text-blue-800">
                      → Contact Support
                    </Link>
                    <Link href="/help" className="block text-blue-600 hover:text-blue-800">
                      → Help Center
                    </Link>
                    <Link href="/" className="block text-blue-600 hover:text-blue-800">
                      → Back to Home
                    </Link>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <div className="container py-12 px-4 sm:px-6 mx-auto">
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Latest <span className="text-purple-600">Updates</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Stay updated with the latest from Bema Music, community highlights, and insider stories from our Echo Loop ecosystem.
            </p>
          </div>

          {featuredPost && (
            <div className="mb-8">
              <Link href={`/blog/${featuredPost.slug}`}>
                <Card className="overflow-hidden hover:shadow-xl transition-all bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                  <div className={`grid gap-6 ${getPostImage(featuredPost) ? 'md:grid-cols-2' : ''}`}>
                    {getPostImage(featuredPost) && (
                      <div className="aspect-video md:aspect-auto overflow-hidden">
                        <img 
                          src={getPostImage(featuredPost)} 
                          alt={stripHtml(featuredPost.title.rendered)} 
                          className="h-full w-full object-cover" 
                        />
                      </div>
                    )}
                    <div className="p-8 flex flex-col justify-center">
                      <Badge className="mb-4 w-fit bg-yellow-500 text-black">Featured</Badge>
                      <h2 className="text-3xl font-bold mb-4">{stripHtml(featuredPost.title.rendered)}</h2>
                      <p className="text-white/90 mb-6">{stripHtml(featuredPost.excerpt.rendered)}</p>
                      <div className="flex items-center gap-4 text-sm text-white/80">
                        <span>{getPostAuthor(featuredPost)}</span>
                        <span>•</span>
                        <span>{new Date(featuredPost.date).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{calculateReadTime(featuredPost.content.rendered)}</span>
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
              {posts.length === 0 ? (
                <div className="text-center py-16">
                  <h3 className="text-lg font-medium mb-2">No posts yet</h3>
                  <p className="text-muted-foreground">Check back soon for new content.</p>
                </div>
              ) : regularPosts.length === 0 && posts.length === 1 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">More posts coming soon.</p>
                </div>
              ) : regularPosts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">No posts match your search.</p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setSelectedCategory("All");
                      setSearchQuery("");
                    }}
                  >
                    Clear filters
                  </Button>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2">
                  {regularPosts.map((post) => (
                    <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-all group">
                      {getPostImage(post) && (
                        <div className="aspect-video overflow-hidden bg-muted">
                          <img 
                            src={getPostImage(post)} 
                            alt={stripHtml(post.title.rendered)} 
                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" 
                          />
                        </div>
                      )}
                      <div className="p-6">
                        <div className="flex flex-wrap gap-2 mb-3">
                          {getPostTags(post).slice(0, 3).map((tag: any) => (
                            <Badge 
                              key={tag.id}
                              variant="secondary" 
                              className="bg-muted text-muted-foreground"
                            >
                              {tag.name}
                            </Badge>
                          ))}
                        </div>
                        
                        <Link href={`/blog/${post.slug}`}>
                          <h2 className="text-xl font-semibold mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                            {stripHtml(post.title.rendered)}
                          </h2>
                        </Link>
                        
                        <p className="text-muted-foreground mb-4 line-clamp-2 text-sm">
                          {stripHtml(post.excerpt.rendered)}
                        </p>
                        
                        <div className="space-y-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <span>{getPostAuthor(post)}</span>
                            <span>•</span>
                            <span>{new Date(post.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span>{calculateReadTime(post.content.rendered)}</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
            
            <div className="space-y-6">
              <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950 border-purple-200 dark:border-purple-800">
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"> 
                    Categories
                  </h3>
                  <div className="space-y-3">
                    {categories.slice(0, 5).map((category, index) => (
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
                          {getPostImage(post) && (
                            <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                              <img 
                                src={getPostImage(post)} 
                                alt={stripHtml(post.title.rendered)} 
                                className="w-full h-full object-cover" 
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm line-clamp-2 mb-1">
                              {stripHtml(post.title.rendered)}
                            </h4>
                            <p className="text-xs text-muted-foreground">
                              {new Date(post.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </Card>

              <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-2">Stay in the Loop</h3>
                  <p className="text-white/90 mb-4 text-sm">
                    Get exclusive updates, early access to campaigns, and behind-the-scenes content delivered straight to your inbox.
                  </p>
                  <form className="space-y-3">
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      className="bg-white/10 border-white/30 text-white placeholder:text-white/60 focus:border-white/50 text-sm"
                      required
                    />
                    <Button 
                      type="submit" 
                      className="w-full bg-white text-purple-600 hover:bg-white/90 text-sm"
                    >
                      Subscribe
                    </Button>
                  </form>
                  <p className="text-xs text-white/70 mt-3 text-center">
                    No spam, unsubscribe at any time.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
