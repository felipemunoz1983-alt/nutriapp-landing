# Coding Conventions

**Analysis Date:** 2026-05-17

## Naming Patterns

**Files:**
- All source filenames are **kebab-case** for both components and library code.
  - Sections: `src/components/sections/site-header.tsx`, `src/components/sections/site-footer.tsx`, `src/components/sections/feature-grid.tsx`, `src/components/sections/how-it-works.tsx`, `src/components/sections/final-cta.tsx`, `src/components/sections/social-proof.tsx`, `src/components/sections/differentiators.tsx`, `src/components/sections/hero.tsx`
  - Block primitive: `src/components/blocks/scroll-expansion-hero.tsx`
  - Library: `src/lib/utils.ts`
- App Router special files keep their Next.js conventional names: `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`.
- Each file declares exactly **one default-exported component** (or one named utility, in the case of `cn`).

**Components (exported identifiers):**
- **PascalCase** for components. The exported name matches the conceptual role of the section, not necessarily the filename.
  - `site-header.tsx` → `SiteHeader` (`src/components/sections/site-header.tsx:6`)
  - `feature-grid.tsx` → `FeatureGrid` (`src/components/sections/feature-grid.tsx:50`)
  - `how-it-works.tsx` → `HowItWorks` (`src/components/sections/how-it-works.tsx:24`)
  - `final-cta.tsx` → `FinalCTA` (`src/components/sections/final-cta.tsx:3`)
  - `social-proof.tsx` → `SocialProof` (`src/components/sections/social-proof.tsx:24`)
  - `differentiators.tsx` → `Differentiators` (`src/components/sections/differentiators.tsx:30`)
  - `hero.tsx` → `Hero` (`src/components/sections/hero.tsx:17`)
  - `scroll-expansion-hero.tsx` → `ScrollExpandMedia` (`src/components/blocks/scroll-expansion-hero.tsx:26`)
- Acronyms stay uppercase in exported names (`FinalCTA`, not `FinalCta`).

**Local constants:**
- Module-level data tables use **SCREAMING_SNAKE_CASE**: `FEATURES`, `STEPS`, `ROWS`, `TESTIMONIALS`, `HERO_MEDIA` (`src/components/sections/feature-grid.tsx:17`, `src/components/sections/how-it-works.tsx:3`, `src/components/sections/differentiators.tsx:3`, `src/components/sections/social-proof.tsx:3`, `src/components/sections/hero.tsx:6`).
- Local variables and React state are **camelCase** (`scrollProgress`, `mediaFullyExpanded`, `touchStartY`, `isMobileState` in `src/components/blocks/scroll-expansion-hero.tsx:37-41`).

**CSS variables:**
- Brand and surface tokens are **kebab-case with `--brand-*` / `--surface-*` namespaces** declared on `:root` in `src/app/globals.css:7-26`:
  - Brand palette: `--brand-cyan`, `--brand-cyan-dark`, `--brand-cyan-ink`, `--brand-mint`, `--brand-mint-dark`.
  - Surfaces: `--surface-0` (page bg), `--surface-1` (card), `--surface-2` (subtle tint), `--surface-ink` (primary text), `--surface-muted` (secondary text), `--surface-line` (hairline border).
  - Tailwind v4 mapping lives inside an `@theme inline` block (`src/app/globals.css:28-43`) exposing `--color-brand`, `--color-mint`, `--color-ink`, etc. and `--font-sans`.
- Font tokens come from `next/font/google` and are injected as CSS variables: `--font-inter` (body) and `--font-display` (Archivo Black) (`src/app/layout.tsx:5-16`).

**Section anchor IDs:**
- Section `id`s are **Spanish kebab-case** when localized, English single-word otherwise: `#features`, `#como-funciona`, `#diferencia`, `#testimonios`, `#cta`. These IDs are the cross-section navigation contract used by `SiteHeader`, `SiteFooter`, `Hero`, and `FinalCTA`.

## Code Style

**Language:**
- **TypeScript with `strict: true`** (`tsconfig.json:7`). `target: ES2017`, `module: esnext`, `moduleResolution: bundler`, `jsx: react-jsx`, `noEmit: true`, `isolatedModules: true`.
- React 19.2.4 / Next.js 16.2.6 — App Router only, no `pages/` directory.

**Module system:**
- **ESM everywhere.** Config files use `.mjs` (`eslint.config.mjs`, `postcss.config.mjs`) or `.ts` with `export default` (`next.config.ts`). No CommonJS.

**Quotes & syntax:**
- **Single quotes** in component code (`'use client'`, `'lucide-react'`, `'@/components/...'`).
- **Double quotes** in config and metadata strings (`tsconfig.json`, the `Metadata` object in `src/app/layout.tsx:18-30`).
- No semicolon-skipping — semicolons are used consistently.
- Trailing commas in multi-line object/array literals (visible in `FEATURES`, `ROWS`, `STEPS`).

**`'use client'` discipline:**
- Server Components by default. The `'use client'` directive appears **only on components that need browser APIs or interactivity**:
  - `src/components/blocks/scroll-expansion-hero.tsx:1` — uses `useEffect`, `useState`, `window`, `WheelEvent`, `TouchEvent`.
  - `src/components/sections/hero.tsx:1` — calls `window.scrollTo` on mount.
  - `src/components/sections/site-header.tsx:1` — uses `next/link` `Link` (kept client to match the rest of the header interaction surface).
- All other section components (`feature-grid`, `how-it-works`, `differentiators`, `social-proof`, `final-cta`, `site-footer`) are **server components** — no `'use client'`, no hooks. Keep new sections server-only unless they truly need interactivity.

**Linting:**
- Single config file: `eslint.config.mjs` (flat config) extending `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript` (`eslint.config.mjs:2-7`).
- Global ignores: `.next/**`, `out/**`, `build/**`, `next-env.d.ts` (`eslint.config.mjs:9-15`).
- No Prettier config is present — formatting is enforced solely through the Next ESLint presets plus editor defaults.

**Formatting:**
- 2-space indentation throughout. JSX attributes break onto new lines when more than two are present on a node.

## Import Organization

**Order observed in all section files:**
1. **React / Next.js built-ins** — `import { useEffect } from 'react'`, `import Link from 'next/link'`, `import Image from 'next/image'`, `import type { Metadata } from 'next'`, `import { Inter, Archivo_Black } from 'next/font/google'`.
2. **Third-party libraries** — `import { motion } from 'framer-motion'`, `import { clsx, type ClassValue } from 'clsx'`, `import { twMerge } from 'tailwind-merge'`.
3. **Icon imports** from `lucide-react` (named imports only — never a default import, never a wildcard). Group related icons in a single import statement:
   ```tsx
   import {
     Stethoscope,
     Dumbbell,
     LineChart,
     ShieldCheck,
     MessageCircleHeart,
     FileBarChart,
     type LucideIcon,
   } from 'lucide-react';
   ```
   (`src/components/sections/feature-grid.tsx:1-9`)
4. **Project-local imports** via the `@/*` alias (mapped to `./src/*` in `tsconfig.json:21-23`):
   - `import SiteHeader from '@/components/sections/site-header';` (`src/app/page.tsx:1`)
   - `import ScrollExpandMedia from '@/components/blocks/scroll-expansion-hero';` (`src/components/sections/hero.tsx:4`)
5. **CSS side-effect import** last when needed: `import './globals.css';` (`src/app/layout.tsx:3`).

**Path aliases:**
- Only one alias: `@/*` → `./src/*`. Always use it for cross-directory imports. Relative imports like `../components/...` are not used in this codebase.

## Styling

**Approach:**
- **Tailwind CSS v4 utility-first**, layered on top of CSS variables defined in `src/app/globals.css`. Tailwind v4 is wired through `@tailwindcss/postcss` (`postcss.config.mjs:3`) and a single `@import "tailwindcss";` at the top of `globals.css`.
- No `tailwind.config.{js,ts}` — design tokens live entirely in CSS via the `@theme inline` block (`src/app/globals.css:28-43`).

**Brand tokens override generic "UI/UX Pro Max" defaults — always reach for these first:**
- Primary brand color in code: `#1DAEEC` (`--brand-cyan`). Hover/active: `#039CE0` (`--brand-cyan-dark`). CTA accent: `#34D399` / `#059669` (`--brand-mint` / `--brand-mint-dark`).
- Body font: **Inter** via `next/font/google` (`src/app/layout.tsx:5-9`), exposed as `--font-inter` and used as `--font-sans` (`src/app/globals.css:42`).
- Display font: **Archivo Black** via `next/font/google` (`src/app/layout.tsx:11-16`), exposed as `--font-display` and consumed with `font-[family-name:var(--font-display)]` in the hero (`src/components/blocks/scroll-expansion-hero.tsx:352`).
- Never hard-code generic Tailwind palette colors (`bg-blue-500`, `text-slate-900`, etc.) for brand chrome. Use the bracket-syntax form referencing CSS vars: `bg-[var(--surface-1)]`, `text-[var(--surface-ink)]`, `border-[var(--surface-line)]`, `text-[var(--brand-cyan-dark)]`.
- For non-tokenized exceptions, use inline `style={{ background: 'var(--brand-cyan)' }}` — visible in `src/components/sections/site-header.tsx:17`, `src/components/sections/how-it-works.tsx:52-55`, `src/components/sections/final-cta.tsx:9-11`. This pattern is intentional when Tailwind's arbitrary-value escaping is awkward (gradients, multi-value backgrounds).

**Class composition:**
- Conditional class merging utility: `cn()` in `src/lib/utils.ts:4-6` — wraps `clsx` and `tailwind-merge`. Use it when composing className strings with conditionals; for flat static class strings, plain template literals are fine.

**Layout primitives:**
- Page width: `max-w-6xl mx-auto px-6` for full sections; `max-w-5xl` for `Differentiators`/`FinalCTA`; `max-w-3xl` for hero copy. Vertical rhythm: `py-24` on every section.
- Card surface pattern: `rounded-2xl border border-[var(--surface-line)] bg-white p-6 shadow-[0_1px_2px_rgba(11,42,58,0.04)] hover:shadow-[0_8px_24px_rgba(11,42,58,0.08)]` (`src/components/sections/feature-grid.tsx:72`).
- Pill / CTA shape: `rounded-full px-6 py-3` for primary buttons, `rounded-full px-4 py-2` for the header CTA.

## Accessibility

This project takes accessibility seriously — preserve the existing protections when modifying or adding components.

**Document language:**
- `<html lang="es-CL">` (`src/app/layout.tsx:38`) — Spanish from Chile. There is no i18n framework; all copy is written directly in Spanish.

**Skip link:**
- `<a href="#main" className="skip-link">Saltar al contenido</a>` in `src/app/layout.tsx:40-42`, paired with `<main id="main">` in `src/app/page.tsx:14`. Styled in `src/app/globals.css:76-89` (off-screen by default, focus-visible when tabbed).

**Focus ring:**
- Global `:focus-visible` override in `src/app/globals.css:58-62`: **3px solid `var(--brand-cyan)` outline with 2px offset and 6px border-radius**. Do not suppress this on interactive elements.

**Reduced motion:**
- `@media (prefers-reduced-motion: reduce)` block in `src/app/globals.css:65-73` clamps animation/transition durations to 0.01ms and disables smooth scroll. Framer Motion animations inherit this because they use CSS-level transitions. Do not introduce JS-driven animations that ignore this preference.

**Decorative icons:**
- Every Lucide icon used purely for visual decoration carries `aria-hidden="true"`. Examples:
  - `src/components/sections/site-header.tsx:19` — `<Activity ... aria-hidden="true" />`
  - `src/components/sections/feature-grid.tsx:80` — wrapper div with `aria-hidden="true"`
  - `src/components/sections/differentiators.tsx:56-71` — `X` and `Check` marks
  - `src/components/sections/final-cta.tsx:34,40` — `ArrowRight`, `ListChecks`
  - `src/components/sections/site-footer.tsx:13,54,63` — logo, Mail, Camera
- Functional icon-only links carry `aria-label`. The header logo wraps content in `aria-label="NutriApp Pro — inicio"` (`src/components/sections/site-header.tsx:13`).

**External links:**
- All `target="_blank"` links carry `rel="noopener noreferrer"` (`src/components/sections/site-header.tsx:42-44`, `src/components/sections/hero.tsx:51-53`, `src/components/sections/final-cta.tsx:29-30`, `src/components/sections/site-footer.tsx:36-37`).

**Heading hierarchy:**
- One `h1` is provided implicitly by the hero's display title; section headings use `h2` with `tracking-tight`; card titles use `h3`. The hero copy block uses `h2` (`src/components/sections/hero.tsx:38`) — note this and avoid duplicating `h1`s when adding sections.

## Component Patterns

**Section-as-function:**
- Every section is a single default-exported function component returning a `<section>` with an `id`, `py-24 px-6`, and a `max-w-* mx-auto` inner container. New sections should match this shape so they line up with header anchors.

**Data-driven rendering:**
- Lists of content live in a module-level `const` array with a typed shape, then `.map()` produces JSX. Example:
  ```tsx
  type Feature = { icon: LucideIcon; title: string; body: string };
  const FEATURES: Feature[] = [ ... ];
  // ...
  {FEATURES.map(({ icon: Icon, title, body }) => ( ... ))}
  ```
  (`src/components/sections/feature-grid.tsx:11-92`)
- The `icon` field stores the **component reference** (not a string), then is destructured-and-renamed to `Icon` at the call site so JSX can render `<Icon ... />`. Same pattern in `how-it-works.tsx:38`.

**Keys:**
- Use the most semantic stable field as the React key: `key={title}` in `FeatureGrid`, `key={num}` in `HowItWorks`, `key={t.name}` in `SocialProof`. Array indices are only used when there is no natural key (`key={i}` in `Differentiators` because `them`/`us` rows share no unique label).

**Props:**
- Section components are **prop-less** — all content is hard-coded in module constants. The only component accepting props is the reusable hero block:
  - `ScrollExpandMediaProps` interface (`src/components/blocks/scroll-expansion-hero.tsx:14-24`) — typed with `?` for every optional field, `ReactNode` for `children`.

## Error Handling

- No `try/catch`, `error.tsx`, or `loading.tsx` boundaries exist in this codebase yet. There are no async/data-fetching paths — all content is static, all images are unoptimized remote URLs whitelisted in `next.config.ts:5-10`. When introducing data fetching, add App Router `error.tsx` siblings rather than scattering try/catch.

## Logging

- No logging framework. There are no `console.log`/`console.error` calls in `src/`. Keep production code free of `console.*`.

## Comments

- Comments are reserved for **explaining non-obvious mechanics or design intent**, not for restating code.
  - `src/components/sections/hero.tsx:19` — `// Reset scroll on mount so the expansion starts from frame 0`.
  - `src/components/blocks/scroll-expansion-hero.tsx:163-166` — explains the anchor-link bypass for the scroll-lock.
  - `src/components/blocks/scroll-expansion-hero.tsx:178,184` — explains the two-rAF dance for state commit.
  - `src/app/globals.css:3-5,57,64,75` — section banners for token groups and a11y helpers.
- No JSDoc / TSDoc blocks in the codebase. Don't add them unless a component grows public surface area.

## Module Design

**Exports:**
- **One default export per component file.** Named exports only for utilities (`cn` in `src/lib/utils.ts`).
- Types used only inside one file stay file-local (`Feature` in `feature-grid.tsx:11-15`). Shared types would go in `src/lib/` (none exist yet).

**Barrel files:**
- None. Imports always point at the concrete file: `@/components/sections/site-header` rather than `@/components/sections`. Keep it that way — barrels would interfere with the server/client component boundary.

## Internationalization

- **No i18n framework.** All UI copy is Spanish (es-CL) hard-coded in JSX and module constants. The `<html>` element declares `lang="es-CL"` (`src/app/layout.tsx:38`) and OpenGraph declares `locale: "es_CL"` (`src/app/layout.tsx:28`). When adding copy, write it directly in Spanish; do not introduce a translation layer.

## Metadata & SEO

- Page metadata is centralized in `src/app/layout.tsx:18-30` via the App Router `Metadata` export — never via `<head>` tags.
- `metadataBase: new URL("https://nutriapp.centrometabolico.cl")` is the production origin.

---

*Convention analysis: 2026-05-17*
