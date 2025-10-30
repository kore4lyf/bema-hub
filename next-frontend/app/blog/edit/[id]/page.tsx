"use client";

import { Navbar } from "@/components/custom/Navbar";
import { Footer } from "@/components/custom/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CategorySelector } from "@/components/blog/CategorySelector";
import { WordPressEditor } from "@/components/blog/WordPressEditor";
import { ArrowLeft, Save, Eye, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGetPostQuery, useUpdatePostMutation } from "@/lib/api/blogApi";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";

interface FormData {
  title: string;
  content: string;
  excerpt: string;
  status: 'draft' | 'publish';
  category: string;
}

export default function EditBlogPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const postId = parseInt(params.id);

  const { data: post, isLoading: postLoading, error } = useGetPostQuery(postId);
  const [updatePost, { isLoading: updating }] = useUpdatePostMutation();

  const { control, handleSubmit, watch, reset, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      title: "",
      content: "",
      excerpt: "",
      status: 'draft',
      category: "",
    }
  });

  const watchedData = watch();

  const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>/g, '');
  };

  useEffect(() => {
    if (post) {
      reset({
        title: stripHtml(post.title.rendered),
        content: post.content.rendered,
        excerpt: stripHtml(post.excerpt.rendered),
        status: post.status as 'draft' | 'publish',
        category: post.categories && post.categories.length > 0 ? post.categories[0].toString() : "",
      });
    }
  }, [post, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      const postData = {
        title: data.title.trim(),
        content: data.content.trim(),
        excerpt: data.excerpt.trim() || undefined,
        status: data.status,
        categories: data.category ? [parseInt(data.category)] : undefined,
      };

      await updatePost({ id: postId, data: postData }).unwrap();
      toast.success('Post updated successfully!');
      router.push(`/blog/${post?.slug}`);
    } catch (error) {
      toast.error('Failed to update post');
    }
  };

  const handlePreview = () => {
    const previewWindow = window.open('', '_blank');
    if (previewWindow) {
      previewWindow.document.write(`
        <html>
          <head>
            <title>Preview: ${watchedData.title}</title>
            <style>
              body { font-family: system-ui; max-width: 800px; margin: 0 auto; padding: 20px; }
              .excerpt { font-size: 1.2em; color: #666; margin-bottom: 2em; }
              .content { line-height: 1.6; }
            </style>
          </head>
          <body>
            <h1>${watchedData.title}</h1>
            ${watchedData.excerpt ? `<div class="excerpt">${watchedData.excerpt}</div>` : ''}
            <div class="content">${watchedData.content}</div>
          </body>
        </html>
      `);
    }
  };

  if (postLoading) {
    return (
      <>
        <Navbar />
        <main className="container max-w-4xl py-12 px-4 sm:px-6 mx-auto">
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
        <main className="container max-w-4xl py-12 px-4 sm:px-6 mx-auto">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Post not found</h1>
            <p className="text-muted-foreground mb-6">The post you're trying to edit doesn't exist.</p>
            <Link href="/blog/manage">
              <Button>Back to Manage</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="container max-w-4xl py-12 px-4 sm:px-6 mx-auto">
        <div className="mb-8">
          <Link href="/blog/manage" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6">
            <ArrowLeft className="h-4 w-4" />
            Back to Manage
          </Link>
          <h1 className="text-3xl font-bold">Edit Post</h1>
          <p className="text-muted-foreground">Update your blog post</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Card className="p-6">
            <div className="space-y-6">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Controller
                  name="title"
                  control={control}
                  rules={{ required: "Title is required" }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Enter post title..."
                      className="mt-2"
                    />
                  )}
                />
                {errors.title && (
                  <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="excerpt">Excerpt</Label>
                <Controller
                  name="excerpt"
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      placeholder="Brief description of your post..."
                      className="mt-2"
                      rows={3}
                    />
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Category</Label>
                  <div className="mt-2">
                    <Controller
                      name="category"
                      control={control}
                      render={({ field }) => (
                        <CategorySelector
                          value={field.value}
                          onValueChange={field.onChange}
                          placeholder="Select or create category"
                        />
                      )}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="status">Status</Label>
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="publish">Publish</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div>
              <Label>Content *</Label>
              <div className="mt-2">
                <Controller
                  name="content"
                  control={control}
                  rules={{ required: "Content is required" }}
                  render={({ field }) => (
                    <WordPressEditor
                      content={field.value}
                      onChange={field.onChange}
                      placeholder="Start writing your post..."
                    />
                  )}
                />
                {errors.content && (
                  <p className="text-sm text-red-500 mt-1">{errors.content.message}</p>
                )}
              </div>
            </div>
          </Card>

          <div className="flex gap-4">
            <Button type="submit" disabled={updating}>
              <Save className="h-4 w-4 mr-2" />
              {updating ? 'Updating...' : 'Update Post'}
            </Button>
            <Button type="button" variant="outline" onClick={handlePreview}>
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Link href={`/blog/${post?.slug}`}>
              <Button type="button" variant="outline">
                View Post
              </Button>
            </Link>
          </div>
        </form>
      </main>
      <Footer />
    </>
  );
}
