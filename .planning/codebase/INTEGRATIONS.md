# External Integrations

**Analysis Date:** 2026-05-17

## APIs & External Services

This is a static marketing landing page. It does **not** call any external API at runtime from the browser or server. All "integrations" are passive: outbound hyperlinks, image CDN whitelists, and build-time font fetches.

**Linked Product App (CTA target):**
- NutriApp Pro (clinical app) — `https://centro-metabolico-pro.vercel.app/login`
  - Type: outbound hyperlink (`<a target="_blank" rel="noopener noreferrer">`), not an API call
  - Referenced in 3 places:
    - `src/components/sections/site-header.tsx:42` — "Acceder a la app" button in the header
    - `src/components/sections/hero.tsx:51` — primary CTA inside the hero
    - `src/components/sections/final-cta.tsx:28` — final-section CTA
    - `src/components/sections/site-footer.tsx:35` — footer "Acceder a la app ↗" link
  - SDK/Client: none; plain anchor tag
  - Auth: none (the linked app handles its own login at the destination)

**Social / Brand Links:**
- Instagram — `https://instagram.com/centrometabolico` (`src/components/sections/site-footer.tsx:60`)
- Email — `mailto:contacto@centrometabolico.cl` (`src/components/sections/site-footer.tsx:51`)

## Data Storage

**Databases:**
- None. No database client, ORM, or connection string in the project.

**File Storage:**
- Local static assets under `public/` only (`file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg` — the default `create-next-app` placeholders).
- No object storage SDK (no S3, R2, Supabase Storage, UploadThing client, etc.) is imported anywhere in `src/`.

**Caching:**
- None at the application layer. Vercel's CDN edge cache applies to the static build output by default; no custom cache headers, no `revalidate`, no `unstable_cache` usage.

## Authentication & Identity

- None. The landing page has no auth surface, no session handling, no cookies set by application code, no auth provider SDK.
- CTAs delegate sign-in to the external product app at `centro-metabolico-pro.vercel.app/login`.

## Monitoring & Observability

**Error Tracking:**
- None. No Sentry, no Datadog, no LogRocket, no Vercel Analytics SDK imported.

**Logs:**
- Default Vercel platform logs only. No `console.log` instrumentation, no custom logger.

## CI/CD & Deployment

**Hosting:**
- Vercel
  - Project linked via `.vercel/project.json:1`:
    - `projectId`: `prj_pqYcwOsHNcyDupsJZ6hqXa3XrwYr`
    - `orgId`: `team_BZ1jdey1AB6zNL8A3sPJZYGc`
    - `projectName`: `nutriapp-landing`
  - Production URL: `https://nutriapp-landing.vercel.app`
  - Custom domain target (from `metadataBase` in `src/app/layout.tsx:22`): `https://nutriapp.centrometabolico.cl`
  - Config: `vercel.json` declares `framework: "nextjs"`, `buildCommand: "next build"`, `installCommand: "npm install"`

**Source Control:**
- GitHub repository `felipemunoz1983-alt/nutriapp-landing` (per task brief / user context). No GitHub Actions workflow file present in the repo (no `.github/` directory found).

**CI Pipeline:**
- None in-repo. CI/CD is handled by Vercel's Git integration (auto-deploy on push to the linked GitHub repo).

## Build-Time External Fetches

**Google Fonts (via `next/font/google`):**
- Imported in `src/app/layout.tsx:2`:
  - `Inter` — variable `--font-inter`, subset `latin`, `display: 'swap'` (lines 5-9)
  - `Archivo_Black` — variable `--font-display`, subset `latin`, weight `'400'`, `display: 'swap'` (lines 11-16)
- `next/font/google` fetches font files at build time, self-hosts them in the build output, and emits zero runtime requests to `fonts.googleapis.com` or `fonts.gstatic.com`. No `<link>` tags to Google's CDN.

## Runtime Image Sources (`next/image` remote patterns)

Declared in `next.config.ts:4-11`. These are the only remote hosts that `next/image` is allowed to optimize:

| Host | Purpose | In-use? |
|---|---|---|
| `images.unsplash.com` | Hero foreground + background photos | Yes — `src/components/sections/hero.tsx:8, 11` |
| `plus.unsplash.com` | Reserved for Unsplash+ photos | Whitelisted, no current usage in `src/` |
| `images.pexels.com` | Alternative stock photography | Whitelisted, no current usage in `src/` |
| `me7aitdbxq.ufs.sh` | UploadThing CDN subdomain | Whitelisted, no current usage in `src/` |

The hero image (`src/components/sections/hero.tsx:8`) loads `photo-1546069901-ba9599a7e63c` from Unsplash at 1280w, and the background (line 11) loads `photo-1490645935967-10de6ba17061` at 1920w. Both pass through Next.js image optimization (`next/image` is imported in `src/components/blocks/scroll-expansion-hero.tsx:11`).

## Webhooks & Callbacks

**Incoming:**
- None. No API routes, no `app/api/**` directory, no route handlers, no webhook endpoints.

**Outgoing:**
- None. No `fetch()` calls anywhere in `src/` (grep across the source tree returned zero matches for `fetch(`).

## Environment Configuration

**Required env vars:**
- None. Zero references to `process.env.*` in the application source (grep of `src/` returned no matches).

**Optional / build-time:**
- Vercel auto-injects standard `VERCEL_*` vars (`VERCEL_URL`, `VERCEL_ENV`, etc.) but none are read by application code.

**Secrets location:**
- Not applicable. No secrets are used by this project. No `.env*` file exists in the repo; `.env*` is git-ignored via `.gitignore:34`.

## SEO / Metadata

**Open Graph + canonical URL:**
- Configured in `src/app/layout.tsx:18-30`:
  - `metadataBase`: `https://nutriapp.centrometabolico.cl`
  - Locale: `es_CL`, page type: `website`
  - Title and description in Spanish (Chile market)
- No `sitemap.xml`, no `robots.txt`, no `app/sitemap.ts`, no `app/robots.ts`, no JSON-LD structured data in the source tree.

---

*Integration audit: 2026-05-17*
