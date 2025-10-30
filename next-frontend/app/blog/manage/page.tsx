"use client";

import { Navbar } from "@/components/custom/Navbar";
import { Footer } from "@/components/custom/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Edit, Trash2, Eye, Loader2, MoreHorizontal, Filter } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useGetPostsQuery, useDeletePostMutation } from "@/lib/api/blogApi";

export default function ManageBlogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: posts = [], isLoading, error, refetch } = useGetPostsQuery({
    per_page: 50,
    orderby: 'date',
    order: 'desc',
    context: 'edit',
    _embed: true
  });

  const [deletePost] = useDeletePostMutation();

  const filteredPosts = posts.filter(post =>
    post.title.rendered.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getPostImage = (post: any) => {
    return post._embedded?.['wp:featuredmedia']?.[0]?.source_url || null;
  };

  const getPostAuthor = (post: any) => {
    return post._embedded?.author?.[0]?.name || "Unknown";
  };

  const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>/g, '');
  };

  const handleDelete = async (id: number, title: string) => {
    if (confirm(`Delete "${stripHtml(title)}"?`)) {
      try {
        await deletePost(id).unwrap();
        refetch();
      } catch (error) {
        alert('Failed to delete post');
      }
    }
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-background">
          <div className="flex items-center justify-center pt-32">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-card border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div>
                <h1 className="text-2xl font-semibold">Posts</h1>
                <p className="text-sm text-muted-foreground">{posts.length} total posts</p>
              </div>
              <Link href="/blog/create">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Post
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="Search posts..." 
                className="pl-10" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>

          {/* Posts Grid */}
          {error ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Failed to load posts</p>
              <Button onClick={() => refetch()} className="mt-4">Retry</Button>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">No posts yet</h3>
              <p className="text-muted-foreground mb-6">Get started by creating your first post</p>
              <Link href="/blog/create">
                <Button>Create Post</Button>
              </Link>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredPosts.map((post) => (
                <Card key={post.id} className="hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-4 flex-1">
                        {getPostImage(post) && (
                          <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                            <img 
                              src={getPostImage(post)} 
                              alt={stripHtml(post.title.rendered)} 
                              className="w-full h-full object-cover" 
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-medium truncate">
                              {stripHtml(post.title.rendered)}
                            </h3>
                            <Badge 
                              variant={post.status === 'publish' ? 'default' : 'secondary'}
                            >
                              {post.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                            {stripHtml(post.excerpt.rendered)}
                          </p>
                          <div className="flex items-center text-xs text-muted-foreground gap-4">
                            <span>{getPostAuthor(post)}</span>
                            <span>•</span>
                            <span>{new Date(post.date).toLocaleDateString()}</span>
                            <span>•</span>
                            <span>{new Date(post.modified).toLocaleDateString()} (modified)</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <Link href={`/blog/${post.slug}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/blog/edit/${post.id}`}>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDelete(post.id, post.title.rendered)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
