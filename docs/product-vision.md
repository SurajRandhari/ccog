# product-vision.md — Calvary Church of God Digital Platform

## Executive Summary

Calvary Church of God's digital platform is a modern, high-performance church website built to serve the congregation online with the same spirit of clarity, peace, and purpose that defines the church itself. The platform launches as a web application but is architected from day one to support native mobile apps via shared API infrastructure.

---

## Design Philosophy

### Apple-Level Minimalism
Every design decision defers to clarity. The interface removes friction between the visitor and the content. No dark patterns, no aggressive calls-to-action, no visual noise. The design breathes.

**Core principles:**
- White-first surfaces with soft neutral accents
- Calm, readable typography — a clean serif/sans pairing with strong hierarchy
- Wide spacing and generous vertical rhythm
- Subtle micro-interactions (Framer Motion) — never distracting
- Accessibility-first: WCAG 2.1 AA minimum compliance
- Emotion through simplicity, not decoration

### Motion Philosophy
Motion is reserved for moments that matter:
- Page entry: staggered fade-in with slight vertical drift (200–400ms)
- Hover states: gentle opacity and scale transitions (150ms ease)
- Navigation transitions: smooth fade, no jarring cuts
- No looping animations, no parallax that fights readability
- All motion respects `prefers-reduced-motion`

---

## Product Goals

| Priority | Goal |
|----------|------|
| P0 | Provide digital home for Calvary Church of God with reliable, fast-loading content |
| P0 | Enable church staff to manage all content via CMS without developer involvement |
| P1 | Deliver sermons, devotions, and resources to the congregation digitally |
| P1 | Achieve Lighthouse score 95+ across all Core Web Vitals |
| P2 | Support future Flutter/React Native mobile apps via shared content API |
| P2 | Enable event discovery and community connection |

---

## Feature List

### Public Website

#### Home
- Hero section with church vision statement
- Featured sermon or devotion (dynamic from CMS)
- Upcoming events strip (ISR, auto-refreshes)
- Quick-links: "I'm New Here", "Watch Sermons", "Contact"
- Service times banner

#### About
- **Our Church** — Mission, vision, values, history
- **Our Pastor** — Rev. Suresh Randhari profile, photo, bio
- **Membership** — How to become a member, membership class info
- **Getting Connected** — First-time visitor guide with warm, clear copy

#### Resources
- **Daily Devotion** — Daily text devotionals, browseable archive
- **Video Sermons** — Sermon library, series grouping, embed or stream
- **Songs** — Song library (lyrics, audio, chords if applicable)
- **Blog** — Articles by church staff, searchable and tagged
- **Free Downloads** — PDFs, study guides, printable resources
- Events details page with calendar view

#### Events
- Regular recurring events (static CMS content)
- Upcoming events (dynamic CMS-managed listing)
- Event detail pages with date, time, location, description

#### Contact
- Church address with embedded Google Map
- Service timings display
- Contact form (name, email, message) with server-side handling and email delivery
- Phone number, social links

### CMS Admin Dashboard
- Secure role-based login (Admin, Editor roles)
- Dashboard overview with quick-edit shortcuts
- Content editors for all major content types
- Rich-text editing (TipTap or similar)
- Image upload and media library
- Event scheduling with start/end dates
- Preview before publish

### API Layer (for mobile apps)
- REST endpoints for all content types
- Authentication for mobile clients (JWT)
- Media served via CDN with stable URLs
- Versioned API structure (`/api/v1/...`)

---

## Non-Goals (v1)

- Live streaming integration (future phase)
- Online giving / donation processing (future phase)
- Member portal / login for congregation (future phase)
- Multi-language support (future phase)
- Push notifications (future mobile phase)
