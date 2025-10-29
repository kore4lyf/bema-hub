import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface BlogPost {
  id: number;
  slug: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  date: string;
  modified: string;
  status: 'publish' | 'draft' | 'private';
  categories: number[];
  tags: number[];
  featured_media: number;
  author: number;
  _embedded?: {
    author: Array<{ name: string; avatar_urls: { 96: string } }>;
    'wp:featuredmedia': Array<{ source_url: string; alt_text: string }>;
    'wp:term': Array<Array<{ id: number; name: string; slug: string }>>;
  };
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  count: number;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
  count: number;
}

export interface CreatePostData {
  title: string;
  content: string;
  excerpt?: string;
  status: 'publish' | 'draft';
  categories?: number[];
  tags?: number[];
  featured_media?: number;
}

export interface MediaUpload {
  id: number;
  source_url: string;
  alt_text: string;
  media_type: string;
}

export const blogApi = createApi({
  reducerPath: 'blogApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/wp-json/wp/v2`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Post', 'Category', 'Tag', 'Media'],
  endpoints: (builder) => ({
    // Get all posts
    getPosts: builder.query<BlogPost[], { 
      page?: number; 
      per_page?: number; 
      search?: string; 
      categories?: string; 
      tags?: string;
      orderby?: string;
      order?: 'asc' | 'desc';
    }>({
      query: (params = {}) => ({
        url: '/posts',
        params: { _embed: true, ...params },
      }),
      providesTags: ['Post'],
    }),

    // Get single post by slug
    getPostBySlug: builder.query<BlogPost, string>({
      query: (slug) => ({
        url: '/posts',
        params: { slug, _embed: true },
      }),
      transformResponse: (response: BlogPost[]) => response[0],
      providesTags: (result) => result ? [{ type: 'Post', id: result.id }] : [],
    }),

    // Get single post by ID
    getPost: builder.query<BlogPost, number>({
      query: (id) => ({
        url: `/posts/${id}`,
        params: { _embed: true },
      }),
      providesTags: (result) => result ? [{ type: 'Post', id: result.id }] : [],
    }),

    // Create new post
    createPost: builder.mutation<BlogPost, CreatePostData>({
      query: (data) => ({
        url: '/posts',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Post'],
    }),

    // Update post
    updatePost: builder.mutation<BlogPost, { id: number; data: Partial<CreatePostData> }>({
      query: ({ id, data }) => ({
        url: `/posts/${id}`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result) => result ? [{ type: 'Post', id: result.id }] : [],
    }),

    // Delete post
    deletePost: builder.mutation<void, number>({
      query: (id) => ({
        url: `/posts/${id}`,
        method: 'DELETE',
        params: { force: true },
      }),
      invalidatesTags: ['Post'],
    }),

    // Get categories
    getCategories: builder.query<Category[], void>({
      query: () => '/categories',
      providesTags: ['Category'],
    }),

    // Get tags
    getTags: builder.query<Tag[], void>({
      query: () => '/tags',
      providesTags: ['Tag'],
    }),

    // Upload media
    uploadMedia: builder.mutation<MediaUpload, FormData>({
      query: (formData) => ({
        url: '/media',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Media'],
    }),
  }),
});

export const {
  useGetPostsQuery,
  useGetPostBySlugQuery,
  useGetPostQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useGetCategoriesQuery,
  useGetTagsQuery,
  useUploadMediaMutation,
} = blogApi;
