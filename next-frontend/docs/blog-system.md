# Blog System Documentation

## Overview

The Bema Hub blog system is a comprehensive content management solution built with Next.js and WordPress REST API integration. It provides a modern, aesthetic interface for creating, managing, and displaying blog content.

## Features

### ✨ Core Features
- **WordPress REST API Integration**: Full CRUD operations with WordPress backend
- **Rich Text Editor**: TipTap-based editor with image upload and formatting
- **Responsive Design**: Mobile-first design with shadcn/ui components
- **Real-time Search**: Search posts by title, content, and tags
- **Category Filtering**: Filter posts by WordPress categories
- **Image Management**: Drag-and-drop image upload with preview
- **SEO Optimized**: Proper meta tags and structured content

### 🎨 User Interface
- **Modern Design**: Clean, aesthetic interface matching Bema Hub branding
- **Dark Mode Support**: Automatic theme switching
- **Loading States**: Smooth loading indicators and skeleton screens
- **Toast Notifications**: User feedback for all actions
- **Responsive Layout**: Works perfectly on all device sizes

### 📝 Content Management
- **Create Posts**: Rich text editor with formatting options
- **Edit Posts**: Full editing capabilities with draft/publish states
- **Delete Posts**: Safe deletion with confirmation dialogs
- **Media Upload**: Image upload with automatic optimization
- **Category Management**: WordPress category integration
- **Tag System**: Flexible tagging system

## File Structure

```
app/
├── blog/
│   ├── page.tsx              # Blog listing page
│   ├── create/
│   │   └── page.tsx          # Create new post
│   ├── manage/
│   │   └── page.tsx          # Blog management dashboard
│   └── [slug]/
│       └── page.tsx          # Individual post view

components/
└── blog/
    └── RichTextEditor.tsx    # TipTap rich text editor

lib/
└── api/
    └── blogApi.ts            # WordPress REST API integration
```

## API Integration

### WordPress REST API Endpoints

The system integrates with the following WordPress REST API endpoints:

#### Posts
- `GET /wp-json/wp/v2/posts` - Get all posts
- `GET /wp-json/wp/v2/posts?slug={slug}` - Get post by slug
- `POST /wp-json/wp/v2/posts` - Create new post
- `POST /wp-json/wp/v2/posts/{id}` - Update post
- `DELETE /wp-json/wp/v2/posts/{id}` - Delete post

#### Categories
- `GET /wp-json/wp/v2/categories` - Get all categories

#### Tags
- `GET /wp-json/wp/v2/tags` - Get all tags

#### Media
- `POST /wp-json/wp/v2/media` - Upload media files

### Authentication

The system uses JWT tokens for WordPress authentication. Configure your WordPress site with:

1. Install JWT Authentication plugin
2. Add JWT secret to wp-config.php
3. Configure CORS headers
4. Set up user permissions

## Environment Variables

Add to your `.env.local`:

```env
NEXT_PUBLIC_WORDPRESS_API_URL=https://your-wordpress-site.com/wp-json/wp/v2
```

## Usage

### Creating a Blog Post

1. Navigate to `/blog/create`
2. Fill in the title and content using the rich text editor
3. Add categories and tags
4. Upload a featured image (optional)
5. Choose to save as draft or publish immediately

### Managing Posts

1. Navigate to `/blog/manage`
2. View all posts with search and filter options
3. Edit, delete, or change post status
4. Bulk operations for multiple posts

### Viewing Posts

1. Navigate to `/blog` for the main blog listing
2. Use search and category filters
3. Click on any post to view the full content
4. Share posts using the built-in share functionality

## Customization

### Styling

The blog system uses Tailwind CSS and shadcn/ui components. Customize the appearance by:

1. Modifying the color scheme in `tailwind.config.js`
2. Updating component styles in individual files
3. Adding custom CSS classes for specific elements

### Rich Text Editor

The TipTap editor can be extended with additional features:

```tsx
// Add new extensions to RichTextEditor.tsx
import Bold from '@tiptap/extension-bold'
import Italic from '@tiptap/extension-italic'
import YourCustomExtension from './your-extension'

const editor = useEditor({
  extensions: [
    StarterKit,
    YourCustomExtension,
    // ... other extensions
  ],
})
```

### API Customization

Extend the blog API by adding new endpoints to `blogApi.ts`:

```tsx
// Add new endpoint
getPostsByAuthor: builder.query<BlogPost[], number>({
  query: (authorId) => ({
    url: '/posts',
    params: { author: authorId, _embed: true },
  }),
  providesTags: ['Post'],
}),
```

## Performance Optimization

### Caching

The system implements several caching strategies:

1. **RTK Query Caching**: Automatic caching of API responses
2. **Image Optimization**: Next.js automatic image optimization
3. **Static Generation**: Pre-rendered pages where possible

### Loading States

All components include proper loading states:

- Skeleton screens for content loading
- Spinner indicators for actions
- Progressive loading for images

## Security

### Content Sanitization

- HTML content is sanitized before display
- User input is validated on both client and server
- XSS protection through proper escaping

### Authentication

- JWT token-based authentication
- Secure token storage
- Automatic token refresh

## Troubleshooting

### Common Issues

1. **WordPress API not accessible**
   - Check CORS configuration
   - Verify API URL in environment variables
   - Ensure WordPress REST API is enabled

2. **Image upload failing**
   - Check file size limits
   - Verify media upload permissions
   - Ensure proper MIME type configuration

3. **Posts not loading**
   - Check network connectivity
   - Verify API endpoint responses
   - Check browser console for errors

### Debug Mode

Enable debug mode by adding to your environment:

```env
NEXT_PUBLIC_DEBUG=true
```

This will show additional logging information in the browser console.

## Contributing

When contributing to the blog system:

1. Follow the existing code structure
2. Add proper TypeScript types
3. Include loading and error states
4. Write responsive CSS
5. Test on multiple devices
6. Update documentation

## Future Enhancements

Planned features for future releases:

- [ ] Comment system integration
- [ ] Social media sharing
- [ ] Email newsletter integration
- [ ] Advanced SEO features
- [ ] Multi-language support
- [ ] Analytics integration
- [ ] Automated content scheduling
- [ ] Advanced media gallery
- [ ] Custom post types
- [ ] User role management

## Support

For support with the blog system:

1. Check this documentation
2. Review the troubleshooting section
3. Check the GitHub issues
4. Contact the development team

---

*This documentation is maintained by the Bema Hub development team. Last updated: October 2025*
