# Codebase Concerns

**Analysis Date:** 2026-05-17

This is a fresh Next.js 16 landing for NutriApp Pro (Centro Metabólico). The codebase is small (one route, eight section components, one block) but it carries several specific debts and risks that are worth documenting before they bite a future contributor. Severity is rated relative to a public marketing site — anything that can break the hero on first paint is High because the hero is the entire above-the-fold experience.

---

## Tech Debt

### React 19 — state updates triggered from a render-bound `useEffect` closure

- **Severity:** Medium
- **Files:** `src/components/blocks/scroll-expansion-hero.tsx:51-150`
- **Issue:** The wheel/touch effect calls `setScrollProgress`, `setMediaFullyExpanded`, and `setShowContent` from inside event handlers whose closure captures `scrollProgress`, `mediaFullyExpanded`, and `touchStartY`. Because those three values are listed in the dependency array (line 150), every state update tears down and re-registers all five `window` listeners on every wheel tick. Under React 19's stricter rendering rules this surfaces in the dev console as "Cannot update a component while rendering a different component" / "state updates during render" warnings on rapid scroll.
- **Impact:** Console noise, listener churn (GC pressure), and a real risk that a wheel event arrives between unbind and rebind during fast scrolling — the user perceives a "stuck" frame.
- **Fix approach:** Move the mutable scroll state into a `useRef` and compute the next progress from `ref.current` inside the handler. Keep the `useEffect` dependency array empty so listeners register once. Use a `useState` only for values that need to trigger a re-render (e.g. `showContent`, `mediaFullyExpanded`). This is the standard pattern for scroll/gesture controllers and eliminates the warnings.

### Anchor-click handler uses a double-`requestAnimationFrame` timing hack

- **Severity:** Medium
- **Files:** `src/components/blocks/scroll-expansion-hero.tsx:166-198` (specifically lines 185-193)
- **Issue:** When an in-page anchor link (`href="#features"`, `#cta`, etc.) is clicked while the hero scroll-lock is still active, the handler sets three pieces of state and then waits **two** `requestAnimationFrame` ticks before calling `scrollIntoView`. The comment on lines 183-184 admits this: "Wait two rAFs so React commits the state and the scroll listener is re-registered with the new closure, then smooth-scroll." This is a workaround for the closure-staleness problem described in the previous concern — if React's batching, scheduling, or concurrent rendering behavior changes, one rAF may no longer be enough and the page will silently fail to navigate (the scroll handler at lines 112-116 will reset `window.scrollTo(0, 0)` mid-scroll).
- **Impact:** Fragile. Any future React minor upgrade, transition into `useTransition`/automatic batching changes, or even a slow first paint can break header navigation. There is no fallback or assertion that the target element was found beyond the truthy check on line 188.
- **Fix approach:** Fix the root cause (the ref-based state refactor above) and the double-rAF becomes unnecessary. As a tactical interim fix, gate the scroll listener (line 112-116) on a `ref.current` flag instead of the captured `mediaFullyExpanded` so the listener observes the unlock immediately on the same tick the click handler sets it.

### `lucide-react` no longer ships brand icons — `Camera` used as Instagram fallback

- **Severity:** Low (visual/UX), Medium (brand confusion)
- **Files:** `src/components/sections/site-footer.tsx:1` (import), `:63` (usage)
- **Issue:** Lucide removed brand icons (Instagram, Facebook, GitHub, etc.) for trademark reasons starting in their post-`0.300` releases. This project pins `lucide-react@^1.16.0`, which does not export `Instagram`. The footer's Instagram link (`https://instagram.com/centrometabolico`) currently renders a generic `Camera` icon instead. Users do not recognize this as an Instagram link.
- **Impact:** Social link discoverability drops. Brand inconsistency — the icon does not match the platform it links to.
- **Fix approach:** Three options, in order of preference: (1) inline an SVG of the Instagram glyph (Meta's brand guidelines permit this for linking purposes); (2) install `@icons-pack/react-simple-icons` which ships the brand glyphs under a CC0-equivalent license; (3) use a text-only link ("Instagram ↗") and drop the icon entirely. The `Camera` placeholder should not ship to production.

### `'use client'` boundary is implicit and easy to break

- **Severity:** Medium (regression risk)
- **Files:** Client components: `src/components/blocks/scroll-expansion-hero.tsx:1`, `src/components/sections/hero.tsx:1`, `src/components/sections/site-header.tsx:1`. All other sections (`feature-grid.tsx`, `how-it-works.tsx`, `differentiators.tsx`, `social-proof.tsx`, `final-cta.tsx`, `site-footer.tsx`) are server components.
- **Issue:** The page (`src/app/page.tsx`) is a server component that composes one server header... wait — `site-header.tsx` is **also** a client component because it ships `next/link` plus interactive anchors. The boundary is therefore: `page.tsx (server)` → `[SiteHeader (client), Hero (client) → ScrollExpandMedia (client), FeatureGrid (server), HowItWorks (server), Differentiators (server), SocialProof (server), FinalCTA (server), SiteFooter (server)]`. The boundary is correct today but undocumented. If a contributor adds a `useState` to (say) `FeatureGrid` without adding `'use client'`, the Next.js error message is cryptic and the build fails late. Conversely, if someone adds `'use client'` to a component that imports a large server-only dep, the bundle balloons silently.
- **Impact:** Confusion for new contributors. Risk of accidental client-bundle bloat or hard-to-diagnose hydration mismatches.
- **Fix approach:** Add an explicit comment block at the top of `src/app/page.tsx` listing which children are client vs server, and why. Cross-reference that list in `ARCHITECTURE.md`. Consider extracting any future stateful UI into clearly-named `*.client.tsx` files to make the boundary visible in the directory listing.

### Image strategy depends on third-party uptime with no fallback

- **Severity:** Medium (availability risk), High (if outage occurs during a marketing push)
- **Files:** `src/components/sections/hero.tsx:6-15` (URLs), `next.config.ts:4-11` (remote pattern allowlist)
- **Issue:** The hero pulls two large images directly from Unsplash (`images.unsplash.com`). Two more remote hosts (`images.pexels.com`, `plus.unsplash.com`, `me7aitdbxq.ufs.sh`) are whitelisted in `next.config.ts` but the only currently-used host is `images.unsplash.com`. There is no `onError` fallback, no locally-bundled poster, and the background image is loaded with `priority` (line 230 of `scroll-expansion-hero.tsx`) — so a 404 or DNS failure on Unsplash directly blanks the above-the-fold experience. Vercel's `next/image` optimization re-fetches from origin when the cache misses, so a sustained Unsplash outage means broken images for new visitors even after Vercel-side cache warmth elsewhere.
- **Impact:** The entire hero (the most expensive piece of design in the codebase) is bound to a free image CDN we do not control. If Unsplash removes the photo (which they do, on author request), the URL 404s permanently.
- **Fix approach:** Download both images, run them through `next/image`'s build-time optimizer by placing them under `public/hero/` and importing them statically. This also enables `placeholder="blur"` for a better first paint. Estimated effort: 30 minutes plus design sign-off that the chosen images are licensed (Unsplash License is permissive but attribution-recommended).

### Brand palette override is documented only in user memory, not in the repo

- **Severity:** Medium (contributor onboarding)
- **Files:** `src/app/globals.css:1-90` (the Centro Metabólico tokens), no in-repo design doc
- **Issue:** The UI/UX Pro Max skill that generated the initial component scaffolding recommends one palette; `src/app/globals.css` overrides it with the Centro Metabólico brand tokens (`--brand-cyan`, `--brand-mint`, etc., lines 7-26). The rationale for this override — that NutriApp Pro is a sub-brand of Centro Metabólico and must use the parent's identity — lives in `~/.claude/projects/.../memory/MEMORY.md` (`project_nutriapp_landing.md`), not in the codebase. A new contributor reading only the repo will not know why the design diverges from the skill's recommendations and may "fix" it back to the skill defaults.
- **Impact:** Real risk of brand regressions in future PRs. Wasted reviewer time explaining the same context repeatedly.
- **Fix approach:** Add a comment block at the top of `src/app/globals.css` (above line 3) stating "These tokens deliberately override the UI/UX Pro Max skill defaults to match Centro Metabólico's brand identity. Do not revert without consulting brand owner." Optionally add a `BRAND.md` in the repo root with the palette rationale and a link to the Centro Metabólico style guide.

---

## Known Bugs

### Console warnings on initial scroll

- **Symptoms:** "Cannot update a component while rendering a different component" warning logged in browser dev console on the first wheel/touch event after page load.
- **Files:** `src/components/blocks/scroll-expansion-hero.tsx:51-150`
- **Trigger:** Any scroll gesture while the hero is in its locked state.
- **Workaround:** None. Warning is dev-only — no production user impact beyond log noise.
- **Root cause:** See "React 19 — state updates triggered from a render-bound `useEffect` closure" above.

---

## Security Considerations

### External link `rel` attribute consistency

- **Severity:** Low
- **Files:** `src/components/sections/site-footer.tsx:60-65` (Instagram link)
- **Issue:** The Instagram link in the footer does not set `target="_blank"` or `rel="noopener noreferrer"`, unlike the other external links in the same component (the app login link at lines 35-39 does set them correctly). Clicking the Instagram link navigates the user away from the landing in the same tab — they leave the funnel.
- **Current mitigation:** None.
- **Recommendations:** Add `target="_blank" rel="noopener noreferrer"` to the Instagram anchor. Audit all external `<a>` tags for consistency.

---

## Fragile Areas

### `ScrollExpandMedia` global scroll lock

- **Files:** `src/components/blocks/scroll-expansion-hero.tsx:51-150`
- **Why fragile:** This component attaches global `wheel`, `scroll`, `touchstart`, `touchmove`, and `touchend` listeners directly on `window` and overrides default scroll behavior. Any other component (current or future) that also listens for these events will interact with it in non-obvious ways. The `handleScroll` listener at lines 112-116 actively forces `window.scrollTo(0, 0)` whenever `mediaFullyExpanded` is false — meaning programmatic scrolls from other components are silently undone.
- **Safe modification:** Do not add any other scroll-position manipulation while the hero is mounted on the page. If you must (e.g. for a "back to top" button), call it only after confirming `mediaFullyExpanded === true`. The anchor-click handler at lines 166-198 demonstrates the pattern.
- **Test coverage:** Zero. See "Test Coverage Gaps".

---

## Test Coverage Gaps

### No tests exist anywhere in the project

- **What's not tested:** Everything. There is no `__tests__`, no `*.test.ts(x)`, no `*.spec.ts(x)` outside `node_modules`. No Jest, Vitest, Playwright, or Cypress config.
- **Files:** Entire `src/` tree.
- **Risk:** High for the scroll-expansion hero specifically — its behavior is the single most complex piece of code in the repo and the easiest to silently break. Medium for the rest of the site (which is largely declarative JSX with brand tokens).
- **Priority:** Medium. A landing page does not need unit-test coverage for static markup, but a Playwright smoke test that loads `/`, scrolls past the hero, and verifies the second section renders would catch ~80% of regression risk for ~2 hours of setup work.
- **Cross-reference:** See `TESTING.md` for the broader testing posture analysis.

---

## Deployment & Infrastructure Risks

### Vercel Deployment Protection had to be disabled manually

- **Severity:** Low (one-time), Medium (if the project is ever re-imported)
- **Files:** No in-repo record (`vercel.json` only declares framework/build commands).
- **Issue:** Vercel enables Deployment Protection by default on new projects, which gates production URLs behind an SSO challenge. For a public marketing site this must be turned off. It was disabled manually in the Vercel dashboard at project setup, and that decision lives nowhere in version control. If the project is ever re-linked, re-imported, or restored from a backup, Deployment Protection will silently re-enable and the public URL will return a login page.
- **Recommendation:** Add a section to the repo's `README.md` (or a new `DEPLOYMENT.md`) documenting: (1) Deployment Protection must be off on the production environment; (2) the path to verify this in the Vercel dashboard (Project → Settings → Deployment Protection → "Standard Protection" must be "Disabled" or scoped to preview only); (3) why (public landing, no auth gate desired).

### Auto-redeploy on `git push` is NOT configured via GitHub-Vercel integration

- **Severity:** Medium (operational friction)
- **Files:** `.vercel/project.json` (CLI-linked, not git-integration-linked)
- **Issue:** The project was linked to Vercel via the Vercel CLI (`vercel link`), not via the GitHub → Vercel marketplace integration. As a consequence, pushing to the `main` branch on GitHub does NOT trigger a Vercel deploy automatically. Deploys today require running `vercel --prod` locally. This is fragile because: (a) it ties production releases to one developer's machine, (b) there is no PR preview deploy URL automatically, (c) it is non-obvious to a new contributor — they will push, see nothing change, and assume the deploy is just slow.
- **Recommendation:** Connect the GitHub repository to the Vercel project via the GitHub integration (Vercel dashboard → Project Settings → Git → Connect Git Repository). After connection, every push to `main` deploys to production and every PR gets an automatic preview URL. Once verified working, the CLI link can remain as a fallback. Document the switch in the repo's `README.md`.

---

## Dependencies at Risk

### `lucide-react` major version drift

- **Risk:** Project pins `lucide-react@^1.16.0`. Lucide is currently on a `0.x` release cadence (e.g. `0.460.0` at time of writing), so `^1.16.0` is almost certainly a fork/republish or a transcription error from a much newer pin. Verify what is actually installed (`npm ls lucide-react`) — if it's a non-canonical version, the package is at risk of being unpublished or diverging from upstream.
- **Impact:** Icon imports may break on a clean install.
- **Migration plan:** Pin to the official `lucide-react` from npm at the latest stable (currently `^0.460.0` or similar), update import paths if any have been renamed, and re-test all icon rendering. While doing this, resolve the `Camera`-as-Instagram concern simultaneously.

---

## Missing Critical Features

### No structured-data / SEO metadata beyond basics

- **Problem:** `src/app/layout.tsx:18-30` ships only Open Graph + a title and description. No JSON-LD `Organization` / `WebSite` / `Product` schema, no Twitter card explicit declaration, no canonical URL beyond `metadataBase`, no `robots` directives, no `sitemap.xml` / `robots.txt` route handlers.
- **Blocks:** Search-engine rich results, social link previews on Twitter/LinkedIn, indexing predictability.
- **Recommendation:** Add `app/sitemap.ts`, `app/robots.ts`, and a JSON-LD `<script>` for an `Organization` schema. Low effort, high SEO payoff for a marketing landing.

### No analytics or conversion tracking

- **Problem:** The "Acceder a la app" CTA appears in three places (`hero.tsx:50-58`, `site-header.tsx:41-49`, `site-footer.tsx:34-42`) but no click is tracked. There is no Vercel Analytics, no Plausible, no GA4, no event instrumentation of any kind.
- **Blocks:** Measuring landing-page effectiveness, A/B testing CTAs, attributing signups to channels.
- **Recommendation:** At minimum add `@vercel/analytics` for pageviews (zero-config, GDPR-friendly). For conversion measurement, add a lightweight event-tracking layer (Plausible custom events or PostHog) on the three CTA anchors.

---

*Concerns audit: 2026-05-17*
