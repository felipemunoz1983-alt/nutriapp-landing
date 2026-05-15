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
