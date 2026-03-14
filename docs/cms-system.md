# cms-system.md — CMS Architecture: Calvary Church of God

## Overview

The CMS is a built-in admin dashboard served at `/admin`. It is not a third-party headless CMS — it is purpose-built for this platform, living inside the same Next.js application. This means zero SaaS dependency, zero per-seat licensing, and a CMS that exactly matches the church's content model.

Access is protected by JWT authentication enforced at the middleware layer. The CMS is invisible to search engines (noindex, no public routes).

---

## Admin Panel Structure

```
/admin
├── /                         Dashboard overview
├── /sermons
│   ├── /                     Sermon list (paginated table)
│   ├── /new                  Create sermon
│   └── /[id]/edit            Edit sermon
├── /devotions
│   ├── /                     Devotions list
│   ├── /new                  Create devotion
│   └── /[id]/edit            Edit devotion
├── /events
│   ├── /                     Events list (upcoming + regular)
│   ├── /new                  Create event
│   └── /[id]/edit            Edit event
├── /blog
│   ├── /                     Blog posts list
│   ├── /new                  Create post
│   └── /[id]/edit            Edit post
├── /songs
│   ├── /                     Songs list
│   ├── /new                  Create song
│   └── /[id]/edit            Edit song
├── /downloads
│   ├── /                     Downloads list
│   ├── /new                  Upload download
│   └── /[id]/edit            Edit download
├── /media                    Media library (all uploaded files)
└── /settings
    ├── /site                 Church info, service times, pastor profile
    └── /account              Change password
```

---

## Roles and Permissions

### Role: `admin`
Full access to all CMS features including user management and site settings.

| Permission | Admin |
|-----------|-------|
| Create/edit/delete all content | ✅ |
| Publish / unpublish content | ✅ |
| Upload and delete media | ✅ |
| Edit site settings | ✅ |
| Manage user accounts | ✅ |
| Access account settings | ✅ |

### Role: `editor`
Can create and edit content, but cannot publish without admin review (configurable), cannot delete, cannot access settings.

| Permission | Editor |
|-----------|--------|
| Create content (draft) | ✅ |
| Edit existing content | ✅ |
| Publish / unpublish content | ❌ (admin only) |
| Upload media | ✅ |
| Delete media | ❌ |
| Edit site settings | ❌ |
| Manage users | ❌ |

> Note: In v1 with a small team, you may configure editors to publish directly. The role scaffold is in place to enforce separation if needed.

---

## Content Workflows

### Creating a Sermon

```
1. Admin navigates to /admin/sermons/new
2. Fills fields:
   - Title (required)
   - Series (optional, text or select from existing)
   - Preacher (required, default: pastor name from settings)
   - Scripture reference
   - Description (Rich Text Editor)
   - Video URL (YouTube embed or direct)
   - Upload thumbnail (→ Cloudinary via /api/v1/admin/media/upload)
   - Tags
3. Saves as "Draft" (default) or publishes immediately
4. On publish:
   a. Server Action validates schema
   b. Saves to MongoDB with status: "published", publishedAt: now
   c. Calls revalidatePath('/resources/sermons') → public page regenerates
   d. Calls revalidatePath('/') → home ISR cache invalidated (if featured)
5. Admin sees success toast, redirected to sermon list
```

### Publishing a Devotion

```
1. Create with a specific date (date picker)
2. Date determines when it appears as "today's devotion" on the public site
3. Pre-scheduling: create devotions in advance with future dates
4. Public site query: GET devotions where date = today AND status = "published"
5. Note: status must be "published" even for future-dated devotions —
   the public page filters by date, not status alone
```

### Managing Events

```
Regular events:
  - Static content: title, description, time, location
  - No start/end date — always visible in the regular events section
  - isRecurring: true, recurrencePattern: "Every Sunday"

Upcoming events:
  - isRecurring: false
  - startDate and endDate required
  - Public events page filters: status = "published" AND startDate >= today
  - Past events automatically disappear without manual deletion
  - Optional: admin can set endDate to control visibility window
```

---

## Rich Text Editor

**Library**: TipTap (headless, highly customisable)

**Enabled extensions:**
- Bold, Italic, Underline
- Headings (H2, H3 only — H1 is the page title)
- Bullet list, Ordered list
- Blockquote
- Horizontal rule
- Link (with target="_blank" support)
- Image (insert by URL from media library)
- Hard break

**Output format**: HTML string stored in MongoDB. Rendered on public site via `dangerouslySetInnerHTML` with DOMPurify sanitisation on read.

**Character counts** displayed live for fields with limits (excerpt: 200, meta description: 160).

---

## Media Library

All file uploads are routed through the server before going to Cloudinary — no direct browser-to-Cloudinary uploads. This ensures:
- Auth check before any upload
- File type validation server-side
- Size limit enforcement (images: 10MB, documents: 25MB, audio: 50MB)
- MongoDB media record created before returning URL

```typescript
// Upload flow:
// 1. Admin selects file in CMS
// 2. POST /api/v1/admin/media/upload (multipart/form-data)
// 3. Server: validate file type + size
// 4. Server: upload to Cloudinary via cloudinary.uploader.upload()
// 5. Server: save media record to MongoDB
// 6. Return { url, secureUrl, publicId, width, height } to client
// 7. CMS field auto-populated with the returned URL

// Allowed types:
images: ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
documents: ['application/pdf']
audio: ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg']
```

**Media library view** (`/admin/media`):
- Grid view with thumbnails
- Filter by type (image / audio / document)
- Search by filename
- Copy URL button
- Delete (admin only) — also deletes from Cloudinary

---

## Site Settings Editor

`/admin/settings/site` is a single-page form editing the `siteSettings` singleton document.

**Sections:**

1. **Church Info**
   - Church name, tagline, address, phone, email

2. **Service Times**
   - Dynamic list: add / remove / reorder service time rows
   - Each row: Label + Time string

3. **Social Links**
   - Facebook, YouTube, Instagram, WhatsApp (optional fields)

4. **Map**
   - Google Maps embed URL field

5. **Pastor Profile**
   - Pastor name, bio (rich text), photo upload

6. **Church History**
   - Full rich text content block

On save → Server Action → upsert `siteSettings` document → revalidate affected pages.

---

## Dashboard Overview (`/admin`)

Stats cards:
- Total sermons (published)
- Total events (upcoming)
- Total blog posts (published)
- Total media items

Recent activity:
- Last 5 content items created/updated (any type) with links to edit

Quick actions:
- "New Sermon", "New Devotion", "New Event", "New Post" buttons

---

## Authentication Implementation

```typescript
// lib/auth.ts

// Login
async function login(email: string, password: string) {
  const user = await User.findOne({ email })
  if (!user) throw new Error('Invalid credentials')
  const valid = await bcrypt.compare(password, user.passwordHash)
  if (!valid) throw new Error('Invalid credentials')
  
  const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: '7d' }
  )
  
  cookies().set('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7  // 7 days
  })
  
  return { success: true }
}

// Middleware check (edge)
const token = request.cookies.get('auth_token')?.value
const payload = jwt.verify(token, process.env.JWT_SECRET!)
// → invalid/expired: redirect to /admin/login
// → valid: set x-user-id, x-user-role headers for route handlers
```

---

## Error Handling in CMS

- **Validation errors**: Shown inline below the relevant field
- **Server errors**: Toast notification (top-right, 5s auto-dismiss)
- **Network errors**: Toast with "Try again" button
- **Unsaved changes**: Browser `beforeunload` warning if form is dirty
- **Optimistic updates**: List items update immediately, rolled back on error

---

## Folder Structure: CMS Components

```
src/
├── app/
│   └── admin/              # Route handlers (see structure above)
├── components/
│   ├── admin/
│   │   ├── AdminShell.tsx  # Sidebar + header layout
│   │   ├── ContentTable.tsx # Reusable paginated table
│   │   ├── ContentForm.tsx  # Reusable form wrapper
│   │   ├── RichTextEditor.tsx # TipTap wrapper
│   │   ├── MediaPicker.tsx  # Select from library or upload new
│   │   ├── ImageUploader.tsx # Drag-drop + preview
│   │   └── StatsCard.tsx    # Dashboard metric card
│   └── ui/                 # shadcn/ui components
├── lib/
│   ├── auth.ts             # JWT helpers
│   ├── mongodb.ts          # Connection singleton
│   ├── cloudinary.ts       # Upload helpers
│   └── validations/        # Zod schemas per content type
└── models/                 # Mongoose models (one per collection)
    ├── User.ts
    ├── Sermon.ts
    ├── Devotion.ts
    ├── Event.ts
    ├── Post.ts
    ├── Song.ts
    ├── Download.ts
    ├── Media.ts
    └── SiteSettings.ts
```
