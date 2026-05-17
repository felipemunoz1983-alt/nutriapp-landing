'use client';

import { useEffect } from 'react';
import ScrollExpandMedia from '@/components/blocks/scroll-expansion-hero';
import TrackedAppLink from '@/components/tracked-app-link';
// Self-hosted hero assets served from /public/hero/. Avoids the runtime
// dependency on the Unsplash CDN that the original scaffold introduced.
// Source photos (Unsplash License, attribution-recommended):
//   foreground: https://unsplash.com/photos/poke-bowl  (photo-1546069901-...)
//   background: https://unsplash.com/photos/fruit-platter (photo-1490645935967-...)
const HERO_MEDIA = {
  src: '/hero/foreground.jpg',
  background: '/hero/background.jpg',
  title: 'Nutrición Personalizada',
  date: 'Centro Metabólico · Chile',
  scrollToExpand: 'Desliza para descubrir',
};

export default function Hero() {
  // Reset scroll on mount so the expansion starts from frame 0
  useEffect(() => {
    window.scrollTo(0, 0);
    const resetEvent = new Event('resetSection');
    window.dispatchEvent(resetEvent);
  }, []);

  return (
    <ScrollExpandMedia
      mediaType="image"
      mediaSrc={HERO_MEDIA.src}
      bgImageSrc={HERO_MEDIA.background}
      title={HERO_MEDIA.title}
      date={HERO_MEDIA.date}
      scrollToExpand={HERO_MEDIA.scrollToExpand}
    >
      <div className="max-w-3xl mx-auto text-center">
        <p className="inline-block rounded-full px-3 py-1 text-xs font-medium tracking-wide uppercase mb-6 bg-[var(--surface-tint)] text-[var(--brand-cyan-dark)]">
          App clínico-deportiva
        </p>
        <h2 className="text-3xl md:text-5xl font-bold mb-6 text-[var(--surface-ink)] tracking-tight">
          La nutrición que <span className="text-[var(--brand-cyan-dark)]">respeta tu digestión</span>,
          tu entrenamiento y tu rutina real.
        </h2>
        <p className="text-lg md:text-xl text-[var(--surface-muted)] leading-relaxed">
          NutriApp Pro no es otra app de calorías. Es la herramienta clínica
          que el equipo de Centro Metabólico usa para diseñar planes nutricionales
          que sí se sostienen — porque parten de tu sistema digestivo, tu
          composición corporal y tu adherencia real, no de un promedio.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
          <TrackedAppLink
            location="hero"
            className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-base font-medium text-white shadow-sm hover:shadow-md transition-all cursor-pointer"
            style={{ background: 'var(--brand-mint-dark)' }}
          >
            Acceder a la app
          </TrackedAppLink>
          <a
            href="#como-funciona"
            className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-base font-medium border-2 transition-colors cursor-pointer text-[var(--brand-cyan-dark)] border-[var(--brand-cyan-dark)] hover:bg-[var(--surface-tint)]"
          >
            Ver cómo funciona
          </a>
        </div>
      </div>
    </ScrollExpandMedia>
  );
}
