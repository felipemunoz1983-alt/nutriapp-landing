# NutriApp Pro — Landing

Marketing site for **NutriApp Pro**, the clinical-sports nutrition SaaS of **Centro Metabólico**.

🌐 Production: <https://nutriapp-landing.vercel.app>
🔗 App linked from every CTA: <https://centro-metabolico-pro.vercel.app/login>

---

## Stack

- **Next.js 16** (App Router, Turbopack, React 19)
- **TypeScript** strict
- **Tailwind CSS v4** (CSS-first `@theme inline` configuration in `globals.css`)
- **framer-motion** for the scroll-expansion hero
- **lucide-react** for icons (Instagram is inline SVG — Lucide dropped brand icons)
- **next/font** loads **Inter** (UI) and **Archivo Black** (display)

---

## Local development

```bash
npm install
npm run dev
```

Open <http://localhost:3000>. The dev server hot-reloads on save.

Build verification:
```bash
npm run build   # production build + TS check
npm run lint    # eslint
```

---

## Deployment

The project is linked to the Vercel project **`sdeportiva/nutriapp-landing`**.

### Manual deploy (current default)

```bash
npx vercel --prod --yes
```

The CLI is authenticated against `felipemunoz1983-alt`. First deploy takes ~30 s.

### ⚠️ Vercel Deployment Protection — must stay DISABLED

Vercel enables **Deployment Protection** by default on new projects, which gates every production URL behind an SSO login. For a public marketing site this is incorrect.

**If the project is ever re-imported, restored, or re-linked, verify this setting:**

1. Open <https://vercel.com/sdeportiva/nutriapp-landing/settings/deployment-protection>
2. Under **Vercel Authentication**, the production environment must be set to **Disabled**
3. Preview deployments can stay protected if desired

If a production URL ever returns a 401 or a login page, this is the first thing to check.

### GitHub auto-redeploy ✓

The project is connected to the GitHub repo `felipemunoz1983-alt/nutriapp-landing` via the **Vercel ↔ GitHub integration** (Settings → Git → "Connected Git Repository").

Every push to `main` triggers an automatic production deploy. Every pull request gets an automatic preview URL. No `vercel --prod` needed for normal workflow.

The CLI link remains in `.vercel/` as a fallback for emergency manual deploys.

---

## Structure

```
src/
├─ app/
│  ├─ layout.tsx          # Root: html lang=es-CL, font variables, skip-link
│  ├─ page.tsx            # Composes 8 sections
│  └─ globals.css         # Brand tokens + Tailwind v4 theme
├─ components/
│  ├─ blocks/
│  │  └─ scroll-expansion-hero.tsx   # Reusable scroll-locked hero block
│  └─ sections/           # 8 page sections (header, hero, features, etc.)
└─ lib/
   └─ utils.ts            # cn() helper
```

The page renders top-to-bottom: SiteHeader → Hero → FeatureGrid → HowItWorks → Differentiators → SocialProof → FinalCTA → SiteFooter.

---

## Brand notes

The visual identity is **Centro Metabólico** (cyan `#1DAEEC`, Inter + Archivo Black). Tokens live in `src/app/globals.css` and are commented as overrides of the generic scaffold defaults. Do not revert without consulting brand ownership.

The clinical copy follows non-negotiable rules from the `nutriapp-pro` skill: no diagnosing, no exact-result promises, no shaming tone, no suplement suggestions without the four mandatory clinical questions.

---

## Codebase map

A full audit of stack, architecture, conventions, testing posture, and known concerns lives in [`.planning/codebase/`](.planning/codebase/) (7 documents, ~1300 lines). Read `CONCERNS.md` before touching the scroll-expansion hero.
