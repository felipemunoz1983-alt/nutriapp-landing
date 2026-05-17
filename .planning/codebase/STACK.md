# Technology Stack

**Analysis Date:** 2026-05-17

## Languages

**Primary:**
- TypeScript ^5 (resolved 5.9.3 in `package-lock.json:5797-5800`) — all application source under `src/` (`.ts`, `.tsx`)
- TSX/JSX — React components, JSX transform configured via `tsconfig.json:14` (`"jsx": "react-jsx"`)

**Secondary:**
- CSS (Tailwind v4 syntax) — `src/app/globals.css` (uses `@import "tailwindcss"` and `@theme inline` directives)
- MJS — config files only (`postcss.config.mjs`, `eslint.config.mjs`)

## Runtime

**Environment:**
- Node.js — version not pinned in repo. No `.nvmrc`, no `engines` field in `package.json`. Effective floor is set transitively: Next.js 16.2.6 and ESLint 9 require Node 20+.
- Browser runtime: React 19.2.4 (`package-lock.json:5036-5042`)

**Package Manager:**
- npm — declared in `vercel.json:5` (`"installCommand": "npm install"`)
- Lockfile: `package-lock.json` present, `lockfileVersion: 3` (`package-lock.json:4`) — implies npm 7+
- No `yarn.lock` / `pnpm-lock.yaml` / `bun.lockb`

## Frameworks

**Core:**
- Next.js 16.2.6 (`package.json:16`, resolved `package-lock.json:4644`) — App Router architecture
  - Entry: `src/app/layout.tsx`, `src/app/page.tsx`
  - Uses `app/` directory convention (not `pages/`)
  - `metadata` export pattern for SEO (`src/app/layout.tsx:18-30`)
  - Server Components by default; client components marked with `'use client'` (e.g., `src/components/sections/hero.tsx:1`, `src/components/blocks/scroll-expansion-hero.tsx:1`)
- React 19.2.4 (`package.json:17`, resolved `package-lock.json:5037`)
- React DOM 19.2.4 (`package.json:18`, resolved `package-lock.json:5043-5050`)

**Testing:**
- Not detected. No test runner declared, no `*.test.*` / `*.spec.*` files, no `jest.config.*` / `vitest.config.*`.

**Build/Dev:**
- Next.js CLI (`package.json:5-9`):
  - `dev` → `next dev`
  - `build` → `next build`
  - `start` → `next start`
  - `lint` → `eslint`
- Turbopack: Next.js 16 ships Turbopack as the default bundler for `next dev` and `next build`. No `--turbopack` flag needed and none is set in `package.json`; Webpack is not configured in `next.config.ts`.
- PostCSS pipeline via `postcss.config.mjs:1-7` with the single plugin `@tailwindcss/postcss`
- ESLint 9 flat config (`eslint.config.mjs`) extending `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript`

## Key Dependencies

**Critical:**
- `next` 16.2.6 — framework runtime, image optimization (`next/image`), font loader (`next/font/google`), `next/link` (`package-lock.json:4643-4676`)
- `react` 19.2.4 / `react-dom` 19.2.4 — React 19 stable, used with `'use client'` directive pattern
- `framer-motion` ^12.38.0 (resolved 12.38.0, `package-lock.json:3389-3392`) — scroll-driven hero animations in `src/components/blocks/scroll-expansion-hero.tsx:12`
- `lucide-react` ^1.16.0 (resolved 1.16.0, `package-lock.json:4524-4530`) — icon set used across sections (e.g., `Activity` in `site-header.tsx:4`, `ArrowRight, ListChecks` in `final-cta.tsx:1`, `Mail, Camera` in `site-footer.tsx:1`)

**Infrastructure:**
- `tailwindcss` ^4 (resolved 4.3.0, `package-lock.json:5609-5613`) — utility CSS, Tailwind v4 engine
- `@tailwindcss/postcss` ^4 (resolved 4.3.0, `package-lock.json:1483-1492`) — PostCSS plugin for Tailwind v4
- `clsx` ^2.1.1 (resolved 2.1.1, `package-lock.json:2513-2521`) — conditional className helper
- `tailwind-merge` ^3.6.0 (resolved 3.6.0, `package-lock.json:5599-5608`) — used by `cn()` in `src/lib/utils.ts`
- `class-variance-authority` ^0.7.1 (resolved 0.7.1, `package-lock.json:2497-2508`) — declared but not currently imported anywhere under `src/` (peer of `clsx`)

**Type Definitions (devDependencies):**
- `@types/node` ^20 (`package.json:23`)
- `@types/react` ^19 (`package.json:24`)
- `@types/react-dom` ^19 (`package.json:25`)

**Linting (devDependencies):**
- `eslint` ^9 (resolved 9.39.4, `package-lock.json:2906-2909`)
- `eslint-config-next` 16.2.6 (`package.json:27`, resolved `package-lock.json:2964-2967`)

## Configuration

**Environment:**
- No `.env`, `.env.local`, `.env.production`, or any `.env*` file present in the project root (`Glob` of `.env*` returned no files).
- `.gitignore:33-34` ignores `.env*` by default — env files would not be committed if added.
- No `process.env.*` references anywhere under `src/` (grep across the source tree returned zero matches).
- No runtime configuration required; the site is fully static marketing content with hard-coded external URLs.

**Build:**
- `next.config.ts` — sole config concern is `images.remotePatterns` whitelist (see INTEGRATIONS.md)
- `tsconfig.json` — strict mode on (`"strict": true`, line 7), bundler resolution (`"moduleResolution": "bundler"`, line 11), path alias `@/*` → `./src/*` (lines 21-23), target ES2017, JSX `react-jsx`
- `postcss.config.mjs` — single plugin `@tailwindcss/postcss`
- `eslint.config.mjs` — flat config, ignores `.next/**`, `out/**`, `build/**`, `next-env.d.ts`
- `vercel.json` — `framework: "nextjs"`, `buildCommand: "next build"`, `installCommand: "npm install"`

## Platform Requirements

**Development:**
- Node.js 20+ (transitive floor from Next.js 16 and ESLint 9)
- npm (lockfile v3 implies npm 7 or later; current LTS recommended)
- Default Next.js dev port is 3000; per user memory the project runs on port 3002 in this workspace (no override visible in `package.json` scripts — likely passed via `next dev -p 3002` at invocation time)

**Production:**
- Deployment target: Vercel (see `vercel.json` and `.vercel/project.json:1` — projectId `prj_pqYcwOsHNcyDupsJZ6hqXa3XrwYr`, orgId `team_BZ1jdey1AB6zNL8A3sPJZYGc`, projectName `nutriapp-landing`)
- Live URL: `https://nutriapp-landing.vercel.app`
- Production canonical URL (declared in `metadataBase`): `https://nutriapp.centrometabolico.cl` (`src/app/layout.tsx:22`)
- Build command: `next build` (Turbopack production build in Next.js 16)

---

*Stack analysis: 2026-05-17*
