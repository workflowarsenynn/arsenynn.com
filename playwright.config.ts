import { defineConfig, devices } from '@playwright/test';

// Тесты идут против собранного сайта (astro preview). Матрица ширин из advisory.
export default defineConfig({
  testDir: 'tests',
  fullyParallel: true,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: 'http://localhost:4321',
    colorScheme: 'dark',
    // В облачной сессии Claude Chromium лежит в /opt/pw-browsers; в CI ставится npx playwright install.
    launchOptions: process.env.PW_CHROMIUM ? { executablePath: process.env.PW_CHROMIUM } : {},
  },
  webServer: {
    command: 'npm run preview -- --port 4321',
    url: 'http://localhost:4321',
    reuseExistingServer: !process.env.CI,
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
