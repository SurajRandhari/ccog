# system-architecture.md — Calvary Church of God Platform

## Architecture Overview

The platform is a full-stack Next.js application using the App Router, deployed on Vercel with a MongoDB Atlas database. It operates as a unified codebase serving three consumers: the public website, the CMS admin dashboard, and the REST API (for future mobile apps).

```
┌─────────────────────────────────────────────────────────────────┐
│                        VERCEL EDGE NETWORK                       │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                   NEXT.JS APPLICATION                     │   │
│  │                                                           │   │
│  │   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │   │
│  │   │  Public Site  │  │  CMS Admin   │  │   REST API   │  │   │
│  │   │  /app/(site)  │  │  /app/admin  │  │ /app/api/v1  │  │   │
│  │   └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  │   │
│  │          │                  │                  │           │   │
│  │   ┌──────┴──────────────────┴──────────────────┴───────┐  │   │
│  │   │              SERVER ACTIONS + API ROUTES            │  │   │
│  │   │          (Authentication Middleware Layer)          │  │   │
│  │   └────────────────────────┬────────────────────────────┘  │   │
│  │                            │                               │   │
│  │   ┌────────────────────────▼────────────────────────────┐  │   │
│  │   │              DATA ACCESS LAYER (Mongoose)            │  │   │
│  │   └────────────────────────┬────────────────────────────┘  │   │
│  └───────────────────────────┼───────────────────────────────┘   │
│                               │                                    │
└───────────────────────────────┼────────────────────────────────────┘
                                │
        ┌───────────────────────┼──────────────────┐
        │                       │                  │
        ▼                       ▼                  ▼
 ┌─────────────┐      ┌──────────────────┐  ┌───────────┐
 │ MongoDB     │      │  Cloudinary CDN  │  │  Resend   │
 │ Atlas       │      │  (Media Assets)  │  │  (Email)  │
 └─────────────┘      └──────────────────┘  └───────────┘
```

---

## Rendering Strategy

| Route Type | Strategy | Why |
|------------|----------|-----|
| Home page | ISR (60s revalidation) | Dynamic featured content, near-static |
| About pages | SSG | Rarely changes |
| Sermons, Blog, Devotions index | ISR (300s) | Updated periodically |
| Individual sermon/blog/devotion | ISR (on-demand) | Stable once published |
| Events listing | ISR (60s) | Changes regularly |
| Contact page | SSG | Static content + client-side form |
| CMS Admin | SSR (protected) | Always fresh, requires auth |
| API routes | SSR (server) | Dynamic, real-time |

**On-demand ISR**: When a CMS admin publishes/updates content, the platform calls `revalidateTag()` or `revalidatePath()` via a Server Action, instantly invalidating and regenerating affected static pages. This gives SSG performance with CMS-driven freshness.

---

## Backend Architecture

### Next.js App Router Structure

```
app/
├── (site)/               # Public website route group
│   ├── layout.tsx        # Site layout (nav, footer)
│   ├── page.tsx          # Home
│   ├── about/
│   ├── resources/
│   │   ├── sermons/
│   │   ├── devotions/
│   │   ├── songs/
│   │   ├── blog/
│   │   └── downloads/
│   ├── events/
│   └── contact/
│
├── admin/                # CMS Dashboard route group
│   ├── layout.tsx        # Admin shell layout
│   ├── page.tsx          # Dashboard overview
│   ├── sermons/
│   ├── devotions/
│   ├── events/
│   ├── blog/
│   ├── media/
│   └── settings/
│
└── api/
    ├── v1/               # Public REST API (mobile app compatibility)
    │   ├── sermons/
    │   ├── devotions/
    │   ├── events/
    │   ├── songs/
    │   └── blog/
    └── auth/             # Authentication endpoints
        ├── login/
        └── logout/
```

### Middleware

```typescript
// middleware.ts
// Runs on the Edge before request reaches any route handler
matcher: ['/admin/:path*', '/api/v1/:path*']

// Responsibilities:
// 1. Verify JWT / session cookie for /admin routes → redirect to /admin/login if invalid
// 2. Verify API key or Bearer token for /api/v1 routes (mobile clients)
// 3. Rate limiting on /api/v1 and /api/auth/login
// 4. CSRF protection check on mutating requests
```

### Authentication Flow

```
1. Admin visits /admin
2. Middleware checks session cookie → missing/invalid → redirect /admin/login
3. Login form → POST /api/auth/login (Server Action)
4. Server validates credentials (bcrypt compare) against Users collection
5. On success: create JWT, set httpOnly Secure SameSite=Strict cookie
6. Redirect to /admin dashboard
7. All subsequent /admin requests: middleware verifies JWT on edge

Mobile API:
1. Mobile app sends POST /api/v1/auth/login with credentials
2. Server validates → returns JWT in response body
3. Mobile stores JWT, sends as Authorization: Bearer <token> on subsequent requests
4. Middleware verifies on each /api/v1 request
```

---

## API Architecture

### Public REST Endpoints

All endpoints return JSON. Public content endpoints require no authentication.

```
GET  /api/v1/sermons              List sermons (paginated)
GET  /api/v1/sermons/:id          Single sermon with media URL
GET  /api/v1/sermons/series       All sermon series

GET  /api/v1/devotions            List devotions (paginated, sorted by date)
GET  /api/v1/devotions/today      Today's devotion

GET  /api/v1/events               Upcoming events list
GET  /api/v1/events/:id           Single event

GET  /api/v1/blog                 Blog posts list (paginated)
GET  /api/v1/blog/:slug           Single post by slug

GET  /api/v1/songs                Songs list
GET  /api/v1/downloads            Available downloads list

POST /api/v1/contact              Contact form submission (rate limited)
```

### CMS Endpoints (Admin, Auth Required)

```
# Sermons
POST   /api/v1/admin/sermons       Create sermon
PATCH  /api/v1/admin/sermons/:id   Update sermon
DELETE /api/v1/admin/sermons/:id   Delete sermon

# Same pattern for: devotions, events, blog, songs, downloads, media

# Media
POST   /api/v1/admin/media/upload  Upload file → Cloudinary → returns URL
DELETE /api/v1/admin/media/:id     Delete from Cloudinary + DB record
```

### Response Format (standardised)

```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "perPage": 12,
    "total": 87,
    "totalPages": 8
  }
}
```

Error format:
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Sermon not found"
  }
}
```

---

## Security Architecture

| Threat | Mitigation |
|--------|-----------|
| Unauthorised admin access | JWT + httpOnly cookie + middleware edge check |
| Brute force login | Rate limiting (5 attempts / 15 min per IP) via Upstash Redis |
| CSRF attacks | SameSite=Strict cookie + CSRF token on state-mutating forms |
| XSS | Next.js HTML escaping + Content Security Policy headers |
| SQL/NoSQL injection | Mongoose schema validation, never raw query interpolation |
| Sensitive data exposure | Environment variables only, no secrets in code |
| File upload abuse | Cloudinary server-side validation, file type allowlist, size limits |

---

## Deployment Architecture

```
Branch: main → Vercel production deployment (auto)
Branch: dev  → Vercel preview deployment (auto)

Environment Variables (Vercel Dashboard):
  MONGODB_URI                → MongoDB Atlas connection string
  JWT_SECRET                 → Strong random secret (256-bit)
  CLOUDINARY_CLOUD_NAME      → Media CDN
  CLOUDINARY_API_KEY
  CLOUDINARY_API_SECRET
  RESEND_API_KEY             → Email delivery
  UPSTASH_REDIS_REST_URL     → Rate limiting store
  UPSTASH_REDIS_REST_TOKEN
  NEXT_PUBLIC_SITE_URL       → https://calvary.church (canonical)

Infrastructure:
  - Vercel: Next.js hosting, Edge Functions, ISR cache
  - MongoDB Atlas (M10+): Primary database, auto-backups daily
  - Cloudinary (free tier → scale): Image/video CDN, transformations
  - Resend: Transactional email (contact form, admin notifications)
  - Upstash Redis: Rate limiting, session store option
```

---

## Data Flow: Publishing a Sermon

```
CMS Admin → Fills sermon form → Uploads thumbnail + video URL
         → Clicks "Publish"
         → Server Action: validateInput() → saveToMongoDB() → uploadMedia()
         → On success: revalidatePath('/resources/sermons')
         → ISR regenerates /resources/sermons and /resources/sermons/:id
         → Public website shows new sermon within seconds
         → /api/v1/sermons returns new sermon to mobile apps
```

---

## Performance Architecture

- **Image optimization**: `next/image` with Cloudinary as source — automatic WebP/AVIF conversion, responsive sizes
- **Font loading**: `next/font` with `display: swap` — no FOUT, fonts preloaded
- **Code splitting**: App Router automatic per-route splitting, `dynamic()` imports for heavy components
- **Bundle analysis**: `@next/bundle-analyzer` run in CI to catch regressions
- **Caching headers**: Vercel edge caches ISR pages; `Cache-Control: public, s-maxage=60, stale-while-revalidate=300`
- **Lazy loading**: All below-fold images, non-critical components deferred
- **Preloading**: Critical LCP image preloaded with `priority` prop on `next/image`
