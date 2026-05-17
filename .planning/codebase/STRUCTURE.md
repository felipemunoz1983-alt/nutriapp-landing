# Codebase Structure

**Analysis Date:** 2026-05-17

## Directory Layout

```
nutriapp-landing/
├── public/                          # Static assets served verbatim at /
│   ├── file.svg                     # Default Next.js icon (unused, scaffold leftover)
│   ├── globe.svg                    # Default Next.js icon (unused, scaffold leftover)
│   ├── next.svg                     # Default Next.js logo (unused, scaffold leftover)
│   ├── vercel.svg                   # Default Vercel logo (unused, scaffold leftover)
│   └── window.svg                   # Default Next.js icon (unused, scaffold leftover)
│
├── src/
│   ├── app/                         # Next.js 16 App Router — exactly one route (/)
│   │   ├── globals.css              # Tailwind v4 entry + brand tokens + a11y rules
│   │   ├── layout.tsx               # RootLayout: HTML shell, fonts, skip-link
│   │   └── page.tsx                 # Home (route "/"): composes 8 sections
│   │
│   ├── components/
│   │   ├── blocks/                  # Reusable, copy-agnostic behavioral blocks
│   │   │   └── scroll-expansion-hero.tsx   # ScrollExpandMedia — scroll-lock + anchor bypass
│   │   │
│   │   └── sections/                # Page-section components (one per landing band)
│   │       ├── site-header.tsx      # SiteHeader   — fixed top nav, login CTA
│   │       ├── hero.tsx             # Hero         — drives ScrollExpandMedia
│   │       ├── feature-grid.tsx     # FeatureGrid  — #features (6 cards)
│   │       ├── how-it-works.tsx     # HowItWorks   — #como-funciona (3 steps)
│   │       ├── differentiators.tsx  # Differentiators — #diferencia (them-vs-us)
│   │       ├── social-proof.tsx     # SocialProof  — #testimonios (3 quotes)
│   │       ├── final-cta.tsx        # FinalCTA     — #cta (gradient panel)
│   │       └── site-footer.tsx      # SiteFooter   — brand, nav, contact
│   │
│   └── lib/
│       └── utils.ts                 # cn() — clsx + tailwind-merge helper
│
├── .planning/
│   └── codebase/                    # GSD codebase analysis docs (this file lives here)
│
├── eslint.config.mjs                # Flat config: next/core-web-vitals + next/typescript
├── next-env.d.ts                    # Next.js auto-generated TS ambient types
├── next.config.ts                   # Image remotePatterns allowlist
├── package.json                     # next 16.2.6, react 19.2.4, tailwindcss ^4
├── package-lock.json                # npm lockfile
├── postcss.config.mjs               # @tailwindcss/postcss plugin (Tailwind v4 entry)
├── tsconfig.json                    # paths: { "@/*": ["./src/*"] }, strict, ES2017
├── vercel.json                      # Vercel deploy hints (framework=nextjs)
└── README.md                        # Default create-next-app readme
```

## Directory Purposes

**`src/app/`:**
- Purpose: Next.js 16 App Router roots. The only route is `/`.
- Contains: `layout.tsx` (HTML shell, fonts), `page.tsx` (route handler for `/`), `globals.css` (Tailwind v4 + design tokens).
- Key files: `src/app/page.tsx` for ordering sections, `src/app/globals.css` for brand tokens.
- Constraint: There are no nested route directories — adding one creates a second URL.

**`src/components/sections/`:**
- Purpose: Page-section components specific to this landing page. Each file is one vertical band on `/` (or the chrome around it).
- Contains: 8 `.tsx` files. Each owns its `<section id="…">` anchor, copy strings, data array, and Tailwind classes.
- Key files: `hero.tsx` is the only section that needs `'use client'` for behavior; the others are server components.
- Convention: Filename = kebab-case noun describing the band. Default export name = PascalCase noun. The anchor `id` matches Spanish slugs (`como-funciona`, `diferencia`, `testimonios`).

**`src/components/blocks/`:**
- Purpose: Reusable presentational/behavioral primitives that are not pinned to one piece of copy. Today there is one — the scroll-locked expanding hero — but new shared primitives (e.g. a generic `<Disclosure>`, `<Marquee>`) would land here.
- Contains: `scroll-expansion-hero.tsx`.
- Key files: `scroll-expansion-hero.tsx` (382 lines, `'use client'`, owns wheel/touch/click listeners and Framer-Motion transitions).

**`src/lib/`:**
- Purpose: Framework-agnostic utilities.
- Contains: `utils.ts`.
- Key files: `src/lib/utils.ts:4` — `cn(...inputs)` for safely merging Tailwind classes (clsx + tailwind-merge). Currently unused by sections but kept for future component work.

**`public/`:**
- Purpose: Static files served as-is at the root URL.
- Contains: Only the five default `create-next-app` SVGs. None are referenced from `src/`.
- Note: The Open Graph image referenced by `metadataBase` in `src/app/layout.tsx:22` is not present — `metadataBase: new URL("https://nutriapp.centrometabolico.cl")` is set but no `og-image.png` or similar exists in `public/`.

**`.planning/codebase/`:**
- Purpose: GSD codebase analysis artifacts. This file and `ARCHITECTURE.md` live here.
- Generated: Yes, by the GSD `map-codebase` agent.
- Committed: Intended to be committed (the project is not a git repo per the environment header).

## Key File Locations

**Entry Points:**
- `src/app/layout.tsx`: HTML shell — sets `lang="es-CL"`, attaches font CSS variables, renders skip-link and `{children}`. Holds `metadata` and `openGraph` defaults.
- `src/app/page.tsx`: Route `/` — orders the 8 section components inside `<main id="main">`. Pure composition, no logic.

**Configuration:**
- `tsconfig.json`: Strict TS, `target: ES2017`, `jsx: react-jsx`, `moduleResolution: bundler`. Path alias `@/*` → `./src/*` (line 22).
- `next.config.ts`: Only configures `images.remotePatterns` for 4 hosts (Unsplash × 2, Pexels, `me7aitdbxq.ufs.sh`).
- `postcss.config.mjs`: Loads `@tailwindcss/postcss` — there is **no** `tailwind.config.{js,ts}`; theme lives in CSS.
- `eslint.config.mjs`: Flat config combining `eslint-config-next/core-web-vitals` + `eslint-config-next/typescript`, plus ignore globs.
- `vercel.json`: `framework: "nextjs"`, `buildCommand: "next build"`, `installCommand: "npm install"`.

**Core Logic:**
- `src/components/blocks/scroll-expansion-hero.tsx`: The only file in the codebase with non-trivial behavior. Scroll lock at lines 51-150, anchor bypass at lines 166-198, media sizing formula at lines 200-202.
- `src/app/globals.css`: Brand tokens (lines 7-26), Tailwind v4 `@theme inline` mapping (lines 28-43), accessibility rules (lines 58-89).

**Testing:**
- None. There is no `__tests__/`, no `*.test.tsx`, no `vitest.config.*`, no `jest.config.*`, and no test runner in `package.json` scripts.

## Section File Roles

**`src/components/sections/site-header.tsx`** (`'use client'`, 54 lines):
- Renders the fixed top header (`<header class="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-white/70">`, line 8).
- Brand mark (cyan square + Activity icon + "NutriApp Pro" wordmark) links to `/`.
- Hidden on `<md` (line 26 — desktop nav only); nav links go to `#features`, `#como-funciona`, `#diferencia`, `#testimonios`.
- Login CTA links to `https://centro-metabolico-pro.vercel.app/login` (line 42).
- Marked `'use client'` defensively (it doesn't actually use any client hooks today; only `next/link` and a `lucide-react` icon).

**`src/components/sections/hero.tsx`** (`'use client'`, 70 lines):
- Wraps `ScrollExpandMedia` with NutriApp-specific copy: Unsplash food photo (`mediaSrc`, line 8), greens/wellness background (line 10-11), title `"Nutrición Personalizada"`, date `"Centro Metabólico · Chile"`, hint `"Desliza para descubrir"`.
- `useEffect` on mount resets `window.scrollTo(0,0)` and dispatches a `'resetSection'` event (lines 19-23) so the expansion restarts from frame 0 after refresh.
- Children slot (lines 33-66): eyebrow pill ("App clínico-deportiva"), headline with the brand promise ("respeta tu digestión…"), supporting paragraph, two CTAs (login → external; `#como-funciona` → anchor bypass).
- This is the bridge between project-specific copy and the reusable block.

**`src/components/sections/feature-grid.tsx`** (server, 97 lines):
- Anchor `#features` (line 52).
- Eyebrow: "Construida con criterio clínico, no con métricas de engagement".
- 6 `FEATURES` items (lines 17-48), each `{ icon: LucideIcon, title, body }`. Icons: `Stethoscope`, `Dumbbell`, `LineChart`, `ShieldCheck`, `MessageCircleHeart`, `FileBarChart`.
- Renders a responsive grid `md:grid-cols-2 lg:grid-cols-3` of rounded cards with cyan-tinted icon badges (lines 68-92).
- Content positions clinical differentiators: SIBO/digestive intake, Mifflin-St Jeor vs Cunningham GET, weighted adherence, suplementation safety gates, communication tone, branded reports.

**`src/components/sections/how-it-works.tsx`** (server, 74 lines):
- Anchor `#como-funciona` (line 26).
- Eyebrow: "Cómo funciona".
- 3 `STEPS` (lines 3-22) numbered `01`/`02`/`03`, icons `ClipboardList`, `Cpu`, `Repeat`.
- Renders an `<ol class="grid gap-8 md:grid-cols-3 relative">` (line 37) — note semantic ordered list, not `<ul>`.
- Each step card: big cyan number + cyan-dark icon square + title + body. Maps the clinical flow: evaluation → plan calculation → follow-up.

**`src/components/sections/differentiators.tsx`** (server, 87 lines):
- Anchor `#diferencia` (line 32).
- Eyebrow: "App de calorías vs. herramienta clínica".
- 6 `ROWS` (lines 3-28), each `{ them, us }`. No icons inside data — uses `X` (red) for "Otras apps" column and `Check` (mint) for "NutriApp Pro" column (lines 55, 68).
- Renders a stack of `md:grid-cols-2` rows; the "them" column has `bg-[#FAFBFC]` (line 54 — the **only** hardcoded hex value in any section, brand drift risk).

**`src/components/sections/social-proof.tsx`** (server, 62 lines):
- Anchor `#testimonios` (line 26).
- Eyebrow: "Voces de quienes la usan".
- 3 `TESTIMONIALS` (lines 3-22): Camila R. (patient), Dra. Paulina M. (professional), Felipe O. (athlete) — covering the three audience segments NutriApp Pro targets.
- Each card: a `Quote` lucide icon, the quote, then name + role at the bottom (flex column + `flex-1` on the quote to push the footer down).

**`src/components/sections/final-cta.tsx`** (server, 54 lines):
- Anchor `#cta` (line 5).
- Single rounded card with a 135° gradient from `--brand-cyan-dark` to `--brand-cyan` (lines 7-12).
- White text on the gradient; primary CTA = login external link (lines 27-35) with `ArrowRight`; secondary CTA = `#features` anchor (lines 36-42) with `ListChecks`.
- Medical disclaimer fineprint at lines 45-48.

**`src/components/sections/site-footer.tsx`** (server, 84 lines):
- 4-column footer (`md:grid-cols-4`, line 6).
- Cols 1-2 (`md:col-span-2`): brand mark + tagline.
- Col 3 "Producto": anchors to all 4 in-page sections + external login.
- Col 4 "Contacto": `mailto:contacto@centrometabolico.cl` + `https://instagram.com/centrometabolico`.
- Bottom strip (lines 71-79): dynamic year via `new Date().getFullYear()` + medical disclaimer.

## Naming Conventions

**Files:**
- `kebab-case.tsx` for all components (e.g. `site-header.tsx`, `feature-grid.tsx`, `scroll-expansion-hero.tsx`).
- `camelCase.ts` for utility modules (`utils.ts`).
- `lowercase.css` for stylesheets (`globals.css`).
- Next.js conventional names left as-is: `layout.tsx`, `page.tsx`, `next.config.ts`, `next-env.d.ts`, `postcss.config.mjs`, `eslint.config.mjs`.

**Components:**
- `PascalCase` default exports matching the file's slug (e.g. `feature-grid.tsx` → `export default function FeatureGrid()`).
- Always default exports, never named exports for components.

**Anchors / `id`s:**
- Spanish slugs in kebab-case: `#features` (kept English), `#como-funciona`, `#diferencia`, `#testimonios`, `#cta`, `#main`.
- The page is in Spanish (`lang="es-CL"`, `src/app/layout.tsx:38`) so user-facing slugs are Spanish; `features` and `cta` are the two exceptions.

**Data constants inside components:**
- `SCREAMING_SNAKE_CASE` at module top level: `FEATURES`, `STEPS`, `ROWS`, `TESTIMONIALS`, `HERO_MEDIA`.

**Types:**
- `PascalCase` for type aliases (`Feature` in `feature-grid.tsx:11`, `ScrollExpandMediaProps` in `scroll-expansion-hero.tsx:14`).

**CSS custom properties:**
- `--kebab-case` grouped by category: `--brand-*`, `--surface-*` (`src/app/globals.css:7-26`).
- Tailwind v4 theme mappings in `@theme inline` use `--color-*` prefix to be picked up as `bg-brand`, `text-ink`, etc. (`globals.css:28-40`).

## Path Aliases

Defined in `tsconfig.json:21-23`:

```jsonc
"paths": {
  "@/*": ["./src/*"]
}
```

Usage across the codebase:
- `@/components/sections/site-header` (and the other 7 sections) — imported from `src/app/page.tsx:1-8`.
- `@/components/blocks/scroll-expansion-hero` — imported from `src/components/sections/hero.tsx:4`.
- `@/lib/utils` — declared but currently unused.

There is exactly one alias; do not introduce `@components`, `@lib`, etc. Prefer `@/components/...` to keep consistency with existing imports.

## Where to Add New Code

**New page section (e.g. an FAQ band):**
- Primary code: `src/components/sections/faq.tsx` — default-export PascalCase function, server component unless it needs interactivity.
- Anchor: pick a Spanish slug (e.g. `id="preguntas"`), then add the matching nav link in `src/components/sections/site-header.tsx:26-39` and `src/components/sections/site-footer.tsx:28-43`.
- Mount: import in `src/app/page.tsx` and place inside `<main>` in the desired vertical order.
- Anchor links to it from elsewhere will automatically pass through the scroll-lock bypass in `src/components/blocks/scroll-expansion-hero.tsx:166-198` — no extra wiring needed.

**New reusable presentational block (not section-specific):**
- Location: `src/components/blocks/<kebab-name>.tsx`.
- Default export, generic props interface, accept `children` where it makes sense.

**New utility function:**
- Add to `src/lib/utils.ts` (or `src/lib/<kebab-name>.ts` if it's a meaningful new concern).
- Import via `@/lib/...`.

**New brand color or surface:**
- Add the variable to `:root` in `src/app/globals.css:7-26`.
- If you want a Tailwind utility for it (e.g. `bg-brand-warm`), also add `--color-brand-warm: var(--brand-warm)` to the `@theme inline` block at `globals.css:28-43`.
- Components can then use either `style={{ color: 'var(--brand-warm)' }}` or `class="text-brand-warm"`.

**New remote image host:**
- Add an object `{ protocol: "https", hostname: "..." }` to `next.config.ts:5-10`.

**New external CTA destination:**
- Use the pattern from `final-cta.tsx:27-35` or `site-header.tsx:41-49`: `target="_blank" rel="noopener noreferrer"` on every external link.

**New static asset:**
- Drop into `public/`. Reference as `/file.png` from JSX, **not** via import. Open Graph image is a glaring gap — adding `public/og-image.png` then wiring it into `layout.tsx` `metadata.openGraph.images` is a likely future task.

**A second route:**
- Create `src/app/<route>/page.tsx`. Reuse `SiteHeader` and `SiteFooter` from `src/components/sections/`. Do **not** mount `<Hero/>` on the new route unless you want the scroll-lock active there too (see ARCHITECTURE.md constraint).

## Special Directories

**`public/`:**
- Purpose: Static files served from `/`. Currently contains five `create-next-app` scaffold SVGs that are not referenced anywhere in `src/`.
- Generated: No.
- Committed: Yes.

**`.planning/`:**
- Purpose: GSD planning artifacts. `.planning/codebase/` holds this STRUCTURE.md and ARCHITECTURE.md, written by the codebase mapper.
- Generated: Yes (by `/gsd:map-codebase`).
- Committed: Intended.

**`node_modules/`:**
- Purpose: npm dependencies.
- Generated: Yes (`npm install`).
- Committed: No (standard `.gitignore` rule, though this project does not show as a git repo in the working environment).

**`.next/`:**
- Not present until first build/dev run. `tsconfig.json:29-30` includes `.next/types/**/*.ts` and `.next/dev/types/**/*.ts` for Next.js generated types.

---

*Structure analysis: 2026-05-17*
