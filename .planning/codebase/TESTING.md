# Testing Patterns

**Analysis Date:** 2026-05-17

## Honest Status

**This project has zero automated tests.** A full scan of `src/` for `*.test.*`, `*.spec.*`, `__tests__/`, Jest, Vitest, Playwright, Cypress, or any testing-library import returns no results. `package.json` declares no test runner in `dependencies` or `devDependencies`, and `npm run test` is not defined (`package.json:5-10`).

What this means in practice: **every regression is caught by build failures, lint failures, manual QA in the preview server, or by users after deploy.** That is acceptable for a static marketing landing of ~7 sections, but the hero scroll-lock interaction (see "Highest-Risk Areas" below) deserves a real test as soon as the page sees meaningful traffic.

## Test Framework

**Runner:** none configured.

**Assertion library:** none.

**Run commands available:** none for testing — only `dev`, `build`, `start`, `lint` (`package.json:5-10`).

## Verification Mechanisms That DO Exist

These are the gates currently protecting `main`. They are compile-time / lint-time / visual checks, not behavioral tests.

### 1. `npm run build` — compile + type-check gate

```bash
npm run build           # runs `next build`
```

Source: `package.json:7`.

Because `tsconfig.json` has `"strict": true` (`tsconfig.json:7`) and Next.js runs the TypeScript compiler over every server and client component, `next build` will fail on:
- type errors in any `*.ts` / `*.tsx`
- unresolved imports (including broken `@/*` alias paths)
- JSX prop type mismatches (e.g., passing the wrong type to `ScrollExpandMediaProps` in `src/components/blocks/scroll-expansion-hero.tsx:14-24`)
- duplicate route segments or invalid App Router file conventions
- Server/Client component boundary violations (e.g., a Server Component importing a hook from a `'use client'` file's runtime context)

**This is the strongest automated check in the project.** Run it before every commit.

### 2. `npm run lint` — ESLint gate

```bash
npm run lint            # runs `eslint`
```

Source: `package.json:9`. Config: `eslint.config.mjs`.

Extends `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript` (`eslint.config.mjs:2-7`). This catches:
- unused imports / variables
- React Hook rules-of-hooks violations
- `next/image`, `next/link`, `next/script` misuses (e.g., `<img>` instead of `<Image>`)
- a11y rules from `eslint-plugin-jsx-a11y` shipped via `core-web-vitals`
- Core Web Vitals red flags (e.g., synchronous scripts, missing `key` props on lists)

Ignores: `.next/**`, `out/**`, `build/**`, `next-env.d.ts` (`eslint.config.mjs:9-15`).

### 3. Manual visual QA via the dev server

```bash
npm run dev             # `next dev` on port 3000 (project convention: port 3002)
```

Per the user's project memory, **NutriApp Pro landing runs on port 3002** in this multi-project setup. Start with `next dev -p 3002` or set `PORT=3002` in the shell before `npm run dev`.

Manual checklist (the de facto regression suite) — walk through these before every deploy:

- **Hero scroll-lock unlock:** load `/`, scroll-wheel down — the framed image should expand smoothly without the page itself scrolling. Once expanded, continuing to scroll should release into normal page flow. Scrolling back up at the top should re-engage the lock. Implemented in `src/components/blocks/scroll-expansion-hero.tsx:51-150`.
- **Anchor-link bypass:** while the hero is still locked (frame not yet expanded), click any header anchor (`#features`, `#como-funciona`, `#diferencia`, `#testimonios`). The hero should jump-unlock and smooth-scroll to the target. Implemented in `src/components/blocks/scroll-expansion-hero.tsx:166-198`.
- **Reduced-motion:** in OS settings, enable "Reduce motion." Reload — animations and smooth scroll should be effectively instant. Enforced by `src/app/globals.css:65-73`.
- **Skip link:** press Tab on a fresh page load. The first focus stop should reveal "Saltar al contenido" near the top-left. Pressing Enter should jump to `#main`. Implemented in `src/app/layout.tsx:40-42` and `src/app/globals.css:76-89`.
- **Focus ring:** Tab through every link, nav item, and CTA. Each must show the 3px cyan outline from `src/app/globals.css:58-62`.
- **External CTAs:** the four "Acceder a la app" links (`src/components/sections/site-header.tsx:42-49`, `src/components/sections/hero.tsx:50-58`, `src/components/sections/final-cta.tsx:27-35`, `src/components/sections/site-footer.tsx:34-41`) must open `https://centro-metabolico-pro.vercel.app/login` in a new tab.
- **Mobile breakpoint:** resize to <768px. The header `<nav>` should collapse (it's `hidden md:flex`), the hero swipe should still drive the expansion (`isMobileState` branch in `src/components/blocks/scroll-expansion-hero.tsx:152-161`), and the feature grid should collapse to 1 column.
- **Typography:** Inter loads on body, Archivo Black on the hero display title (`src/app/layout.tsx:5-16`, `src/components/blocks/scroll-expansion-hero.tsx:352,358`).
- **Footer year:** `© {new Date().getFullYear()}` in `src/components/sections/site-footer.tsx:74` should reflect the current year.

### 4. Vercel production build — final gate

`vercel.json` (`vercel.json:1-7`) declares `framework: nextjs`, `buildCommand: next build`, `installCommand: npm install`. Vercel re-runs the same `next build` in CI on every push to the connected branch. A failed build blocks deploy. Use the **Vercel preview URL** as the canonical staging environment — there is no separate staging configured.

## Test File Organization

**Location:** none.

**Naming:** N/A.

**Structure:** N/A.

## Mocking, Fixtures, Coverage, Test Types

All N/A — no test infrastructure exists.

## Highest-Risk Areas (Where Tests Would Pay For Themselves)

In rough order of pain-on-regression:

### 1. Hero scroll-lock and anchor bypass (HIGH)

File: `src/components/blocks/scroll-expansion-hero.tsx`.

This component listens to `wheel`, `touchstart`, `touchmove`, `touchend`, `scroll`, `resize`, and `click` events on `window` / `document` (`src/components/blocks/scroll-expansion-hero.tsx:118-149,196`). It rebuilds those listeners on every change to `scrollProgress`, `mediaFullyExpanded`, or `touchStartY` (effect dep array at line 150). It also intercepts **every** in-page anchor click globally via a document-level listener (`src/components/blocks/scroll-expansion-hero.tsx:166-198`), preventing default and rewriting history.

The known fragile interactions:
- The anchor bypass uses a double-`requestAnimationFrame` to wait for React to commit state before scrolling (`src/components/blocks/scroll-expansion-hero.tsx:185-193`). A refactor that changes batching behavior (or introduces a Suspense boundary above this component) could break the bypass silently — the link will just not scroll.
- The `handleScroll` callback inside the effect always re-pins `window.scrollTo(0, 0)` while `mediaFullyExpanded` is false (`src/components/blocks/scroll-expansion-hero.tsx:112-116`). Any other component that calls `scrollIntoView` while the hero is still locked will be undone unless the anchor-bypass path ran first.
- On mount, `Hero` dispatches a custom `resetSection` event and forces `window.scrollTo(0, 0)` (`src/components/sections/hero.tsx:19-23`). Nothing currently listens for `resetSection`, so this is dead-but-harmless — flag it if a future refactor adds a listener.

### 2. External CTA targets (MEDIUM)

Four CTAs point at `https://centro-metabolico-pro.vercel.app/login`. If that URL ever changes (custom domain migration, new auth provider), all four call sites must update. Today this is enforced only by `grep` + memory.

### 3. Section anchor contract (MEDIUM)

Header and footer link to `#features`, `#como-funciona`, `#diferencia`, `#testimonios`, plus `#cta` referenced from `FinalCTA`. These IDs are set on the corresponding `<section>` elements in each section component. Renaming a section ID silently breaks the nav.

### 4. Image hostnames (LOW)

`next.config.ts:5-10` whitelists `images.unsplash.com`, `images.pexels.com`, `plus.unsplash.com`, `me7aitdbxq.ufs.sh`. Swapping a hero image to a new host will throw at runtime — caught quickly by manual QA but not by `next build` (build succeeds, runtime errors in the image loader).

## Recommended Additions

When this landing graduates beyond "marketing prototype," add **Playwright** as the first and possibly only test layer. The interactions worth covering are all integration-level (scroll, click, viewport), not unit-level — there is essentially no business logic to unit-test.

**Proposed `package.json` additions:**

```json
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui"
  },
  "devDependencies": {
    "@playwright/test": "^1.49.0"
  }
}
```

**Proposed test layout:**

```
tests/
  e2e/
    hero-scroll-lock.spec.ts      # wheel/touch expansion + scroll release
    anchor-bypass.spec.ts         # clicking #features while hero locked
    skip-link.spec.ts             # Tab → skip link visible → Enter → focus #main
    reduced-motion.spec.ts        # prefers-reduced-motion media emulation
    external-cta.spec.ts          # four CTAs all point at the expected URL
    section-anchors.spec.ts       # every header link resolves to a real section id
  playwright.config.ts            # baseURL: http://localhost:3002, webServer: npm run dev
```

**Highest-value first spec — `anchor-bypass.spec.ts`:**

```ts
import { test, expect } from '@playwright/test';

test('clicking a header anchor while hero is locked smooth-scrolls to the section', async ({ page }) => {
  await page.goto('/');
  // Hero starts locked: window.scrollY must stay at 0 even after a small wheel.
  await page.mouse.wheel(0, 50);
  expect(await page.evaluate(() => window.scrollY)).toBe(0);

  // Click the header "Funcionalidades" link — should bypass the lock.
  await page.getByRole('link', { name: 'Funcionalidades' }).click();

  // After the rAF dance and smooth scroll, #features should be in view.
  const featuresTop = await page.evaluate(
    () => document.getElementById('features')!.getBoundingClientRect().top
  );
  expect(Math.abs(featuresTop)).toBeLessThan(50);
  await expect(page).toHaveURL(/#features$/);
});
```

This single test would have caught the original scroll-lock-bypass bug that motivated the document-level click handler in `src/components/blocks/scroll-expansion-hero.tsx:166-198`.

**Suggested CI step (Vercel-friendly, optional):** add a GitHub Actions workflow that runs `npm ci && npx playwright install --with-deps && npm run build && npm run test:e2e` on every PR. Vercel itself does not run Playwright — it only runs `next build` — so a separate CI surface is needed if E2E is added.

## Coverage Requirements

None enforced. None expected — coverage is a meaningful metric only once unit tests exist, and Playwright integration tests are not the right target for line-coverage gates.

---

*Testing analysis: 2026-05-17*
