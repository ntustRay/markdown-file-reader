import { test, expect } from '@playwright/test';

/**
 * MarkView - 基本 UI 渲染測試
 * TDD: 驗證應用程式正確載入並顯示所有必要的 UI 元素
 */
test.describe('應用程式基本載入', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('應顯示應用程式標題', async ({ page }) => {
    // 檢查頁面標題
    await expect(page).toHaveTitle('MarkView - Markdown 閱讀器');
  });

  test('應顯示側邊欄品牌標誌', async ({ page }) => {
    // 檢查側邊欄品牌名稱
    const brand = page.locator('.sidebar-brand h1');
    await expect(brand).toHaveText('MarkView');
  });

  test('應顯示版本號', async ({ page }) => {
    const version = page.locator('.sidebar-version');
    await expect(version).toContainText('v0.2.0');
  });

  test('應顯示搜尋輸入框', async ({ page }) => {
    const searchInput = page.locator('#search-input');
    await expect(searchInput).toBeVisible();
    await expect(searchInput).toHaveAttribute('placeholder', 'Quick Find...');
  });

  test('應顯示開啟資料夾按鈕', async ({ page }) => {
    const openFolderBtn = page.locator('#open-folder');
    await expect(openFolderBtn).toBeVisible();
    await expect(openFolderBtn).toContainText('開啟資料夾');
  });

  test('應顯示開啟檔案按鈕', async ({ page }) => {
    const openFileBtn = page.locator('#open-file');
    await expect(openFileBtn).toBeVisible();
    await expect(openFileBtn).toContainText('開啟檔案');
  });

  test('應顯示編輯模式切換按鈕', async ({ page }) => {
    const editToggle = page.locator('#edit-mode-toggle');
    await expect(editToggle).toBeVisible();
    await expect(editToggle).toContainText('編輯');
  });

  test('應顯示主題切換按鈕', async ({ page }) => {
    const themeToggle = page.locator('#theme-toggle');
    await expect(themeToggle).toBeVisible();
  });

  test('應顯示內容區域', async ({ page }) => {
    const content = page.locator('#content');
    await expect(content).toBeVisible();
  });

  test('應顯示麵包屑導航', async ({ page }) => {
    const breadcrumbs = page.locator('.breadcrumbs');
    await expect(breadcrumbs).toBeVisible();

    const fileName = page.locator('#file-name');
    await expect(fileName).toBeVisible();
  });
});
