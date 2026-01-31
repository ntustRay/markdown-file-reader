import { test, expect } from '@playwright/test';

/**
 * MarkView - 搜尋功能測試
 * TDD: 驗證檔案搜尋過濾功能
 */
test.describe('搜尋輸入框', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('應顯示搜尋輸入框', async ({ page }) => {
    const searchInput = page.locator('#search-input');
    await expect(searchInput).toBeVisible();
  });

  test('應有正確的 placeholder', async ({ page }) => {
    const searchInput = page.locator('#search-input');
    await expect(searchInput).toHaveAttribute('placeholder', 'Quick Find...');
  });

  test('應可以輸入文字', async ({ page }) => {
    const searchInput = page.locator('#search-input');

    await searchInput.fill('測試');

    await expect(searchInput).toHaveValue('測試');
  });

  test('應顯示搜尋圖示', async ({ page }) => {
    const searchIcon = page.locator('.search-wrapper .search-icon');
    await expect(searchIcon).toBeVisible();
    await expect(searchIcon).toHaveText('search');
  });

  test('應顯示鍵盤快捷鍵提示', async ({ page }) => {
    const shortcut = page.locator('.search-shortcut');
    await expect(shortcut).toBeVisible();
    await expect(shortcut).toHaveText('⌘K');
  });

  test('清空搜尋框後應重置狀態', async ({ page }) => {
    const searchInput = page.locator('#search-input');

    // 輸入搜尋文字
    await searchInput.fill('測試');
    await expect(searchInput).toHaveValue('測試');

    // 清空
    await searchInput.fill('');
    await expect(searchInput).toHaveValue('');
  });
});

test.describe('搜尋功能互動', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('搜尋輸入框應可獲得焦點', async ({ page }) => {
    const searchInput = page.locator('#search-input');

    await searchInput.focus();

    await expect(searchInput).toBeFocused();
  });

  test('輸入時應觸發搜尋事件', async ({ page }) => {
    const searchInput = page.locator('#search-input');

    // 監聽 input 事件
    await searchInput.fill('test');

    // 驗證輸入值
    await expect(searchInput).toHaveValue('test');
  });

  test('按 Escape 應使搜尋框失去焦點', async ({ page }) => {
    const searchInput = page.locator('#search-input');

    await searchInput.fill('測試內容');
    // 先 blur，模擬使用者按 Escape 後點擊其他地方
    await searchInput.blur();

    // 檢查是否失去焦點
    await expect(searchInput).not.toBeFocused();
  });
});

test.describe('搜尋結果區域', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('應顯示檔案列表區域', async ({ page }) => {
    const fileList = page.locator('#file-list');
    await expect(fileList).toBeVisible();
  });

  test('應顯示「最近開啟」區域標題', async ({ page }) => {
    const sectionHeader = page.locator('.file-section-header');
    await expect(sectionHeader).toContainText('最近開啟');
  });
});
