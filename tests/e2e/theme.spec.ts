import { test, expect } from '@playwright/test';

/**
 * MarkView - 主題切換測試
 * TDD: 驗證深色/淺色主題切換功能正常運作
 */
test.describe('主題切換功能', () => {
  test.beforeEach(async ({ page }) => {
    // 清除 localStorage 確保初始狀態
    await page.addInitScript(() => {
      localStorage.clear();
    });
    await page.goto('/');
  });

  test('預設應為淺色主題', async ({ page }) => {
    const body = page.locator('body');
    await expect(body).not.toHaveClass(/dark/);
  });

  test('點擊主題按鈕應切換到深色主題', async ({ page }) => {
    const themeToggle = page.locator('#theme-toggle');
    const body = page.locator('body');

    // 初始為淺色
    await expect(body).not.toHaveClass(/dark/);

    // 點擊切換
    await themeToggle.click();

    // 應變為深色
    await expect(body).toHaveClass(/dark/);
  });

  test('再次點擊應切換回淺色主題', async ({ page }) => {
    const themeToggle = page.locator('#theme-toggle');
    const body = page.locator('body');

    // 點擊兩次
    await themeToggle.click();
    await expect(body).toHaveClass(/dark/);

    await themeToggle.click();
    await expect(body).not.toHaveClass(/dark/);
  });

  test('主題設定應保存到 localStorage', async ({ page }) => {
    const themeToggle = page.locator('#theme-toggle');

    // 切換到深色主題
    await themeToggle.click();

    // 檢查 localStorage
    const savedTheme = await page.evaluate(() => localStorage.getItem('theme'));
    expect(savedTheme).toBe('dark');
  });


  test('深色主題時圖示應顯示 dark_mode', async ({ page }) => {
    const themeToggle = page.locator('#theme-toggle');
    const themeIcon = page.locator('#theme-toggle .theme-icon');

    // 切換到深色主題
    await themeToggle.click();

    // 圖示應該變成 dark_mode
    await expect(themeIcon).toHaveText('dark_mode');
  });

  test('淺色主題時圖示應顯示 light_mode', async ({ page }) => {
    const themeIcon = page.locator('#theme-toggle .theme-icon');

    // 預設淺色主題，圖示應該是 light_mode
    await expect(themeIcon).toHaveText('light_mode');
  });
});

test.describe('主題持久化', () => {
  test('應從 localStorage 載入已保存的深色主題', async ({ page }) => {
    // 先設定 localStorage
    await page.addInitScript(() => {
      localStorage.setItem('theme', 'dark');
    });

    await page.goto('/');

    const body = page.locator('body');
    await expect(body).toHaveClass(/dark/);
  });

  test('應從 localStorage 載入已保存的淺色主題', async ({ page }) => {
    // 先設定 localStorage
    await page.addInitScript(() => {
      localStorage.setItem('theme', 'light');
    });

    await page.goto('/');

    const body = page.locator('body');
    await expect(body).not.toHaveClass(/dark/);
  });

  test('重新載入頁面應保持主題設定', async ({ page }) => {
    // 不設定 addInitScript 以避免清除 localStorage
    await page.goto('/');

    const themeToggle = page.locator('#theme-toggle');
    const body = page.locator('body');

    // 切換到深色主題
    await themeToggle.click();
    await expect(body).toHaveClass(/dark/);

    // 確認 localStorage 已保存
    const savedTheme = await page.evaluate(() => localStorage.getItem('theme'));
    expect(savedTheme).toBe('dark');

    // 重新載入頁面
    await page.reload();

    // 等待頁面載入完成
    await page.waitForLoadState('domcontentloaded');

    // 應該仍然是深色主題
    await expect(body).toHaveClass(/dark/);
  });
});
