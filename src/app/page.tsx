// CLIENT / SERVER BOUNDARY MAP
// ────────────────────────────
// This page is a server component. It composes the following children:
//
//   SiteHeader      — client ('use client'): owns the "Acceder a la app"
//                     TrackedAppLink which calls @vercel/analytics on click.
//   Hero            — client: wraps ScrollExpandMedia, which manages global
//                     wheel/touch/scroll listeners and React state.
//   FeatureGrid     — server: pure JSX, lucide icons.
//   HowItWorks      — server: pure JSX, lucide icons.
//   Differentiators — server: pure JSX, lucide icons.
//   SocialProof     — server: pure JSX, lucide icons.
//   FinalCTA        — server: pure JSX. Imports the TrackedAppLink client
//                     component, which crosses the boundary automatically.
//   SiteFooter      — server: pure JSX. Same TrackedAppLink crossing.
//
// When adding a new section, default to a server component. Only add the
// 'use client' directive if the component itself needs state, effects, or
// event handlers — children that need them can be extracted into a small
// client component imported from a server parent (see TrackedAppLink).
import SiteHeader from '@/components/sections/site-header';
import Hero from '@/components/sections/hero';
import FeatureGrid from '@/components/sections/feature-grid';
import HowItWorks from '@/components/sections/how-it-works';
import Differentiators from '@/components/sections/differentiators';
import SocialProof from '@/components/sections/social-proof';
import FinalCTA from '@/components/sections/final-cta';
import SiteFooter from '@/components/sections/site-footer';

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        {/* HERO with scroll-expansion behavior — locks scroll until media expands */}
        <Hero />

        {/* Once the hero unlocks, the rest of the page flows normally */}
        <FeatureGrid />
        <HowItWorks />
        <Differentiators />
        <SocialProof />
        <FinalCTA />
      </main>
      <SiteFooter />
    </>
  );
}
