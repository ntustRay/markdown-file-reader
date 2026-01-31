import { test, expect } from '@playwright/test';

/**
 * MarkView - 編輯模式測試
 * TDD: 驗證編輯模式切換、分割視圖、行號顯示等功能
 */
test.describe('編輯模式切換', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('預設應為預覽模式', async ({ page }) => {
    const editorPane = page.locator('#editor-pane');
    const previewPane = page.locator('#preview-pane');

    // 編輯區域預設隱藏
    await expect(editorPane).toBeHidden();

    // 預覽區域應可見
    await expect(previewPane).toBeVisible();
  });

  test('點擊編輯按鈕應切換到編輯模式', async ({ page }) => {
    const editToggle = page.locator('#edit-mode-toggle');
    const editorPane = page.locator('#editor-pane');

    await editToggle.click();

    // 編輯區域應顯示
    await expect(editorPane).toBeVisible();
  });

  test('編輯模式應顯示分割視圖', async ({ page }) => {
    const editToggle = page.locator('#edit-mode-toggle');
    const editorPane = page.locator('#editor-pane');
    const previewPane = page.locator('#preview-pane');

    await editToggle.click();

    // 兩個區域都應可見
    await expect(editorPane).toBeVisible();
    await expect(previewPane).toBeVisible();
  });

  test('編輯模式按鈕文字應變為「預覽」', async ({ page }) => {
    const editToggle = page.locator('#edit-mode-toggle');

    // 初始文字
    await expect(editToggle).toContainText('編輯');

    await editToggle.click();

    // 應變為「預覽」
    await expect(editToggle).toContainText('預覽');
  });

  test('編輯模式圖示應變為 visibility', async ({ page }) => {
    const editToggle = page.locator('#edit-mode-toggle');
    const icon = editToggle.locator('.material-symbols-outlined');

    await editToggle.click();

    await expect(icon).toHaveText('visibility');
  });

  test('再次點擊應切換回預覽模式', async ({ page }) => {
    const editToggle = page.locator('#edit-mode-toggle');
    const editorPane = page.locator('#editor-pane');

    // 切換到編輯模式
    await editToggle.click();
    await expect(editorPane).toBeVisible();

    // 切換回預覽模式
    await editToggle.click();
    await expect(editorPane).toBeHidden();
  });

  test('切換回預覽模式後按鈕文字應恢復為「編輯」', async ({ page }) => {
    const editToggle = page.locator('#edit-mode-toggle');

    await editToggle.click();
    await editToggle.click();

    await expect(editToggle).toContainText('編輯');
  });
});

test.describe('編輯器功能', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // 切換到編輯模式
    await page.locator('#edit-mode-toggle').click();
  });

  test('應顯示編輯器文字區域', async ({ page }) => {
    const textarea = page.locator('#editor-textarea');
    await expect(textarea).toBeVisible();
  });

  test('應顯示行號欄', async ({ page }) => {
    const gutter = page.locator('#editor-gutter');
    await expect(gutter).toBeVisible();
  });

  test('在編輯器輸入文字應更新預覽', async ({ page }) => {
    const textarea = page.locator('#editor-textarea');
    const content = page.locator('#content');

    // 清空並輸入新內容
    await textarea.fill('# 測試標題\n\n這是測試內容。');

    // 等待渲染
    await page.waitForTimeout(100);

    // 檢查預覽區域
    await expect(content).toContainText('測試標題');
    await expect(content).toContainText('這是測試內容');
  });

  test('輸入 Markdown 語法應正確渲染', async ({ page }) => {
    const textarea = page.locator('#editor-textarea');
    const content = page.locator('#content');

    await textarea.fill('**粗體** 和 *斜體*');

    await page.waitForTimeout(100);

    // 檢查是否有粗體和斜體元素
    const bold = content.locator('strong');
    const italic = content.locator('em');

    await expect(bold).toHaveText('粗體');
    await expect(italic).toHaveText('斜體');
  });

  test('輸入程式碼區塊應正確渲染', async ({ page }) => {
    const textarea = page.locator('#editor-textarea');
    const content = page.locator('#content');

    await textarea.fill('```javascript\nconsole.log("Hello");\n```');

    await page.waitForTimeout(100);

    // 檢查是否有程式碼區塊
    const codeBlock = content.locator('pre code');
    await expect(codeBlock).toBeVisible();
    await expect(codeBlock).toContainText('console.log');
  });
});

test.describe('儲存按鈕', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('預覽模式下儲存按鈕應隱藏', async ({ page }) => {
    const saveBtn = page.locator('#save-file');
    await expect(saveBtn).toBeHidden();
  });

  test('編輯模式下儲存按鈕應顯示', async ({ page }) => {
    const editToggle = page.locator('#edit-mode-toggle');
    const saveBtn = page.locator('#save-file');

    await editToggle.click();

    await expect(saveBtn).toBeVisible();
  });

  test('切換回預覽模式儲存按鈕應隱藏', async ({ page }) => {
    const editToggle = page.locator('#edit-mode-toggle');
    const saveBtn = page.locator('#save-file');

    await editToggle.click();
    await expect(saveBtn).toBeVisible();

    await editToggle.click();
    await expect(saveBtn).toBeHidden();
  });
});
