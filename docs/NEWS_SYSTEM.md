# News Management System Documentation

## Overview

The MyRehab Admin application now includes a complete news management system with both an admin dashboard for content management and public-facing pages for readers.

## Architecture

### Admin Dashboard (Authenticated)
- **Location**: `/dashboard/news`
- **Access**: Admin users only (requires authentication)
- **Features**:
  - Create, read, update, delete news articles
  - Rich text editor (Tiptap with shadcn/ui styling)
  - Filter by status, category
  - Pagination
  - Three status workflow: DRAFT, PUBLISHED, ARCHIVED

### Public Pages (SSG - No Auth Required)
- **News Listing**: `/news`
- **News Detail**: `/news/[slug]`
- **Access**: Public (no authentication required)
- **Features**:
  - Static Site Generation (SSG) for optimal performance
  - SEO-optimized with metadata
  - Slug-based URLs for better SEO
  - Only shows PUBLISHED articles
  - Pinned articles displayed prominently
  - Revalidates every hour (ISR)

## API Endpoints

### Admin Operations
- `GET /api/news` - List all news (paginated, with filters)
- `GET /api/news/:id` - Get news by ID
- `GET /api/news/slug/:slug` - Get news by slug
- `POST /api/news` - Create news (Admin only)
- `PUT /api/news/:id` - Update news (Admin only)
- `DELETE /api/news/:id` - Delete news (Admin only)

### Query Parameters for Listing
```typescript
{
  pageable: {
    page: number,
    size: number,
    sort: string[] // e.g., ['createdAt,desc']
  },
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED',
  category?: string
}
```

## News Categories

Fixed categories (not database-driven):
- `GENERAL` - General news and announcements
- `HEALTH_TIPS` - Health and wellness tips
- `REHABILITATION` - Rehabilitation-focused content
- `CLINIC_NEWS` - Clinic-specific news and updates
- `SUCCESS_STORIES` - Patient success stories

## Status Workflow

1. **DRAFT**: Work-in-progress, not visible to public
2. **PUBLISHED**: Live articles, visible on public pages
3. **ARCHIVED**: Hidden from public but preserved

## Public Page Features

### Static Generation
Both public pages use Next.js App Router with:
```typescript
export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour
```

### generateStaticParams
The detail page pre-generates all published news at build time:
```typescript
export async function generateStaticParams() {
  // Fetches all PUBLISHED news and generates static pages
}
```

### SEO Optimization
- Dynamic metadata generation
- Open Graph tags for social sharing
- Twitter Card support
- Proper title and description tags

### Performance
- Images optimized with Next.js Image component
- Static HTML generated at build time
- Incremental Static Regeneration (ISR) every hour
- Fast page loads, no authentication checks

## Rich Text Editor

Uses Quill v2.0.3 with comprehensive formatting options:
- Headers (H1-H6)
- Text formatting (bold, italic, underline, strike)
- Text and background colors
- Lists (ordered and bullet)
- Indentation control
- Text alignment
- Links, images, and videos (URL-based)
- Blockquotes and code blocks
- Clean formatting tool
- Undo/redo functionality

### Features
- **Client-side Only**: Uses SSR detection to prevent hydration issues
- **Keyboard Shortcuts**: Standard shortcuts for formatting (Ctrl+B, Ctrl+I, etc.)
- **Mobile Responsive**: Toolbar adapts to different screen sizes
- **Accessible**: Full keyboard navigation support

### Image Handling in Editor
**Current**: Images are inserted by URL only (user pastes external URL)

**For Upload Support**: You can extend the image handler in `components/quill-editor.tsx` to integrate with your backend upload API.

## Slug Generation

Admin create/edit pages include auto-slug generation:
- Converts title to URL-friendly format
- Removes Vietnamese diacritics
- Handles special characters
- Replaces spaces with hyphens
- Example: "Mẹo Sức Khỏe" → "meo-suc-khoe"

## Internationalization

Full Vietnamese and English support:
- Admin labels: `messages/vi.json` and `messages/en.json`
- Categories, statuses, form labels
- Error messages and notifications

## File Structure

```
app/
├── (admin)/dashboard/news/          # Admin dashboard
│   ├── page.tsx                     # News listing (authenticated)
│   ├── create/page.tsx              # Create news
│   ├── [id]/page.tsx                # View news detail
│   └── [id]/edit/page.tsx           # Edit news
├── (public)/news/                   # Public pages
│   ├── page.tsx                     # News listing (SSG)
│   └── [slug]/
│       ├── page.tsx                 # News detail (SSG)
│       └── not-found.tsx            # 404 page
components/
├── quill-editor.tsx                 # Quill v2.0.3 rich text editor
constants/
└── news.ts                          # Categories, statuses
messages/
├── vi.json                          # Vietnamese translations
└── en.json                          # English translations
```

## Usage Examples

### Admin: Create News Article
1. Navigate to `/dashboard/news`
2. Click "Tạo tin tức mới"
3. Fill in title, slug (or auto-generate), summary
4. Add thumbnail URL
5. Write content in Quill editor with rich formatting options
6. Select category and status
7. Click "Tạo mới"

### Public: View News
1. Visit `/news` to see all published articles
2. Click any article to view full content at `/news/[slug]`
3. SEO-friendly URLs, e.g., `/news/health-tips-for-recovery`

## Deployment Considerations

### Build Time
Static generation happens at build time:
```bash
npm run build
```

This generates static HTML for:
- `/news` (listing page)
- `/news/[slug]` (all published articles)

### Revalidation
Pages automatically revalidate every hour (3600 seconds).

To manually revalidate:
- Redeploy the application
- Use Next.js on-demand revalidation API (if needed)

### Environment
The public pages work with the same API proxy configuration:
- Browser requests go to Next.js server
- Next.js proxies to `localhost:8080`
- No CORS issues

## Future Enhancements

1. **Image Upload**: Integrate file upload with backend API
2. **Categories from DB**: Make categories dynamic instead of hardcoded
3. **Comments**: Add comment system for articles
4. **Related Articles**: Show related news on detail page
5. **Search**: Add full-text search functionality (backend support needed)
6. **RSS Feed**: Generate RSS/Atom feed for news
7. **Analytics**: Track article views and engagement
8. **Social Sharing**: Add share buttons for Facebook, Twitter, etc.

## Troubleshooting

### Public pages show empty
- Check that articles are set to `PUBLISHED` status
- Verify backend is running on `localhost:8080`
- Check browser console for API errors

### Images not loading
- Verify image URLs are accessible
- Check Next.js Image domains configuration
- Ensure images use HTTPS for production

### Static generation fails
- Check API is accessible during build
- Verify network connectivity
- Check build logs for specific errors
