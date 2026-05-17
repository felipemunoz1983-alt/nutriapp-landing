import { test, expect, type Page } from '@playwright/test';

const APP_LOGIN_URL = 'https://centro-metabolico-pro.vercel.app/login';
const TARGET_HASH_BY_NAV_LABEL: Record<string, string> = {
  Funcionalidades: '#features',
  'Cómo funciona': '#como-funciona',
  'Por qué es distinta': '#diferencia',
  Testimonios: '#testimonios',
};

// Helper: nudge the scroll-expansion hero until it unlocks.
async function expandHero(page: Page) {
  // The hero handler accumulates progress per wheel tick (deltaY * 0.0009).
  // 25 ticks of 1500px is plenty to reach progress >= 1 on either viewport.
  for (let i = 0; i < 25; i++) {
    await page.mouse.wheel(0, 1500);
    await page.waitForTimeout(40);
  }
  await page.waitForTimeout(400);
}

test.describe('NutriApp Pro landing — smoke', () => {
  test('home page renders with key headings', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/NutriApp Pro/);
    await expect(page.getByRole('heading', { name: /Nutrición/ }).first()).toBeVisible();
    // Header brand
    await expect(page.getByRole('link', { name: /NutriApp Pro — inicio/ })).toBeVisible();
  });

  test('hero locks page scroll until expanded', async ({ page }) => {
    await page.goto('/');
    // Wait for React mount + useEffect that registers the scroll listener.
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    // Attempt a programmatic scroll — the locked hero should snap back to top.
    await page.evaluate(() => window.scrollTo(0, 2000));
    await page.waitForTimeout(400);
    const lockedY = await page.evaluate(() => window.scrollY);
    expect(lockedY).toBe(0);

    // After expansion, scrolling should be allowed.
    await expandHero(page);
    await page.evaluate(() => window.scrollTo(0, 2000));
    await page.waitForTimeout(300);
    const unlockedY = await page.evaluate(() => window.scrollY);
    expect(unlockedY).toBeGreaterThan(1000);
  });

  test('header nav anchors scroll to their targets', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Header nav links are hidden on mobile (hidden md:flex)');
    await page.goto('/');
    for (const [label, hash] of Object.entries(TARGET_HASH_BY_NAV_LABEL)) {
      // Reset to top between tests (the hero unlock persists across clicks)
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(150);

      await page.getByRole('navigation').getByRole('link', { name: label }).click();
      // Two rAFs + smooth scroll — generous wait
      await page.waitForTimeout(2500);

      // Target id should be at (or very near) the top of the viewport.
      const elementId = hash.slice(1);
      const { scrollY, targetTop } = await page.evaluate((id) => {
        const el = document.getElementById(id)!;
        return {
          scrollY: window.scrollY,
          targetTop: el.getBoundingClientRect().top + window.scrollY,
        };
      }, elementId);
      expect(Math.abs(scrollY - targetTop)).toBeLessThan(10);
      expect(new URL(page.url()).hash).toBe(hash);
    }
  });

  test('every "Acceder a la app" CTA opens the login app in a new tab', async ({ page }) => {
    await page.goto('/');
    const links = page.locator('a', { hasText: /Acceder a la app/ });
    const count = await links.count();
    expect(count).toBeGreaterThanOrEqual(3);
    for (let i = 0; i < count; i++) {
      const link = links.nth(i);
      await expect(link).toHaveAttribute('href', APP_LOGIN_URL);
      await expect(link).toHaveAttribute('target', '_blank');
      await expect(link).toHaveAttribute('rel', /noopener/);
    }
  });

  test('Instagram footer link is wired correctly', async ({ page }) => {
    await page.goto('/');
    // Unlock the hero so the footer is reachable
    await expandHero(page);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    const ig = page.getByRole('contentinfo').getByRole('link', { name: '@centrometabolico', exact: true });
    await expect(ig).toHaveAttribute('href', 'https://instagram.com/centrometabolico');
    await expect(ig).toHaveAttribute('target', '_blank');
    await expect(ig).toHaveAttribute('rel', /noopener/);
    await expect(ig.locator('svg')).toBeVisible();
  });

  test('SEO routes respond with content', async ({ page, request }) => {
    const robots = await request.get('/robots.txt');
    expect(robots.status()).toBe(200);
    expect(await robots.text()).toContain('Sitemap:');

    const sitemap = await request.get('/sitemap.xml');
    expect(sitemap.status()).toBe(200);
    expect(await sitemap.text()).toContain('<urlset');
  });

  test('home page emits no console errors on load', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    // Filter the well-known dev-mode noise we don't care about:
    //   - Next.js HMR / hydration logs
    //   - @vercel/analytics 400s when the project ID isn't known to dev
    //     (it works in production)
    //   - Generic "Failed to load resource" lines emitted as a side effect
    //     of the analytics request above
    const unexpected = errors.filter(
      (e) =>
        !/Hydration|webpack-hmr/i.test(e) &&
        !/Failed to load resource/i.test(e) &&
        !/vercel-insights|vitals\.vercel/i.test(e)
    );
    expect(unexpected, JSON.stringify(unexpected)).toEqual([]);
  });
});
