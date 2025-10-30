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
import { ArrowLeft, Save, Eye, Settings } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCreatePostMutation } from "@/lib/api/blogApi";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";

interface FormData {
  title: string;
  content: string;
  excerpt: string;
  status: 'draft' | 'publish';
  category: string;
}

export default function CreateBlogPage() {
  const router = useRouter();
  const [createPost, { isLoading }] = useCreatePostMutation();

  const { control, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      title: "",
      content: "",
      excerpt: "",
      status: 'draft',
      category: "",
    }
  });

  const watchedData = watch();

  const onSubmit = async (data: FormData) => {
    try {
      const postData = {
        title: data.title.trim(),
        content: data.content.trim(),
        excerpt: data.excerpt.trim() || undefined,
        status: data.status,
        categories: data.category ? [parseInt(data.category)] : undefined,
      };

      const result = await createPost(postData).unwrap();
      toast.success(`Post ${data.status === 'publish' ? 'published' : 'saved'} successfully!`);
      router.push(`/blog/${result.slug}`);
    } catch (error) {
      toast.error('Failed to create post');
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
              body { font-family: system-ui; max-width: 800px; margin: 0 auto; padding: 20px; line-height: 1.6; }
              .excerpt { font-size: 1.2em; color: #666; margin-bottom: 2em; }
              .content img { max-width: 100%; height: auto; }
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

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-card border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-4">
                <Link href="/blog/manage" className="text-muted-foreground hover:text-foreground">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
                <div>
                  <h1 className="text-xl font-semibold">New Post</h1>
                  <p className="text-sm text-muted-foreground">Create and publish your content</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button type="button" variant="outline" onClick={handlePreview}>
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                <Button 
                  form="post-form" 
                  type="submit" 
                  disabled={isLoading}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? 'Saving...' : watchedData.status === 'publish' ? 'Publish' : 'Save Draft'}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <form id="post-form" onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              {/* Title */}
              <Card>
                <div className="p-6">
                  <Controller
                    name="title"
                    control={control}
                    rules={{ required: "Title is required" }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Enter your post title..."
                        className="text-2xl font-bold border-none p-0 focus-visible:ring-0 bg-transparent"
                      />
                    )}
                  />
                  {errors.title && (
                    <p className="text-sm text-destructive mt-2">{errors.title.message}</p>
                  )}
                </div>
              </Card>

              {/* Content Editor */}
              <Card>
                <div className="p-6">
                  <Controller
                    name="content"
                    control={control}
                    rules={{ required: "Content is required" }}
                    render={({ field }) => (
                      <WordPressEditor
                        content={field.value}
                        onChange={field.onChange}
                        placeholder="Tell your story..."
                      />
                    )}
                  />
                  {errors.content && (
                    <p className="text-sm text-destructive mt-2">{errors.content.message}</p>
                  )}
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Publish Settings */}
              <Card>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Settings className="h-4 w-4 text-muted-foreground" />
                    <h3 className="font-medium">Publish</h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Status</Label>
                      <Controller
                        name="status"
                        control={control}
                        render={({ field }) => (
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger className="mt-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="draft">Draft</SelectItem>
                              <SelectItem value="publish">Published</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                  </div>
                </div>
              </Card>

              {/* Categories */}
              <Card>
                <div className="p-6">
                  <h3 className="font-medium mb-4">Category</h3>
                  <Controller
                    name="category"
                    control={control}
                    render={({ field }) => (
                      <CategorySelector
                        value={field.value}
                        onValueChange={field.onChange}
                        placeholder="Select category"
                      />
                    )}
                  />
                </div>
              </Card>

              {/* Excerpt */}
              <Card>
                <div className="p-6">
                  <h3 className="font-medium mb-4">Excerpt</h3>
                  <Controller
                    name="excerpt"
                    control={control}
                    render={({ field }) => (
                      <Textarea
                        {...field}
                        placeholder="Write a brief description..."
                        rows={4}
                        className="resize-none"
                      />
                    )}
                  />
                  <p className="text-xs text-muted-foreground mt-2">Brief description for previews and SEO</p>
                </div>
              </Card>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}
