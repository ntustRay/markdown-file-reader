import { test, expect } from '@playwright/test';

/**
 * MarkView - 行動裝置響應式測試
 * TDD: 驗證行動裝置上的 UI 行為
 */
test.describe('行動裝置選單', () => {
  test.beforeEach(async ({ page }) => {
    // 設定行動裝置視窗大小 (iPhone 13)
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
  });

  test('應顯示行動裝置選單按鈕', async ({ page }) => {
    const menuToggle = page.locator('#menu-toggle');
    await expect(menuToggle).toBeVisible();
  });

  test('側邊欄預設應存在', async ({ page }) => {
    const sidebar = page.locator('#sidebar');
    // 在行動裝置上，sidebar 可能通過 CSS transform 隱藏
    await expect(sidebar).toBeAttached();
  });

  test('點擊選單按鈕應顯示側邊欄', async ({ page }) => {
    const menuToggle = page.locator('#menu-toggle');
    const sidebar = page.locator('#sidebar');

    await menuToggle.click();

    // 側邊欄應該有 open class
    await expect(sidebar).toHaveClass(/open/);
  });

  test('應顯示側邊欄遮罩層', async ({ page }) => {
    const overlay = page.locator('#sidebar-overlay');
    await expect(overlay).toBeAttached();
  });

  test('點擊選單後遮罩層應變為 visible', async ({ page }) => {
    const menuToggle = page.locator('#menu-toggle');
    const overlay = page.locator('#sidebar-overlay');

    await menuToggle.click();

    // 遮罩層應該有 visible class
    await expect(overlay).toHaveClass(/visible/);
  });

  test('點擊遮罩層應關閉側邊欄', async ({ page }) => {
    const menuToggle = page.locator('#menu-toggle');
    const overlay = page.locator('#sidebar-overlay');
    const sidebar = page.locator('#sidebar');

    // 開啟側邊欄
    await menuToggle.click();
    await expect(sidebar).toHaveClass(/open/);

    // 點擊遮罩層關閉
    await overlay.click();
    await expect(sidebar).not.toHaveClass(/open/);
  });
});

test.describe('平板裝置顯示', () => {
  test.beforeEach(async ({ page }) => {
    // 設定平板視窗大小 (iPad Pro 11)
    await page.setViewportSize({ width: 834, height: 1194 });
    await page.goto('/');
  });

  test('應正確顯示應用程式', async ({ page }) => {
    await expect(page).toHaveTitle('MarkView - Markdown 閱讀器');
  });

  test('應顯示側邊欄', async ({ page }) => {
    const sidebar = page.locator('#sidebar');
    await expect(sidebar).toBeVisible();
  });

  test('應顯示內容區域', async ({ page }) => {
    const content = page.locator('#content');
    await expect(content).toBeVisible();
  });
});

test.describe('響應式布局', () => {
  test('在寬螢幕上應同時顯示側邊欄和內容', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/');

    const sidebar = page.locator('#sidebar');
    const mainContent = page.locator('.main-content');

    await expect(sidebar).toBeVisible();
    await expect(mainContent).toBeVisible();
  });

  test('在窄螢幕上選單按鈕應可見', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    const menuToggle = page.locator('#menu-toggle');
    await expect(menuToggle).toBeVisible();
  });
});
