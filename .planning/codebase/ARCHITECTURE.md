<!-- refreshed: 2026-05-17 -->
# Architecture

**Analysis Date:** 2026-05-17

## System Overview

```text
┌────────────────────────────────────────────────────────────────────────┐
│                  Next.js 16 App Router (single route)                  │
│                                                                        │
│  `src/app/layout.tsx`  (server component, RootLayout)                  │
│      └─ Loads next/font/google (Inter + Archivo_Black)                 │
│      └─ Imports globals.css (Tailwind v4 + brand tokens)               │
│      └─ Renders skip-link + {children}                                 │
│                                                                        │
│  `src/app/page.tsx`  (server component, Home, route "/")               │
│      └─ Composes one fixed-order page from 8 section components        │
└────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                         Section Composition                            │
│                                                                        │
│  <SiteHeader />          (client)  fixed nav, anchor links             │
│  <main id="main">                                                      │
│    <Hero />              (client)  scroll-locked expanding media       │
│      └─ <ScrollExpandMedia> (client, reusable block)                   │
│    <FeatureGrid />       (server) #features  — 6-card grid             │
│    <HowItWorks />        (server) #como-funciona — 3-step ol           │
│    <Differentiators />   (server) #diferencia  — them-vs-us rows       │
│    <SocialProof />       (server) #testimonios — 3 quotes              │
│    <FinalCTA />          (server) #cta         — gradient CTA card     │
│  </main>                                                               │
│  <SiteFooter />          (server) brand, nav, contact, fineprint       │
└────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                       Outbound integrations                            │
│   - login link → https://centro-metabolico-pro.vercel.app/login        │
│   - Unsplash images via next/image remotePatterns                      │
│   - mailto: + instagram.com links                                      │
└────────────────────────────────────────────────────────────────────────┘
```

## Component Responsibilities

| Component | Responsibility | File |
|-----------|----------------|------|
| `RootLayout` | HTML shell, font CSS variables, skip-link, body theming | `src/app/layout.tsx` |
| `Home` | Compose 8 sections in fixed order for route `/` | `src/app/page.tsx` |
| `SiteHeader` | Fixed top nav with brand mark, anchor links, login CTA | `src/components/sections/site-header.tsx` |
| `Hero` | Drives the scroll-locked expanding-media intro, login + anchor CTAs | `src/components/sections/hero.tsx` |
| `ScrollExpandMedia` | Reusable block that owns scroll-lock, wheel/touch handlers, anchor bypass, motion | `src/components/blocks/scroll-expansion-hero.tsx` |
| `FeatureGrid` | 6-card grid of clinical features under `#features` | `src/components/sections/feature-grid.tsx` |
| `HowItWorks` | 3-step `<ol>` (evaluation → plan → follow-up) under `#como-funciona` | `src/components/sections/how-it-works.tsx` |
| `Differentiators` | Side-by-side "otras apps vs NutriApp Pro" rows under `#diferencia` | `src/components/sections/differentiators.tsx` |
| `SocialProof` | 3 testimonial cards under `#testimonios` | `src/components/sections/social-proof.tsx` |
| `FinalCTA` | Gradient panel with login + features anchor under `#cta` | `src/components/sections/final-cta.tsx` |
| `SiteFooter` | Brand strip, product nav, contact, year + medical disclaimer | `src/components/sections/site-footer.tsx` |
| `cn` | Tailwind-class merge helper (clsx + tailwind-merge) | `src/lib/utils.ts` |

## Pattern Overview

**Overall:** Single-route App Router landing page with flat section composition.

**Key Characteristics:**
- One route (`/`) defined by `src/app/page.tsx:10` — there is no `[slug]`, no `not-found`, no nested routes.
- Server-component-first: only `Hero`, `ScrollExpandMedia`, and `SiteHeader` opt into client rendering with `'use client'`. All other sections are pure server components with static data arrays inlined at the top of the file.
- Data is co-located with the component that renders it (e.g. `FEATURES` in `src/components/sections/feature-grid.tsx:17`, `STEPS` in `src/components/sections/how-it-works.tsx:3`). No shared CMS, no `/data` directory, no fetching.
- Section components are self-contained: they own their `<section id="...">` anchor, their padding, their copy, and their data. `page.tsx` only orders them.
- Brand expressed exclusively through CSS custom properties in `src/app/globals.css:7-26` and `@theme inline` (lines 28-43). Components reference tokens via inline `style={{ background: 'var(--brand-cyan)' }}` or `text-[var(--surface-ink)]` arbitrary-value classes — there is no Tailwind config file.

## Layers

**Route layer (`src/app/`):**
- Purpose: Next.js App Router entry — `layout.tsx` is the HTML shell, `page.tsx` is the only route.
- Location: `src/app/`
- Contains: `layout.tsx`, `page.tsx`, `globals.css`.
- Depends on: section components, Tailwind v4, next/font/google.
- Used by: Next.js runtime.

**Sections layer (`src/components/sections/`):**
- Purpose: Page-section components — each renders one `<section>` of the landing page (or the header/footer chrome).
- Location: `src/components/sections/`
- Contains: 8 `.tsx` files, one per section, plus header and footer.
- Depends on: `lucide-react` icons, brand CSS tokens, the `ScrollExpandMedia` block.
- Used by: `src/app/page.tsx`.

**Blocks layer (`src/components/blocks/`):**
- Purpose: Reusable presentational primitives that are not tied to one section's copy. Currently holds the scroll-expansion hero behaviour decoupled from NutriApp's specific copy.
- Location: `src/components/blocks/`
- Contains: `scroll-expansion-hero.tsx`.
- Depends on: `framer-motion`, `next/image`.
- Used by: `src/components/sections/hero.tsx`.

**Lib layer (`src/lib/`):**
- Purpose: Framework-agnostic helpers.
- Location: `src/lib/`
- Contains: `utils.ts` — exports `cn()` for class merging.
- Depends on: `clsx`, `tailwind-merge`.
- Used by: (Currently not imported anywhere in `src/components/**` — present for future use.)

## Data Flow

### Primary Request Path (page load)

1. Request hits `/` → Next.js routes to `src/app/page.tsx:10`.
2. `RootLayout` (`src/app/layout.tsx:32`) renders the HTML shell with `lang="es-CL"`, font variables on `<html>`, and skip-link inside `<body>`.
3. `Home` returns the fragment `<SiteHeader/> <main> ...sections </main> <SiteFooter/>` (`src/app/page.tsx:11-27`). The 6 inner sections and the footer are server-rendered to HTML; their JSX is fully static (no `useState`, no `fetch`).
4. The browser hydrates the three `'use client'` islands: `SiteHeader` (`src/components/sections/site-header.tsx:1`), `Hero` (`src/components/sections/hero.tsx:1`), and `ScrollExpandMedia` (`src/components/blocks/scroll-expansion-hero.tsx:1`).
5. On mount, `Hero` calls `window.scrollTo(0,0)` and dispatches a `'resetSection'` event (`src/components/sections/hero.tsx:19-23`) so the expansion starts at frame 0 even after a refresh mid-page.
6. `ScrollExpandMedia` registers global `wheel`, `scroll`, `touchstart`, `touchmove`, `touchend`, `click`, and `resize` listeners (`src/components/blocks/scroll-expansion-hero.tsx:118-149`, `158-161`, `196-197`).

### Scroll-locked hero flow

1. Until `mediaFullyExpanded === true`, the `wheel` handler calls `e.preventDefault()` and converts `deltaY` into `scrollProgress` increments of `deltaY * 0.0009` (`src/components/blocks/scroll-expansion-hero.tsx:56-63`). A parallel `scroll` listener force-resets `window.scrollTo(0,0)` while the lock is active (lines 112-116) — the page literally cannot scroll past the hero.
2. As `scrollProgress` grows from 0 → 1, the inline media frame width grows from `300px` to `300 + (650 | 1250)px` and its height from `400px` to `400 + (200 | 400)px` depending on `isMobileState` (`src/components/blocks/scroll-expansion-hero.tsx:200-202`). Two title halves translate apart in opposite directions on the X axis using the same progress value.
3. When `scrollProgress >= 1` the lock releases: `setMediaFullyExpanded(true)` and `setShowContent(true)` (lines 65-67). The Framer-Motion `<motion.section>` that wraps `children` fades in from `opacity: 0` to `1` over 0.7s (lines 366-373) — that's where `Hero`'s headline, paragraph and CTAs (`src/components/sections/hero.tsx:34-65`) become visible.
4. Reverse path: if the user is already past the hero and scrolls up with `window.scrollY <= 5`, `mediaFullyExpanded` is set back to `false` and the lock re-engages (lines 53-55, 84-86).
5. Touch path mirrors the wheel path with `scrollFactor` 0.008 (downward swipe) or 0.005 (upward) and 20px reverse-deadzone (lines 74-106).

### Anchor-link bypass (added on top of the upstream block)

1. The header, footer, hero buttons and `FinalCTA` all use same-page anchors like `<a href="#como-funciona">`. Without intervention these would be swallowed by the scroll lock because the wheel handler keeps `scrollY` at 0.
2. A document-level click listener installed in `src/components/blocks/scroll-expansion-hero.tsx:166-198` intercepts every `click` whose target's `closest('a[href^="#"]')` is a real same-page anchor (not bare `#`), calls `e.preventDefault()`, then:
   - Sets `mediaFullyExpanded = true`, `showContent = true`, `scrollProgress = 1` so the wheel/scroll listeners stop forcing `scrollY = 0`.
   - Waits **two** `requestAnimationFrame` ticks (lines 185-193) so React commits the state and the scroll listener closes over the new value before `el.scrollIntoView({ behavior: 'smooth', block: 'start' })` runs.
   - Updates the URL fragment with `history.replaceState(null, '', hash)`.
3. This is what lets the "Ver cómo funciona" button in `src/components/sections/hero.tsx:59-64`, the nav links in `src/components/sections/site-header.tsx:27-38`, and the footer links in `src/components/sections/site-footer.tsx:29-32` actually scroll to their targets.

**State Management:**
- React `useState` inside `ScrollExpandMedia` only. No global store, no context providers, no URL state besides the anchor hash.

## Key Abstractions

**Section component:**
- Purpose: One vertical band of the landing page. Owns its anchor id, copy, data array, and styles.
- Examples: `src/components/sections/feature-grid.tsx`, `how-it-works.tsx`, `differentiators.tsx`, `social-proof.tsx`, `final-cta.tsx`.
- Pattern: Top-level constant data array → `default export function SectionName()` → returns `<section id="..." class="py-24 px-6 bg-...">` → `<div class="max-w-6xl mx-auto">` → eyebrow `<p>` + heading `<h2>` + body content.

**Reusable block:**
- Purpose: Behavior + presentation primitive divorced from any specific copy. Receives content via props/children.
- Examples: `src/components/blocks/scroll-expansion-hero.tsx`.
- Pattern: Client component, generic prop interface (`ScrollExpandMediaProps` at line 14), accepts `children` for the post-expansion content slot, no project-specific strings.

**Brand token via CSS variable:**
- Purpose: Single source of truth for colors. Declared on `:root` once, consumed by every component.
- Examples: `--brand-cyan`, `--brand-mint-dark`, `--surface-ink`, `--surface-muted` in `src/app/globals.css:7-26`.
- Pattern: Components reference via either inline `style={{ background: 'var(--brand-cyan)' }}` (used heavily — see `src/components/sections/site-header.tsx:17`, `final-cta.tsx:10-11`, etc.) or Tailwind arbitrary-value classes like `text-[var(--brand-cyan-dark)]` and `bg-[var(--surface-1)]`.

## Entry Points

**`/` (the only route):**
- Location: `src/app/page.tsx`
- Triggers: Any request to the site root.
- Responsibilities: Compose the 8 sections; no logic, no fetching.

**`RootLayout`:**
- Location: `src/app/layout.tsx`
- Triggers: Wraps every route (just `/` here).
- Responsibilities: Set `lang="es-CL"`, attach `--font-inter` and `--font-display` CSS variables to `<html>` (`layout.tsx:38`), render skip-link, render `{children}`.

## Architectural Constraints

- **Single-route only:** `src/app/` contains exactly `layout.tsx`, `page.tsx`, `globals.css`. Adding a second route means adding a directory under `src/app/`, but the scroll-lock in `ScrollExpandMedia` registers `window`-level wheel/scroll/touch listeners — if `<Hero>` mounts on another route, that route will also be scroll-locked. Either gate by route or restructure the block to use a scoped container.
- **Global scroll lock:** Listeners in `src/components/blocks/scroll-expansion-hero.tsx:118-149` are attached to `window`, not to the section element. Any other component on the page that uses `wheel` must coexist with the `passive: false` + `preventDefault()` behavior.
- **No Tailwind config file:** Tailwind v4 is configured entirely via `@import "tailwindcss"` and the `@theme inline` block in `src/app/globals.css:28-43`. There is no `tailwind.config.{js,ts}`. New tokens are added by extending the `@theme inline` block.
- **No middleware, no API routes:** Pure static landing page. There is no `src/app/api/`, no `middleware.ts`, no server actions, no `route.ts`.
- **Image domains hardcoded:** `next.config.ts:5-10` allow-lists `images.unsplash.com`, `plus.unsplash.com`, `images.pexels.com`, `me7aitdbxq.ufs.sh`. Any new remote image host needs to be added there.
- **Threading:** Single-threaded React + browser event loop. No worker threads, no streaming.
- **Global state:** None. No singletons, no module-level mutable state.
- **Circular imports:** None — the dependency graph is strictly `app → sections → blocks → lib`.

## Anti-Patterns

### Mixing the scroll-locked Hero with route-level scroll

**What happens:** Dropping `<Hero />` (or `<ScrollExpandMedia>`) anywhere other than the very top of a page leaves the global wheel listener fighting whatever the user is actually scrolling — the page jumps back to top because of the `if (!mediaFullyExpanded) window.scrollTo(0,0)` branch in `src/components/blocks/scroll-expansion-hero.tsx:112-116`.
**Why it's wrong:** The lock is `window`-scoped, not section-scoped. It assumes it owns the viewport.
**Do this instead:** Keep `<Hero/>` as the first child of `<main>` in `src/app/page.tsx:16` and don't mount it on routes where the user should arrive scrolled past zero.

### Adding hash links without going through the anchor-bypass handler

**What happens:** A new `<a href="#new-section">` will appear inert (page won't scroll) because the wheel listener forces `scrollY = 0` until `mediaFullyExpanded`.
**Why it's wrong:** Native anchor navigation is blocked by the scroll lock.
**Do this instead:** Use an `<a href="#hash">` exactly as is — the document-level handler at `src/components/blocks/scroll-expansion-hero.tsx:166-198` already intercepts any anchor click and unlocks the hero before scrolling. Do **not** call `scrollIntoView` manually before the unlock; the two-rAF wait is load-bearing.

### Hardcoding hex colors in components

**What happens:** Brand drift the next time the palette is refreshed.
**Why it's wrong:** Tokens in `src/app/globals.css:7-26` are the single source of truth.
**Do this instead:** Reference `var(--brand-cyan)`, `var(--surface-ink)`, etc., via either inline `style` or Tailwind arbitrary-value classes — every existing section does this (e.g. `src/components/sections/feature-grid.tsx:76-79`, `differentiators.tsx:70-74`).

### Adding a section with `'use client'` "just in case"

**What happens:** Bigger client bundle, slower hydration, and the component no longer benefits from RSC streaming.
**Why it's wrong:** Only 3 of 9 components on this page need to be client components. The rest render pure HTML from static arrays.
**Do this instead:** Default to server components (no directive). Only add `'use client'` when you genuinely need `useState`, `useEffect`, refs, or browser-only APIs — as in `src/components/sections/hero.tsx:1` (needs `useEffect` for scroll reset) and `src/components/sections/site-header.tsx:1` (currently uses `next/link` only; the directive is precautionary).

## Error Handling

**Strategy:** None at runtime — this is a static marketing page with no fetching, no forms, no user input, and no API calls. External login is delegated by linking out to `https://centro-metabolico-pro.vercel.app/login`.

**Patterns:**
- No `try/catch` in the codebase.
- No `error.tsx` or `not-found.tsx` routes (Next.js falls back to its defaults).
- `next/image` is given fixed `width`/`height` and a hardcoded `alt='Background'` / `alt={title || 'Media content'}` (`src/components/blocks/scroll-expansion-hero.tsx:222-231, 309-315`); failed image loads degrade silently to the browser's broken-image rendering.

## Cross-Cutting Concerns

**Logging:** None. No analytics, no console logs in source.

**Validation:** None. No forms, no inputs.

**Authentication:** None on this site. The login CTA links out to a separate Vercel deployment (`https://centro-metabolico-pro.vercel.app/login`).

**Accessibility:**
- Skip-link in `src/app/layout.tsx:40-42` styled by `.skip-link` in `globals.css:76-89`.
- `:focus-visible` ring at `globals.css:58-62`.
- `prefers-reduced-motion` honored at `globals.css:65-73` (kills all animations + smooth scroll).
- `aria-hidden="true"` on all decorative `lucide-react` icons (e.g. `feature-grid.tsx:80`, `final-cta.tsx:34`, `site-footer.tsx:13`).
- `<a href="https://..." target="_blank">` always paired with `rel="noopener noreferrer"` (e.g. `site-header.tsx:42-44`, `final-cta.tsx:29-30`).

**Typography:**
- Two Google Fonts via `next/font/google` (`src/app/layout.tsx:5-16`): `Inter` (variable: `--font-inter`, body) and `Archivo_Black` (variable: `--font-display`, used only by the hero title at `scroll-expansion-hero.tsx:352, 358`). Both `display: "swap"`.
- `--font-sans: var(--font-inter), system-ui, ...` is the fallback chain registered in `@theme inline` (`globals.css:42`).

---

*Architecture analysis: 2026-05-17*
