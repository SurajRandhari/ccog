# database-design.md — Calvary Church of God Platform

## Overview

The database is MongoDB Atlas. All collections are accessed via Mongoose ODM. Schema validation is enforced at both the Mongoose layer (application) and as MongoDB JSON Schema validators (database layer) for defence in depth.

---

## Collections

### 1. `users`
Admin and editor accounts. No public-facing user registration in v1.

```typescript
{
  _id: ObjectId,
  name: string,               // "Rev. Suresh Randhari"
  email: string,              // unique, lowercase
  passwordHash: string,       // bcrypt, never stored plain
  role: "admin" | "editor",   // admin: full access; editor: content only
  avatar: string | null,      // Cloudinary URL
  lastLoginAt: Date | null,
  createdAt: Date,
  updatedAt: Date
}

Indexes:
  { email: 1 } unique
```

---

### 2. `sermons`
Video sermons with series grouping.

```typescript
{
  _id: ObjectId,
  title: string,
  slug: string,               // URL-safe, unique: "grace-over-everything"
  series: string | null,      // "Book of John", "Easter 2024"
  preacher: string,           // "Rev. Suresh Randhari"
  description: string,        // rich text (HTML string from editor)
  scripture: string | null,   // "John 3:16-17"
  videoUrl: string,           // YouTube embed URL or direct video URL
  thumbnailUrl: string,       // Cloudinary URL
  duration: number | null,    // seconds
  publishedAt: Date,
  status: "draft" | "published",
  tags: string[],
  createdBy: ObjectId,        // ref: users
  createdAt: Date,
  updatedAt: Date
}

Indexes:
  { slug: 1 } unique
  { status: 1, publishedAt: -1 }
  { series: 1 }
  { tags: 1 }
```

---

### 3. `devotions`
Daily devotional content.

```typescript
{
  _id: ObjectId,
  title: string,
  slug: string,               // unique
  date: Date,                 // the devotion date (stored as midnight UTC)
  scripture: string,          // "Psalm 23:1-3"
  content: string,            // rich text HTML
  author: string,             // "Admin" or pastor name
  status: "draft" | "published",
  createdBy: ObjectId,        // ref: users
  createdAt: Date,
  updatedAt: Date
}

Indexes:
  { slug: 1 } unique
  { date: -1, status: 1 }     // for "today's devotion" query
```

---

### 4. `events`
Church events — both regular recurring and one-time upcoming events.

```typescript
{
  _id: ObjectId,
  title: string,
  slug: string,               // unique
  type: "regular" | "upcoming",
  description: string,        // rich text HTML
  startDate: Date,
  endDate: Date | null,
  time: string,               // "10:00 AM – 12:00 PM" (display string)
  location: string | null,    // "Main Sanctuary" or address
  imageUrl: string | null,    // Cloudinary URL
  isRecurring: boolean,
  recurrencePattern: string | null,  // "Every Sunday", "First Friday monthly"
  status: "draft" | "published",
  createdBy: ObjectId,        // ref: users
  createdAt: Date,
  updatedAt: Date
}

Indexes:
  { slug: 1 } unique
  { status: 1, startDate: 1 } // for upcoming events query
  { type: 1, status: 1 }
```

---

### 5. `posts` (Blog)
Church blog / articles.

```typescript
{
  _id: ObjectId,
  title: string,
  slug: string,               // unique
  excerpt: string,            // short summary (plain text, max 200 chars)
  content: string,            // rich text HTML
  coverImageUrl: string | null,
  author: string,
  authorImageUrl: string | null,
  tags: string[],
  status: "draft" | "published",
  publishedAt: Date | null,
  createdBy: ObjectId,        // ref: users
  createdAt: Date,
  updatedAt: Date
}

Indexes:
  { slug: 1 } unique
  { status: 1, publishedAt: -1 }
  { tags: 1 }
```

---

### 6. `songs`
Church song library.

```typescript
{
  _id: ObjectId,
  title: string,
  slug: string,               // unique
  artist: string | null,      // songwriter / original artist
  lyrics: string | null,      // plain text with line breaks
  audioUrl: string | null,    // Cloudinary audio or external URL
  chordsUrl: string | null,   // PDF Cloudinary URL
  language: string,           // "English", "Tamil", "Hindi"
  tags: string[],             // "worship", "hymn", "contemporary"
  status: "draft" | "published",
  createdBy: ObjectId,
  createdAt: Date,
  updatedAt: Date
}

Indexes:
  { slug: 1 } unique
  { status: 1, title: 1 }
  { language: 1 }
  { tags: 1 }
```

---

### 7. `downloads`
Downloadable resources (PDFs, study guides, etc.)

```typescript
{
  _id: ObjectId,
  title: string,
  description: string,        // plain text
  fileUrl: string,            // Cloudinary URL
  fileType: string,           // "PDF", "DOC", "ZIP"
  fileSizeBytes: number,
  thumbnailUrl: string | null,
  category: string,           // "Bible Study", "Prayer Guide", "Bulletin"
  downloadCount: number,      // incremented on each download request
  status: "draft" | "published",
  createdBy: ObjectId,
  createdAt: Date,
  updatedAt: Date
}

Indexes:
  { status: 1, category: 1 }
  { status: 1, createdAt: -1 }
```

---

### 8. `media`
Tracks all media uploaded through the CMS.

```typescript
{
  _id: ObjectId,
  filename: string,           // original filename
  cloudinaryPublicId: string, // for deletion/transformation
  url: string,                // full Cloudinary delivery URL
  secureUrl: string,          // https URL
  type: "image" | "video" | "audio" | "document",
  mimeType: string,
  sizeBytes: number,
  width: number | null,       // images/video
  height: number | null,
  duration: number | null,    // audio/video in seconds
  altText: string,            // accessibility
  uploadedBy: ObjectId,       // ref: users
  createdAt: Date
}

Indexes:
  { type: 1, createdAt: -1 }
  { cloudinaryPublicId: 1 } unique
  { uploadedBy: 1 }
```

---

### 9. `siteSettings`
Key-value store for CMS-editable site configuration. Single document, upserted.

```typescript
{
  _id: "site_settings",       // singleton document, fixed id
  churchName: string,
  tagline: string,
  address: string,
  phone: string,
  email: string,
  mapEmbedUrl: string,
  serviceTimes: [
    { label: string, time: string }
    // { label: "Sunday Worship", time: "10:00 AM" }
  ],
  socialLinks: {
    facebook: string | null,
    youtube: string | null,
    instagram: string | null,
    whatsapp: string | null
  },
  pastorName: string,
  pastorBio: string,          // rich text HTML
  pastorImageUrl: string | null,
  churchHistoryContent: string, // rich text HTML
  updatedAt: Date
}
```

---

## Collection Relationships

```
users (1) ──────────── creates ────────────► sermons (N)
users (1) ──────────── creates ────────────► devotions (N)
users (1) ──────────── creates ────────────► events (N)
users (1) ──────────── creates ────────────► posts (N)
users (1) ──────────── creates ────────────► songs (N)
users (1) ──────────── creates ────────────► downloads (N)
users (1) ──────────── uploads ────────────► media (N)

Note: MongoDB references (ObjectId) are used for createdBy.
Content documents do NOT embed user objects — join at query time.
```

---

## Indexing Strategy

**Compound indexes** are defined to support the exact query patterns the app uses:

| Collection | Query Pattern | Index |
|------------|--------------|-------|
| sermons | Published, sorted by date | `{ status: 1, publishedAt: -1 }` |
| sermons | By series | `{ series: 1, publishedAt: -1 }` |
| devotions | Today's devotion | `{ date: -1, status: 1 }` |
| events | Upcoming published | `{ status: 1, startDate: 1 }` |
| posts | Published feed | `{ status: 1, publishedAt: -1 }` |
| media | By type, recency | `{ type: 1, createdAt: -1 }` |

**Text indexes** for search (if needed):

```javascript
// sermons: full-text search on title + description
db.sermons.createIndex({ title: "text", description: "text" })

// posts: full-text search on title + content
db.posts.createIndex({ title: "text", content: "text" })
```

---

## Validation Rules

Mongoose schemas enforce:
- Required fields throw validation errors before DB write
- String length limits (title: max 200, excerpt: max 300)
- Enum values enforced on `status`, `role`, `type`
- URL format validation on `videoUrl`, `thumbnailUrl`
- Slug auto-generated from title via `slugify` library if not provided
- `updatedAt` auto-set via Mongoose `timestamps: true`

---

## Seed Data

A `scripts/seed.ts` script will populate:
- 1 admin user (from env vars)
- 3 sample sermons
- 7 sample devotions (one per day of the week)
- 4 sample upcoming events
- 2 sample blog posts
- Default `siteSettings` document

Run with: `npx tsx scripts/seed.ts`
