import { expect, test } from '@playwright/test';

test.describe('mobile single-document shell', () => {
  test.use({ viewport: { width: 412, height: 915 } });

  test('does not expose open controls before their handlers are ready', async ({ page }) => {
    let releaseMainModule: () => void = () => undefined;
    const mainModuleBlocked = new Promise<void>((resolve) => {
      releaseMainModule = resolve;
    });

    await page.route('**/src/main.ts', async (route) => {
      await mainModuleBlocked;
      await route.continue();
    });

    const navigation = page.goto('/');
    await page.locator('#empty-open-file').waitFor({ state: 'attached' });
    try {
      await expect(page.locator('#open-file')).toBeHidden();
      await expect(page.locator('#empty-open-file')).toBeHidden();
    } finally {
      releaseMainModule();
      await navigation;
    }

    await expect(page.locator('#open-file')).toBeVisible();
    await expect(page.locator('#empty-open-file')).toBeVisible();
  });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('shows only the focused empty workflow', async ({ page }) => {
    await expect(page).toHaveTitle('Ray Markdown Reader');
    await expect(page.getByRole('heading', { name: 'Open a Markdown file' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Open file' })).toHaveCount(2);
    await expect(page.locator('#file-name')).toHaveText('No file');
    await expect(page.locator('aside, #search-input, #open-folder')).toHaveCount(0);
    await expect(page.locator('#mode-toggle')).toBeHidden();
    await expect(page.locator('#save-file')).toBeHidden();
  });

  test('provides phone-sized controls and persistent theme choice', async ({ page }) => {
    const openButton = page.locator('#open-file');
    const openBox = await openButton.boundingBox();
    expect(openBox?.width).toBeGreaterThanOrEqual(48);
    expect(openBox?.height).toBeGreaterThanOrEqual(48);

    const themeButton = page.locator('#theme-toggle');
    await themeButton.click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  });

  test('does not overflow the phone viewport horizontally', async ({ page }) => {
    const widths = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      content: document.documentElement.scrollWidth,
    }));

    expect(widths.content).toBe(widths.viewport);
  });
});
