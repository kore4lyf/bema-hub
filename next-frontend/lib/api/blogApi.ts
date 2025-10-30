import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface BlogPost {
  id: number;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  slug: string;
  date: string;
  modified: string;
  status: 'publish' | 'draft' | 'private';
  author: number;
  featured_media: number;
  categories: number[];
  tags: number[];
  _embedded?: {
    author?: Array<{
      id: number;
      name: string;
      avatar_urls: Record<string, string>;
    }>;
    'wp:featuredmedia'?: Array<{
      id: number;
      source_url: string;
      alt_text: string;
    }>;
    'wp:term'?: Array<Array<{
      id: number;
      name: string;
      slug: string;
    }>>;
  };
}

export interface BlogCategory {
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
  tagTypes: ['BlogPost', 'BlogCategory'],
  endpoints: (builder) => ({
    // Get all posts with filters
    getPosts: builder.query<BlogPost[], {
      per_page?: number;
      page?: number;
      orderby?: 'date' | 'title' | 'modified';
      order?: 'asc' | 'desc';
      categories?: number[];
      tags?: number[];
      search?: string;
      status?: string;
      _embed?: boolean;
    }>({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();
        
        // Default parameters
        searchParams.append('per_page', (params.per_page || 10).toString());
        searchParams.append('orderby', params.orderby || 'date');
        searchParams.append('order', params.order || 'desc');
        
        // Optional parameters
        if (params.page) searchParams.append('page', params.page.toString());
        if (params.categories?.length) {
          searchParams.append('categories', params.categories.join(','));
        }
        if (params.tags?.length) {
          searchParams.append('tags', params.tags.join(','));
        }
        if (params.search) searchParams.append('search', params.search);
        if (params.status) searchParams.append('status', params.status);
        if (params._embed) searchParams.append('_embed', 'true');
        
        return `/wp-json/wp/v2/posts?${searchParams.toString()}`;
      },
      providesTags: ['BlogPost'],
    }),

    // Get single post by slug
    getPostBySlug: builder.query<BlogPost, string>({
      query: (slug) => `/wp-json/wp/v2/posts?slug=${slug}&_embed=true`,
      transformResponse: (response: BlogPost[]) => response[0],
      providesTags: (result) => result ? [{ type: 'BlogPost', id: result.id }] : [],
    }),

    // Get single post by ID
    getPost: builder.query<BlogPost, number>({
      query: (id) => `/wp-json/wp/v2/posts/${id}?_embed=true`,
      providesTags: (result) => result ? [{ type: 'BlogPost', id: result.id }] : [],
    }),

    // Get categories
    getCategories: builder.query<BlogCategory[], void>({
      query: () => '/wp-json/wp/v2/categories?per_page=100',
      providesTags: ['BlogCategory'],
    }),

    // Create new post
    createPost: builder.mutation<BlogPost, CreatePostData>({
      query: (data) => ({
        url: '/wp-json/wp/v2/posts',
        method: 'POST',
        body: data,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      invalidatesTags: ['BlogPost'],
    }),

    // Update post
    updatePost: builder.mutation<BlogPost, { id: number; data: Partial<CreatePostData> }>({
      query: ({ id, data }) => ({
        url: `/wp-json/wp/v2/posts/${id}`,
        method: 'POST',
        body: data,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      invalidatesTags: (result) => result ? [{ type: 'BlogPost', id: result.id }] : [],
    }),

    // Delete post
    deletePost: builder.mutation<{ deleted: boolean }, number>({
      query: (id) => ({
        url: `/wp-json/wp/v2/posts/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['BlogPost'],
    }),

    // Search posts
    searchPosts: builder.query<BlogPost[], { query: string; per_page?: number }>({
      query: ({ query, per_page = 10 }) => 
        `/posts?search=${encodeURIComponent(query)}&per_page=${per_page}&_embed=true`,
      providesTags: ['BlogPost'],
    }),

    // Get featured posts
    getFeaturedPosts: builder.query<BlogPost[], { per_page?: number }>({
      query: ({ per_page = 5 } = {}) => 
        `/posts?meta_key=featured&meta_value=1&per_page=${per_page}&_embed=true`,
      providesTags: ['BlogPost'],
    }),
  }),
});

export const {
  useGetPostsQuery,
  useGetPostBySlugQuery,
  useGetPostQuery,
  useGetCategoriesQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useSearchPostsQuery,
  useGetFeaturedPostsQuery,
} = blogApi;