# Phase 1: Complete Project Audit & Refactor Strategy

## 1. Project Audit

### Framework
- **Next.js App Router** (Next.js v15/v16 beta based on `package.json`).
- Uses `app/` directory (App Router) with standard `page.tsx` and `layout.tsx`.

### Rendering Type
- **Mixed (Heavy Client-Side):** The main `app/page.tsx` is a Server Component, but the internal sections (like `HeroSection`) are explicitly marked as `"use client"`. This limits the benefits of Server Components and increases the client bundle size since all content is fetched and rendered client-side along with interactivity.

### Layout Structure
- **Simple & Flat:** A single `app/layout.tsx` manages the global font (`Inter`, `Playfair_Display`) and metadata. `app/page.tsx` manually stacks semantic components (`<HeroSection />`, `<AdvocacySection />`, etc.).

### Section Architecture
- **Component-based (Modular):** Content is split into logical `.tsx` files inside `components/` (e.g., `hero-section.tsx`, `gallery-section.tsx`). Radix UI primitives and custom `ui/` components are heavily utilized. 
- Custom wrapper for scroll animations (`AnimateOnScroll`) drives the interactivity.

### Styling System
- **Tailwind CSS + `cva` + `clsx` + `tailwind-merge`:** A high-quality utility-first approach. Radix UI primitives ensure accessibility.

### Image Handling Method
- **Hardcoded Static References:** Uses relative string paths (`/images/gallery-1.jpg`), likely utilizing standard `<img>` or unoptimized `next/image`. Currently not managed through a Media Library or external storage.

### Hardcoded Content
- **100% Hardcoded:** All text, arrays (`stats`, `galleryImages`), links, and configurations are baked directly into the `.tsx` files. This makes it impossible to update without code changes.

### Performance Bottlenecks
- **Excessive Client Components:** Sections like Hero are fully `"use client"` just for basic scroll animations.
- **Lack of CMS/Database:** Rebuilding the site for every text change.
- **Animation Strategy:** Custom `AnimateOnScroll` might cause scroll jank or hydration mismatches compared to a highly optimized `framer-motion` implementation.
- **Image Optimization:** Static asset arrays risk layout shifts and large payloads if unoptimized.

---

## 2. Refactor Strategy

To meet the requirements of a **fully database-driven, Vercel-optimized, accessible portfolio with a modular CMS and Supabase backend**, we will execute the following strategy:

### A. Database & Backend Integration (Supabase)
- **Implement Supabase SDK:** Connect to the `site_content`, `site_settings`, `media_library`, and `ai_instructions` tables.
- **Move to Server Components:** We will fetch the page content *entirely* server-side in `app/page.tsx` using `supabase.from('site_content').select()`.
- **JSON-Driven Sections:** We will convert each section (e.g., Hero, About) to accept `content` and `styles` as props instead of hardcoded strings.
- **Caching & On-Demand Revalidation (ISR):** Use Next.js caching (`generateStaticParams` or Next.js 15 `unstable_cache`) combined with a Vercel API Route (`/api/revalidate`) to update content near-instantly without full rebuilds.

### B. Scalable Content Architecture
- Create a **Section Renderer Component** that dynamically loads `HeroSection`, `GallerySection`, etc., based on the `section_key` returned from Supabase, respecting `order_index` and `is_visible`.

### C. Admin Dashboard & Authentication
- Build an **email/password auth system** using standard HTTP-only cookies (bypassing Supabase Auth as requested).
- Implement middleware (`middleware.ts`) to strictly protect `/admin/:path*`.
- Develop a modular dashboard mimicking **CMS capabilities** (WYSIWYG or JSON entry, image upload to Supabase Storage, and the Google Antigravity Engine UI).

### D. Practical Animations & Performance
- Add **Framer Motion**.
- **Isolate animations:** Keep content in Server Components, wrapping only interactive elements (like buttons or specific wrappers) with a small, lightweight `"use client"` Framer Motion wrapper (`<MotionDiv />`). This drastically reduces the client payload.

### E. Image Optimization
- Ensure all Supabase Storage URLs are loaded via Next.js `<Image>` components with optimized `sizes`, `loading="lazy"` for below-fold, and `priority` for the Hero section.

---
**Status:** Audit and Strategy documented. Ready to begin Phase 2 (Implementation).
