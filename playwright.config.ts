import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E 測試配置
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // 測試檔案目錄
  testDir: './tests/e2e',

  // 完整平行執行
  fullyParallel: true,

  // CI 環境中禁止 test.only
  forbidOnly: !!process.env.CI,

  // 失敗時重試次數
  retries: process.env.CI ? 2 : 0,

  // 平行 worker 數量
  workers: process.env.CI ? 1 : undefined,

  // 報告格式
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['list']
  ],

  // 全域測試設定
  use: {
    // 基礎 URL（Vite dev server）
    baseURL: 'http://localhost:1420',

    // 失敗時截圖
    screenshot: 'only-on-failure',

    // 錄製追蹤
    trace: 'on-first-retry',

    // 視窗大小
    viewport: { width: 1280, height: 720 },
  },

  // 專案配置（僅使用 Chromium）
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // 啟動開發伺服器
  webServer: {
    command: 'npm.cmd run dev',
    url: 'http://localhost:1420',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
