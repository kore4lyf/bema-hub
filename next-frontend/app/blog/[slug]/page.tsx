"use client";

import { useState, useEffect } from "react";
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
import { CommentSection } from "@/components/blog/CommentSection";

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const [slug, setSlug] = useState<string | null>(null);

  useEffect(() => {
    params.then((resolvedParams) => {
      setSlug(resolvedParams.slug);
    });
  }, [params]);

  const { data: post, isLoading, error } = useGetPostBySlugQuery(slug || "", {
    skip: !slug,
  });
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

  const getPostAuthorAvatar = (post: any) => {
    return post._embedded?.author?.[0]?.avatar_urls?.['48'] || 
           post._embedded?.author?.[0]?.avatar_urls?.['96'] || 
           '/placeholder.svg';
  };

  const handleShare = async () => {
    if (navigator.share && post) {
      try {
        await navigator.share({
          title: stripHtml(post.title.rendered),
          text: stripHtml(post.excerpt.rendered),
          url: window.location.href,
        });
      } catch (err) {
        navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
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
                  <Avatar className="h-8 w-8 bg-primary/10">
                    <img
                      src={getPostAuthorAvatar(post)}
                      alt={getPostAuthor(post)}
                      className="h-full w-full object-cover"
                    />
                  </Avatar>
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

            {featuredImage && (
              <div className="mb-12 aspect-video w-full overflow-hidden rounded-lg bg-muted">
                <img 
                  src={featuredImage} 
                  alt={stripHtml(post.title.rendered)} 
                  className="h-full w-full object-cover" 
                />
              </div>
            )}

            <Separator className="my-12" />

            <div className="prose prose-neutral dark:prose-invert max-w-none prose-lg">
              <div dangerouslySetInnerHTML={{ __html: post.content.rendered }} />
            </div>

            <Separator className="my-12" />

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

            {/* Comments Section */}
            {post.comment_status === 'open' ? (
              <div className="mt-12">
                <CommentSection postId={post.id} />
              </div>
            ) : (
              <div className="mt-12 text-center py-8 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                <p className="text-gray-600 dark:text-gray-400">Comments are disabled for this post.</p>
              </div>
            )}
          </article>

          <aside className="space-y-6">
            {/* Post Metadata */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Post Information</h3>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Published:</span>
                  <span className="font-medium">{new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</span>
                </div>
                
                {post.modified !== post.date && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Updated:</span>
                    <span className="font-medium">{new Date(post.modified).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Reading time:</span>
                  <span className="font-medium">{calculateReadTime(post.content.rendered)}</span>
                </div>

                {post.sticky && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <Badge variant="secondary" className="text-xs">Pinned Post</Badge>
                  </div>
                )}
              </div>
            </Card>

            {/* Categories & Tags */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Topics</h3>
              <div className="space-y-4">
                {categories.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Categories</h4>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((category: any) => (
                        <Link key={category.id} href={`/blog?category=${category.slug}`}>
                          <Badge variant="secondary" className="hover:bg-primary hover:text-primary-foreground transition-colors">
                            {category.name}
                          </Badge>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {post._embedded?.['wp:term']?.[1]?.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {post._embedded['wp:term'][1].slice(0, 6).map((tag: any) => (
                        <Link key={tag.id} href={`/blog?tag=${tag.slug}`}>
                          <Badge variant="outline" className="text-xs hover:bg-secondary transition-colors">
                            #{tag.name}
                          </Badge>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Table of Contents */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Share This Post</h3>
              <div className="space-y-3 flex flex-wrap gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleShare}
                  className="justify-start"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>

                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Link copied to clipboard!');
                  }}
                  className="justify-start"
                >
                  <Bookmark className="h-4 w-4 mr-2" />
                  Copy Link
                </Button>
              </div>
            </Card>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}
