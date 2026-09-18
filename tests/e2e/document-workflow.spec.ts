import { expect, test } from '@playwright/test';

interface ReaderTestState {
  content: string;
  cancelCreate: boolean;
  failCreate: boolean;
  failWrite: boolean;
  writeDelay: number;
  creates: number;
  writes: number;
}

declare global {
  interface Window {
    readerTest: ReaderTestState;
  }
}

test.use({ viewport: { width: 360, height: 800 }, userAgent: 'Android test device' });

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.readerTest = {
      content: '', cancelCreate: false, failCreate: false,
      failWrite: false, writeDelay: 0, creates: 0, writes: 0,
    };
    Object.defineProperty(window, '__TAURI_INTERNALS__', {
      value: {
        async invoke(command: string, args: { payload: { data: string } }) {
          const state = window.readerTest;
          if (command === 'plugin:android-content|create_document') {
            state.creates += 1;
            if (state.failCreate) throw new Error('Provider unavailable');
            if (state.cancelCreate) return { uri: null };
            state.content = '';
            return { uri: 'content://test/notes.md' };
          }
          if (command === 'plugin:android-content|open_document') return { uri: 'content://test/notes.md' };
          if (command === 'plugin:android-content|read_content_uri') {
            const bytes = new TextEncoder().encode(state.content);
            return { name: 'notes.md', data: btoa(String.fromCharCode(...bytes)), size: bytes.length };
          }
          if (command === 'plugin:android-content|write_content_uri') {
            state.writes += 1;
            await new Promise(resolve => setTimeout(resolve, state.writeDelay));
            if (state.failWrite) throw new Error('Read only');
            state.content = new TextDecoder().decode(Uint8Array.from(atob(args.payload.data), c => c.charCodeAt(0)));
            return;
          }
          throw new Error(`Unexpected command: ${command}`);
        },
      },
    });
  });
  await page.goto('/');
});

test('creates, edits, previews, saves and reopens a Unicode Markdown file', async ({ page }) => {
  await page.locator('#empty-new-file').click();
  const editor = page.getByRole('textbox', { name: 'Document editor' });
  await expect(editor).toBeFocused();
  await editor.fill('# 我的筆記\n\nHello **world** 👋');
  await page.getByRole('button', { name: 'Save', exact: true }).click();
  await expect(page.locator('#file-name')).toHaveText('notes.md');
  await page.getByRole('button', { name: 'Preview', exact: true }).click();
  await expect(page.locator('#preview-pane h1')).toHaveText('我的筆記');
  await expect(page.locator('#preview-pane strong')).toHaveText('world');
  await page.locator('#open-file').click();
  await page.getByRole('button', { name: 'Edit', exact: true }).click();
  await expect(editor).toHaveValue('# 我的筆記\n\nHello **world** 👋');
});

test('cancelled creation preserves the current draft', async ({ page }) => {
  await page.locator('#new-file').click();
  await page.locator('#editor-textarea').fill('keep this');
  await page.evaluate(() => { window.readerTest.cancelCreate = true; });
  await page.locator('#new-file').click();
  await page.getByRole('button', { name: 'Discard', exact: true }).click();
  await expect(page.locator('#editor-textarea')).toHaveValue('keep this');
  await expect(page.locator('#file-name')).toHaveText('notes.md •');
});

test('Escape after a previous discard cancels rather than discarding again', async ({ page }) => {
  await page.locator('#new-file').click();
  await page.locator('#editor-textarea').fill('draft');
  await page.evaluate(() => { window.readerTest.cancelCreate = true; });
  await page.locator('#new-file').click();
  await page.getByRole('button', { name: 'Discard', exact: true }).click();
  await expect(page.locator('#new-file')).toBeEnabled();
  await page.locator('#new-file').click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toBeHidden();
  expect(await page.evaluate(() => window.readerTest.creates)).toBe(2);
  await expect(page.locator('#editor-textarea')).toHaveValue('draft');
});

test('failed save before new file keeps the draft and prevents creation', async ({ page }) => {
  await page.locator('#new-file').click();
  await page.locator('#editor-textarea').fill('draft');
  await page.evaluate(() => { window.readerTest.failWrite = true; });
  await page.locator('#new-file').click();
  await page.locator('#confirm-save').click();
  await expect(page.getByRole('status')).toContainText('could not be saved');
  await expect(page.locator('#editor-textarea')).toHaveValue('draft');
  expect(await page.evaluate(() => window.readerTest.creates)).toBe(1);
});

test('save then create writes the old draft before replacing it', async ({ page }) => {
  await page.locator('#new-file').click();
  await page.locator('#editor-textarea').fill('draft');
  await page.locator('#new-file').click();
  await page.locator('#confirm-save').click();
  await expect(page.locator('#editor-textarea')).toHaveValue('');
  expect(await page.evaluate(() => window.readerTest.writes)).toBe(1);
  expect(await page.evaluate(() => window.readerTest.creates)).toBe(2);
});

test('typing while saving stays dirty and cannot start a second write', async ({ page }) => {
  await page.locator('#new-file').click();
  await page.locator('#editor-textarea').fill('first');
  await page.evaluate(() => { window.readerTest.writeDelay = 700; });
  await page.locator('#save-file').click();
  await page.locator('#editor-textarea').fill('second');
  await expect(page.locator('#save-file')).toBeDisabled();
  await expect(page.locator('#new-file')).toBeDisabled();
  await expect(page.locator('#save-file')).toBeEnabled();
  await expect(page.locator('#file-name')).toHaveText('notes.md •');
  expect(await page.evaluate(() => window.readerTest.content)).toBe('first');
});

test('creation errors are visible and the UI remains usable', async ({ page }) => {
  await page.evaluate(() => { window.readerTest.failCreate = true; });
  await page.locator('#empty-new-file').click();
  await expect(page.getByRole('status')).toContainText('could not be created');
  await expect(page.locator('#empty-new-file')).toBeEnabled();
  await expect(page.locator('#file-name')).toHaveText('No file');
});

test('new-file controls fit a narrow phone in both themes', async ({ page }) => {
  await page.setViewportSize({ width: 280, height: 640 });
  await page.locator('#new-file').click();
  for (const theme of ['light', 'dark']) {
    if (theme === 'dark') await page.locator('#theme-toggle').click();
    const widths = await page.evaluate(() => ({ viewport: innerWidth, content: document.documentElement.scrollWidth }));
    expect(widths.content).toBe(widths.viewport);
    await expect(page.locator('#new-file')).toBeVisible();
    await expect(page.locator('#save-file')).toBeVisible();
  }
});
