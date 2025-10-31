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

export interface Tag {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
  meta: any[];
  _links: any;
}

export interface CreateTagData {
  name: string;
  description?: string;
  slug?: string;
}
export interface CreateCategoryData {
  name: string;
  description?: string;
  slug?: string;
}
export interface Comment {
  id: number;
  post?: number;
  parent: number;
  author: number;
  author_name: string;
  author_email?: string;
  author_url?: string;
  author_avatar_urls: Record<string, string>;
  date: string;
  date_gmt?: string;
  content: {
    rendered: string;
  };
  status?: 'approved' | 'hold' | 'spam' | 'trash';
  type?: string;
  author_user_agent?: string;
  meta?: any[];
  _links?: any;
  link?: string;
  // Additional fields for role detection
  author_role?: 'subscriber' | 'administrator';
}

export interface CreateCommentData {
  post: number;
  parent?: number;
  content: string;
  // For authenticated users, WordPress will automatically use the logged-in user's details
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
  tagTypes: ['BlogPost', 'BlogCategory', 'Comment', 'Tag', 'Media'],
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
        
        return `/posts?${searchParams.toString()}`;
      },
      providesTags: ['BlogPost'],
    }),

    // Get single post by slug
    getPostBySlug: builder.query<BlogPost, string>({
      query: (slug) => `/posts?slug=${slug}&_embed=true`,
      transformResponse: (response: BlogPost[]) => response[0],
      providesTags: (result) => result ? [{ type: 'BlogPost', id: result.id }] : [],
    }),

    // Get single post by ID
    getPost: builder.query<BlogPost, number>({
      query: (id) => `/posts/${id}?_embed=true`,
      providesTags: (result) => result ? [{ type: 'BlogPost', id: result.id }] : [],
    }),

    // Get categories
    getCategories: builder.query<BlogCategory[], void>({
      query: () => '/categories?per_page=100',
      providesTags: ['BlogCategory'],
    }),
    // Create category
    createCategory: builder.mutation<BlogCategory, CreateCategoryData>({
      query: (data) => ({
        url: '/categories',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['BlogCategory'],
    }),
    // Create new post
    createPost: builder.mutation<BlogPost, CreatePostData>({
      query: (data) => ({
        url: '/posts',
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
        url: `/posts/${id}`,
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
        url: `/posts/${id}`,
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

    // Get comments for a post
    getComments: builder.query<Comment[], { post: number; per_page?: number; order?: 'asc' | 'desc' }>({
      query: ({ post, per_page = 50, order = 'asc' }) => 
        `/comments?post=${post}&per_page=${per_page}&order=${order}`,
      providesTags: (result, error, { post }) => 
        result ? [{ type: 'Comment' as const, id: post }] : [],
    }),

    // Create a comment
    createComment: builder.mutation<Comment, CreateCommentData>({
      query: (data) => ({
        url: '/comments',
        method: 'POST',
        body: data,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      invalidatesTags: (result) => 
        result ? [{ type: 'Comment' as const, id: result.post }] : [],
    }),

    // Reply to a comment
    replyToComment: builder.mutation<Comment, CreateCommentData>({
      query: (data) => ({
        url: '/comments',
        method: 'POST',
        body: data,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      invalidatesTags: (result) => 
        result ? [{ type: 'Comment' as const, id: result.post }] : [],
    }),

    // Get tags
    getTags: builder.query<Tag[], { search?: string; per_page?: number }>({
      query: ({ search, per_page = 50 } = {}) => {
        const params = new URLSearchParams({
          per_page: per_page.toString(),
          orderby: 'count',
          order: 'desc',
        });
        if (search) {
          params.append('search', search);
        }
        return `/tags?${params.toString()}`;
      },
      providesTags: ['Tag'],
    }),

    // Create tag
    createTag: builder.mutation<Tag, CreateTagData>({
      query: (data) => ({
        url: '/tags',
        method: 'POST',
        body: data,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      invalidatesTags: ['Tag'],
    }),

    // Upload media
    uploadMedia: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: '/media',
        method: 'POST',
        body: formData,
        // Don't set Content-Type header, let browser set it with boundary for FormData
      }),
      invalidatesTags: ['Media'],
    }),

    // Get media
    getMedia: builder.query<any[], { per_page?: number; media_type?: string }>({
      query: ({ per_page = 20, media_type } = {}) => {
        const params = new URLSearchParams({
          per_page: per_page.toString(),
        });
        if (media_type) {
          params.append('media_type', media_type);
        }
        return `/media?${params.toString()}`;
      },
      providesTags: ['Media'],
    }),
  }),
});

export const {
  useGetPostsQuery,
  useGetPostBySlugQuery,
  useGetPostQuery,
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useSearchPostsQuery,
  useGetFeaturedPostsQuery,
  useGetCommentsQuery,
  useCreateCommentMutation,
  useReplyToCommentMutation,
  useGetTagsQuery,
  useCreateTagMutation,
  useUploadMediaMutation,
  useGetMediaQuery,
} = blogApi;
