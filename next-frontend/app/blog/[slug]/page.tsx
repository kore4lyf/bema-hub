"use client";

import { Navbar } from "@/components/custom/Navbar";
import { Footer } from "@/components/custom/footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Calendar, Clock, Share2, Heart, MessageCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useGetPostBySlugQuery, useGetPostsQuery } from "@/lib/api/blogApi";
import { toast } from 'sonner';

interface BlogPostPageProps {
  params: { slug: string };
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const { data: post, isLoading, error } = useGetPostBySlugQuery(params.slug);
  const { data: relatedPosts = [] } = useGetPostsQuery({ 
    per_page: 3,
    categories: post?.categories?.[0]?.toString()
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post?.title.rendered,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
          <div className="container py-12 px-4 sm:px-6 mx-auto max-w-4xl">
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !post) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
          <div className="container py-12 px-4 sm:px-6 mx-auto max-w-4xl">
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
              <p className="text-muted-foreground mb-6">The blog post you're looking for doesn't exist.</p>
              <Link href="/blog">
                <Button>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Blog
                </Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const author = post._embedded?.author?.[0];
  const featuredImage = post._embedded?.['wp:featuredmedia']?.[0];
  const categories = post._embedded?.['wp:term']?.[0] || [];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
        <div className="container py-8 px-4 sm:px-6 mx-auto max-w-4xl">
          <Link href="/blog">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Button>
          </Link>

          <article className="space-y-8">
            <header className="space-y-6">
              {categories.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {categories.slice(0, 3).map((category) => (
                    <Badge key={category.id} variant="secondary">
                      {category.name}
                    </Badge>
                  ))}
                </div>
              )}

              <h1 
                className="text-4xl md:text-5xl font-bold leading-tight"
                dangerouslySetInnerHTML={{ __html: post.title.rendered }}
              />

              {post.excerpt.rendered && (
                <p 
                  className="text-xl text-muted-foreground leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
                />
              )}

              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={author?.avatar_urls?.['96']} />
                    <AvatarFallback>
                      {author?.name?.charAt(0) || 'B'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{author?.name || 'Bema Music'}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(post.date)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={handleShare}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            </header>

            {featuredImage && (
              <div className="aspect-video overflow-hidden rounded-xl bg-muted">
                <img
                  src={featuredImage.source_url}
                  alt={featuredImage.alt_text || post.title.rendered}
                  className="h-full w-full object-cover"
                />
              </div>
            )}

            <div className="grid gap-8 lg:grid-cols-4">
              <div className="lg:col-span-3">
                <Card className="p-8">
                  <div 
                    className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-a:text-blue-600 hover:prose-a:text-blue-800"
                    dangerouslySetInnerHTML={{ __html: post.content.rendered }}
                  />
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">About the Author</h3>
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar>
                      <AvatarImage src={author?.avatar_urls?.['96']} />
                      <AvatarFallback>
                        {author?.name?.charAt(0) || 'B'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{author?.name || 'Bema Music'}</p>
                      <p className="text-sm text-muted-foreground">Author</p>
                    </div>
                  </div>
                </Card>

                {relatedPosts.length > 0 && (
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Related Posts</h3>
                    <div className="space-y-4">
                      {relatedPosts.filter(p => p.id !== post.id).slice(0, 3).map((relatedPost) => (
                        <Link key={relatedPost.id} href={`/blog/${relatedPost.slug}`}>
                          <div className="flex gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                            {relatedPost._embedded?.['wp:featuredmedia']?.[0] && (
                              <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                                <img
                                  src={relatedPost._embedded['wp:featuredmedia'][0].source_url}
                                  alt={relatedPost.title.rendered}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <h4 
                                className="font-medium text-sm line-clamp-2 mb-1"
                                dangerouslySetInnerHTML={{ __html: relatedPost.title.rendered }}
                              />
                              <p className="text-xs text-muted-foreground">
                                {formatDate(relatedPost.date)}
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </Card>
                )}

                <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold mb-2">Join the Echo Loop</h3>
                    <p className="text-white/90 mb-4 text-sm">
                      Get exclusive access to more content like this.
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
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
