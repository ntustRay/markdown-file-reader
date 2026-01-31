import { test, expect } from '@playwright/test';

/**
 * MarkView - Markdown 渲染測試
 * TDD: 驗證各種 Markdown 語法的正確渲染
 */
test.describe('Markdown 基本語法渲染', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // 切換到編輯模式以測試 Markdown 渲染
    await page.locator('#edit-mode-toggle').click();
  });

  test('應渲染標題 (H1-H6)', async ({ page }) => {
    const textarea = page.locator('#editor-textarea');
    const content = page.locator('#content');

    await textarea.fill('# 一級標題\n## 二級標題\n### 三級標題');
    await page.waitForTimeout(100);

    await expect(content.locator('h1')).toHaveText('一級標題');
    await expect(content.locator('h2')).toHaveText('二級標題');
    await expect(content.locator('h3')).toHaveText('三級標題');
  });

  test('應渲染粗體文字', async ({ page }) => {
    const textarea = page.locator('#editor-textarea');
    const content = page.locator('#content');

    await textarea.fill('這是 **粗體** 文字');
    await page.waitForTimeout(100);

    const bold = content.locator('strong');
    await expect(bold).toHaveText('粗體');
  });

  test('應渲染斜體文字', async ({ page }) => {
    const textarea = page.locator('#editor-textarea');
    const content = page.locator('#content');

    await textarea.fill('這是 *斜體* 文字');
    await page.waitForTimeout(100);

    const italic = content.locator('em');
    await expect(italic).toHaveText('斜體');
  });

  test('應渲染刪除線文字', async ({ page }) => {
    const textarea = page.locator('#editor-textarea');
    const content = page.locator('#content');

    await textarea.fill('這是 ~~刪除線~~ 文字');
    await page.waitForTimeout(100);

    const del = content.locator('del');
    await expect(del).toHaveText('刪除線');
  });

  test('應渲染無序列表', async ({ page }) => {
    const textarea = page.locator('#editor-textarea');
    const content = page.locator('#content');

    await textarea.fill('- 項目一\n- 項目二\n- 項目三');
    await page.waitForTimeout(100);

    const list = content.locator('ul');
    await expect(list).toBeVisible();

    const items = content.locator('ul li');
    await expect(items).toHaveCount(3);
  });

  test('應渲染有序列表', async ({ page }) => {
    const textarea = page.locator('#editor-textarea');
    const content = page.locator('#content');

    await textarea.fill('1. 第一項\n2. 第二項\n3. 第三項');
    await page.waitForTimeout(100);

    const list = content.locator('ol');
    await expect(list).toBeVisible();

    const items = content.locator('ol li');
    await expect(items).toHaveCount(3);
  });

  test('應渲染連結', async ({ page }) => {
    const textarea = page.locator('#editor-textarea');
    const content = page.locator('#content');

    await textarea.fill('[Google](https://www.google.com)');
    await page.waitForTimeout(100);

    const link = content.locator('a');
    await expect(link).toHaveText('Google');
    await expect(link).toHaveAttribute('href', 'https://www.google.com');
  });

  test('應渲染行內程式碼', async ({ page }) => {
    const textarea = page.locator('#editor-textarea');
    const content = page.locator('#content');

    await textarea.fill('使用 `console.log()` 輸出');
    await page.waitForTimeout(100);

    const code = content.locator('code');
    await expect(code).toContainText('console.log()');
  });

  test('應渲染引用區塊', async ({ page }) => {
    const textarea = page.locator('#editor-textarea');
    const content = page.locator('#content');

    await textarea.fill('> 這是一段引用');
    await page.waitForTimeout(100);

    const blockquote = content.locator('blockquote');
    await expect(blockquote).toBeVisible();
    await expect(blockquote).toContainText('這是一段引用');
  });

  test('應渲染水平分隔線', async ({ page }) => {
    const textarea = page.locator('#editor-textarea');
    const content = page.locator('#content');

    await textarea.fill('上方內容\n\n---\n\n下方內容');
    await page.waitForTimeout(100);

    const hr = content.locator('hr');
    await expect(hr).toBeVisible();
  });
});

test.describe('程式碼區塊渲染', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.locator('#edit-mode-toggle').click();
  });

  test('應渲染 JavaScript 程式碼區塊', async ({ page }) => {
    const textarea = page.locator('#editor-textarea');
    const content = page.locator('#content');

    await textarea.fill('```javascript\nfunction hello() {\n  console.log("Hello");\n}\n```');
    await page.waitForTimeout(100);

    const codeBlock = content.locator('pre code');
    await expect(codeBlock).toBeVisible();
    await expect(codeBlock).toContainText('function hello()');
  });

  test('應渲染 Python 程式碼區塊', async ({ page }) => {
    const textarea = page.locator('#editor-textarea');
    const content = page.locator('#content');

    await textarea.fill('```python\ndef hello():\n    print("Hello")\n```');
    await page.waitForTimeout(100);

    const codeBlock = content.locator('pre code');
    await expect(codeBlock).toBeVisible();
    await expect(codeBlock).toContainText('def hello()');
  });

  test('程式碼區塊應套用語法高亮', async ({ page }) => {
    const textarea = page.locator('#editor-textarea');
    const content = page.locator('#content');

    await textarea.fill('```javascript\nconst x = 42;\n```');
    await page.waitForTimeout(200);

    // 檢查是否有 hljs class（highlight.js 套用的 class）
    const codeBlock = content.locator('pre code');
    await expect(codeBlock).toHaveClass(/hljs|language-javascript/);
  });
});

test.describe('表格渲染', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.locator('#edit-mode-toggle').click();
  });

  test('應渲染 Markdown 表格', async ({ page }) => {
    const textarea = page.locator('#editor-textarea');
    const content = page.locator('#content');

    await textarea.fill('| 欄位一 | 欄位二 |\n|--------|--------|\n| 值一   | 值二   |');
    await page.waitForTimeout(100);

    const table = content.locator('table');
    await expect(table).toBeVisible();

    const headerCells = content.locator('th');
    await expect(headerCells).toHaveCount(2);

    const bodyCells = content.locator('td');
    await expect(bodyCells).toHaveCount(2);
  });
});

test.describe('任務列表渲染', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.locator('#edit-mode-toggle').click();
  });

  test('應渲染任務列表', async ({ page }) => {
    const textarea = page.locator('#editor-textarea');
    const content = page.locator('#content');

    await textarea.fill('- [ ] 未完成任務\n- [x] 已完成任務');
    await page.waitForTimeout(100);

    const checkboxes = content.locator('input[type="checkbox"]');
    await expect(checkboxes).toHaveCount(2);
  });
});
