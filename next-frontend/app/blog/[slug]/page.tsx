"use client";

import { Navbar } from "@/components/custom/Navbar";
import { Footer } from "@/components/custom/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar } from "@/components/ui/avatar";
import { ArrowLeft, Clock, Eye, Share2, Bookmark, Loader2 } from "lucide-react";
import Link from "next/link";
import { useGetPostBySlugQuery, useGetPostsQuery } from "@/lib/api/blogApi";

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const { data: post, isLoading, error } = useGetPostBySlugQuery(slug);
  const { data: relatedPosts = [] } = useGetPostsQuery({ per_page: 3, _embed: true });

  const getPostImage = (post: any) => {
    return post._embedded?.['wp:featuredmedia']?.[0]?.source_url || null;
  };

  const getPostAuthor = (post: any) => {
    return post._embedded?.author?.[0]?.name || "Bema Music Team";
  };

  const getPostCategories = (post: any) => {
    return post._embedded?.['wp:term']?.[0] || [];
  };

  const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>/g, '');
  };

  const calculateReadTime = (content: string) => {
    const words = stripHtml(content).split(' ').length;
    const readTime = Math.ceil(words / 200);
    return `${readTime} min read`;
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <main className="container max-w-7xl px-4 py-16 sm:px-6 mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading post...</p>
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
        <main className="container max-w-7xl px-4 py-16 sm:px-6 mx-auto">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Post not found</h1>
            <p className="text-muted-foreground mb-6">The post you're looking for doesn't exist.</p>
            <Link href="/blog">
              <Button>Back to Blog</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const categories = getPostCategories(post);
  const featuredImage = getPostImage(post);

  return (
    <>
      <Navbar />
      <main className="container max-w-7xl px-4 py-16 sm:px-6 mx-auto">
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-12">
          <ArrowLeft className="h-4 w-4" />
          Back to Blog
        </Link>

        <div className="grid lg:grid-cols-4 gap-12">
          <article className="lg:col-span-3">
            <div className="mb-8">
              {categories.length > 0 && (
                <Badge variant="secondary" className="mb-6">{categories[0].name}</Badge>
              )}
              <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl leading-tight">
                {stripHtml(post.title.rendered)}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8 bg-primary/10" />
                  <span className="font-medium">{getPostAuthor(post)}</span>
                </div>
                <span>•</span>
                <time>{new Date(post.date).toLocaleDateString()}</time>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{calculateReadTime(post.content.rendered)}</span>
                </div>
              </div>
            </div>

            <div className="mb-8 flex gap-2">
              <Button size="sm" variant="outline">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button size="sm" variant="outline">
                <Bookmark className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>

            {featuredImage && (
              <div className="mb-12 aspect-video w-full overflow-hidden rounded-lg bg-muted">
                <img 
                  src={featuredImage} 
                  alt={stripHtml(post.title.rendered)} 
                  className="h-full w-full object-cover" 
                />
              </div>
            )}

            <div className="prose prose-neutral dark:prose-invert max-w-none prose-lg">
              <div dangerouslySetInnerHTML={{ __html: post.content.rendered }} />
            </div>

            <Separator className="my-12" />

            <Card className="p-8 mb-12">
              <div className="flex gap-6">
                <Avatar className="h-16 w-16 bg-primary/10" />
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">{getPostAuthor(post)}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Content Creator • Passionate about connecting artists and fans
                  </p>
                  <Button size="sm" variant="outline">Follow</Button>
                </div>
              </div>
            </Card>

            {relatedPosts.length > 0 && (
              <div>
                <h3 className="text-2xl font-bold mb-8">Related Articles</h3>
                <div className="grid sm:grid-cols-3 gap-6">
                  {relatedPosts.slice(0, 3).map((relatedPost) => (
                    <Link key={relatedPost.id} href={`/blog/${relatedPost.slug}`}>
                      <Card className="overflow-hidden transition-all hover:shadow-lg">
                        {getPostImage(relatedPost) && (
                          <div className="aspect-video overflow-hidden bg-muted">
                            <img 
                              src={getPostImage(relatedPost)} 
                              alt={stripHtml(relatedPost.title.rendered)} 
                              className="h-full w-full object-cover" 
                            />
                          </div>
                        )}
                        <div className="p-6">
                          {getPostCategories(relatedPost).length > 0 && (
                            <Badge variant="secondary" className="mb-3">
                              {getPostCategories(relatedPost)[0].name}
                            </Badge>
                          )}
                          <h4 className="font-semibold text-sm line-clamp-2">
                            {stripHtml(relatedPost.title.rendered)}
                          </h4>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </article>

          <aside className="space-y-8">
            <Card className="p-6 sticky top-20">
              <h3 className="font-semibold mb-4">Post Details</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Published:</span>
                  <p>{new Date(post.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Author:</span>
                  <p>{getPostAuthor(post)}</p>
                </div>
                {categories.length > 0 && (
                  <div>
                    <span className="text-muted-foreground">Category:</span>
                    <p>{categories[0].name}</p>
                  </div>
                )}
              </div>
            </Card>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}
