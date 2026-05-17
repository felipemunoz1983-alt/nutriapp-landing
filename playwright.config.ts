import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright config for the NutriApp Pro landing.
 * Smoke tests focus on the highest-risk behaviour: the scroll-locked hero
 * and the anchor-link navigation that bypasses it.
 *
 * Run locally:  npm test
 * Headed:       npm run test:headed
 */
export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  // Cap at 2 workers locally — Next.js dev server can't keep up with 6+
  // concurrent test contexts on first request.
  workers: process.env.CI ? 1 : 2,
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:3002',
    trace: 'on-first-retry',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium-desktop',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } },
    },
    {
      // Pixel 5 mocks a 393×851 mobile viewport on Chromium — no extra
      // browser download required (vs. iPhone 13 which needs WebKit).
      name: 'chromium-mobile',
      use: { ...devices['Pixel 5'] },
    },
  ],
  webServer: {
    command: 'npm run dev -- --port 3002',
    url: 'http://localhost:3002',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
