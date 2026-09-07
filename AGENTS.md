<!-- BEGIN:nextjs-agent-rules -->

## Framework version

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

## This repo is a starter template

**Rule:** This codebase is meant to be copied and reused as the starting point for new sites, not treated as a single one-off project. Everything below this section (page content structure, SEO, images) is the reusable convention layer — keep following it in every project spun up from this template. The list below is what's **client-specific** and must be swapped out per new project.

**Why:** So a new project can be bootstrapped by copying this repo and only touching the pieces that are actually client-specific, instead of re-deriving the conventions from scratch each time.

**How — per new project, replace/update:**

- `package.json` → `name`.
- `.env` (copied from `.env.example`) → `NEXT_PUBLIC_SITE_URL`, `GOOGLE_SITE_VERIFICATION[_2]`, `NEXT_PUBLIC_GA_MEASUREMENT_ID`, `CONTENT_BRAND_SLUG` for the new client.
- `src/app/layout.tsx` → the whole `metadata` object (`title`, `description`, `keywords`, `openGraph`, `siteName`) is hardcoded for the current client and must be rewritten; the RocketChat livechat snippet's `tenantid` and the Calendly integration are this client's accounts, not generic scaffolding — remove or replace them for a new client.
- `favicon.ico`, `favicon-16.png`, `favicon-32.png`, `apple-touch-icon.png` → brand-specific assets.
- `src/app/(pages)/about/`, `services/`, `services/web-design/`, `news/` → these are **reference examples only**, showing the co-location pattern (and, for `news/`, the dynamic `[slug]` detail-route pattern) in `## Page content structure` below. Delete or overwrite them with the new project's real pages; don't ship them as-is.
- `src/middleware.ts` → the `/blog` → external blog proxy is this project's specific integration, driven by `CONTENT_BRAND_SLUG`; remove it (and the matching `src/app/api/blog/topics/route.ts`) if the new project doesn't have an equivalent external content app.

**Exception:** Anything not listed here (routing conventions, the `content.json` co-location pattern, the SEO check script, image rules) is infrastructure, not client content — carry it forward unchanged into new projects.

## Page content structure

**Rule:** Each route under `src/app/(pages)/` co-locates its own `content.json` next to its `page.tsx`. There is no shared `_data` folder — content lives with the route it belongs to.

```
src/app/(pages)/
  about/
    page.tsx
    content.json          → /about
  services/
    page.tsx
    content.json          → /services
    web-design/
      page.tsx
      content.json        → /services/web-design
  news/
    page.tsx
    content.json          → /news (list of posts)
    [slug]/
      page.tsx            → /news/[slug], reads its post from ../content.json
```

**Why:** Deleting a page means deleting one folder — no cross-referencing a separate data directory to find (or forget) its content file. The URL structure and the file structure are the same tree.

**How:**

- `content.json` shape: `{ "title": string, "metaDescription": string, ...page-specific fields }`.
- `page.tsx` imports its sibling file directly and exports `metadata` from it — no runtime file scanning:

  ```tsx
  import type { Metadata } from "next";
  import content from "./content.json";

  export const metadata: Metadata = {
    title: content.title,
    description: content.metaDescription,
  };

  export default function Page() {
    return <main>{content.heading}</main>;
  }
  ```

- Dynamic detail routes (e.g. `news/[slug]/page.tsx`) don't get their own `content.json` — they import the parent's (`../content.json`), find their entry (e.g. by matching `slug`), and use `generateStaticParams`/`generateMetadata` to pre-render each entry and set its per-post `title`/`metaDescription`. See `news/` for the reference implementation.
- `src/app/sitemap.ts` walks the `(pages)` tree recursively to build the sitemap; it only includes folders with their own `content.json`, so dynamic sub-routes like `news/[slug]` are not auto-added — it does not need updating when you add a page, only when you change the tree-walking rules themselves or want dynamic routes included too.
- Route groups (folders in parens, e.g. `(pages)`) and private folders (prefixed `_`) don't contribute URL segments, matching normal Next.js routing conventions.

**Exception:** Routes with no folder under `src/app/(pages)/` (e.g. `/privacy`, `/terms`, or any unknown slug) aren't part of this tree and fall through to whatever catch-all/placeholder route the app defines elsewhere.

## App-level shared code: `constants` vs `components`

**Rule:** Shared non-route code lives outside `src/app/`, split by kind, not dumped into a single `_lib`:

- `src/constants/` — static, environment-derived values with no JSX (e.g. `site.ts` exporting `BASE_URL` from `NEXT_PUBLIC_SITE_URL` and `CONTENT_BRAND_SLUG` from `CONTENT_BRAND_SLUG`).
- `src/components/` — shared React components used across routes (e.g. `CalendlyButton.tsx`).

**Why:** A single catch-all `_lib` folder blurs "value someone imports" with "component someone renders." Splitting them keeps imports self-descriptive at the call site. Living outside `src/app/` (rather than in `src/app/_constants/`) keeps them out of the App Router's own tree entirely, since they aren't route-scoped.

**How:**

- Import both via the `@/*` path alias (mapped to `src/` in `tsconfig.json`), e.g. `import { BASE_URL } from "@/constants/site"` and `import { CalendlyButton } from "@/components/CalendlyButton"` — used this way in `layout.tsx`, `sitemap.ts`, `robots.ts`, `middleware.ts`, and `src/app/api/blog/topics/route.ts`.
- New shared constants go in `src/constants/`; new shared components go in `src/components/`.
- A component belongs in `src/components/` only if it's used by routes outside its own subtree (e.g. `CalendlyButton` appears in `layout.tsx` and multiple unrelated pages). A component used only by one route or its own children (e.g. a client-side filter used only by `news/page.tsx`, or a detail template shared by `services/`'s own sub-routes) is route-local: co-locate it in a `_components/` folder inside that route, e.g. `src/app/(pages)/news/_components/NewsTopicFilter.tsx` or `src/app/(pages)/services/_components/ServiceDetail.tsx`. The leading `_` makes it a Next.js private folder, so it never contributes a URL segment (see `## Page content structure`). If a route-local component later gets reused by a route outside its subtree, promote it to `src/components/` at that point — don't promote speculatively.

## SEO: metaDescription rules

**Rule:** Every `content.json` **must** have a non-empty, unique `metaDescription`, ~120–160 characters, specific to that page's actual content.

**Why:** It renders into `<meta name="description">`. Missing values hurt CTR; exact-match duplicates across pages get flagged by Google as duplicate content.

**How:**

- For "parent overview" vs "child service" pages that share a topic, write the child's description around its specific service — don't reuse or lightly edit the parent's.
- When cloning an existing route as a template for a new one, rewrite `title` and `metaDescription` in the new `content.json` — don't carry them over.
- Before committing, run `npm run check:content` — it scans `src/app/(pages)/**/content.json` for missing fields, duplicate `metaDescription`, and lengths outside the ~120–160 char guideline.

## Images

**Rule:** Always use `<Image>` from `next/image`. Never use plain `<img>` tags — the ESLint rule `@next/next/no-img-element` enforces this and the build will warn on violations.

**How — choosing the right variant:**

- **`fill` + positioned wrapper** — use when the image fills a container whose size is set by CSS (aspect ratio, fixed height, responsive). The wrapper must have `position: relative` (or absolute/fixed) and `overflow: hidden`.
  ```tsx
  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md">
    <Image src={src} alt={alt} fill className="object-cover" sizes="..." />
  </div>
  ```
- **Explicit `width` / `height`** — use for fixed-size images where dimensions are known (avatars, icons, logos with fixed height). CSS classes can still override the rendered size.
  ```tsx
  <Image
    src={src}
    alt={alt}
    width={64}
    height={64}
    className="rounded-full object-cover"
  />
  ```

**Always set `sizes`** when using `fill` or when the image width varies across breakpoints — it drives the srcset and prevents the browser downloading oversized images. Omit only for images that are always the same pixel width (e.g. a fixed 64×64 avatar).

**Use `priority`** (not `loading="eager"`) for images that are above the fold on initial load: page hero backgrounds, the first hero slider slide, and event banners. All other images get lazy loading by default.

**AVIF/WebP** are enabled in `next.config.ts` (`formats: ["image/avif", "image/webp"]`). Vercel's image optimization serves the best format automatically — no manual conversion needed.
