# QuillTide Reader

**離線優先的 Markdown 閱讀器與編輯器**

> Local-first Markdown, zero cloud lock-in.

## 功能簡介

- **完整 Markdown 渲染**：支援 GitHub Flavored Markdown (GFM)、程式碼語法高亮
- **分割編輯模式**：左側編輯、右側即時預覽
- **檔案管理**：開啟檔案/資料夾、檔案樹導覽、最近開啟 + 釘選
- **匯出功能**：支援 HTML、Markdown、純文字匯出
- **主題**：明亮模式 / 真黑暗模式（#121212）
- **閱讀客製**：字級、行高、版心寬度
- **安全性**：HTML 內容過濾，防止 XSS
- **本地優先**：無雲端同步、無資料收集、無追蹤

## 技術架構

| 層級 | 技術 |
|------|------|
| 前端 | TypeScript、Vite、CSS3 |
| 後端 | Rust、Tauri 2 |
| Markdown | marked v12、highlight.js v11 |
| 測試 | Vitest v3.2.4、Playwright |

## 快速開始

```bash
# 安裝依賴
npm install

# 開發模式
npm run tauri:dev

# 執行測試
npm test

# 建置桌面版
npm run tauri:build

# 建置 Android 版（需先完成 Android SDK 設定）
npx tauri android build --target aarch64 --release
```

## 專案結構

```
├── src/                        # TypeScript 前端
│   ├── app.ts                  # 主應用程式
│   ├── main.ts                 # 入口點
│   ├── styles.css              # 全域樣式
│   └── services/               # 服務層（7 個模組）
│       ├── FileService.ts
│       ├── ThemeService.ts
│       ├── MarkdownService.ts
│       ├── ErrorService.ts
│       ├── ExportService.ts
│       ├── RecentFilesService.ts
│       └── SettingsService.ts
├── src-tauri/                  # Rust / Tauri 後端
│   ├── src/
│   ├── icons/android/          # Android 各密度 icon
│   └── tauri.conf.json
├── tests/                      # 測試套件（73 個單元測試）
├── docs/                       # 所有文件
└── GOOGLE_PLAY_LAUNCH_CHECKLIST.md
```

## 文件索引

| 文件 | 說明 |
|------|------|
| [`docs/IMPLEMENTATION_SUMMARY.md`](docs/IMPLEMENTATION_SUMMARY.md) | 實作總結、架構說明 |
| [`docs/TESTING.md`](docs/TESTING.md) | 測試策略與覆蓋範圍 |
| [`docs/APP_STORE_GAP_ANALYSIS.md`](docs/APP_STORE_GAP_ANALYSIS.md) | Google Play 缺口分析（C01–C10）|
| [`docs/STORE_LISTING_ASSETS.md`](docs/STORE_LISTING_ASSETS.md) | 商店素材規格與文案 |
| [`docs/PRIVACY_POLICY.md`](docs/PRIVACY_POLICY.md) | 隱私政策 |
| [`docs/GOOGLE_PLAY_DATA_SAFETY_CHECKLIST.md`](docs/GOOGLE_PLAY_DATA_SAFETY_CHECKLIST.md) | Data Safety 填表答案 |
| [`GOOGLE_PLAY_LAUNCH_CHECKLIST.md`](GOOGLE_PLAY_LAUNCH_CHECKLIST.md) | 上架待辦 Checklist |
| [`RELEASE_NOTES.md`](RELEASE_NOTES.md) | 版本更新說明 |

## App 資訊

| 欄位 | 值 |
|------|----|
| 應用程式名稱 | QuillTide Reader |
| Package | com.quilltide.reader |
| 版本 | 0.2.0 |
| 最低 Android 版本 | 7.0（API 24） |
| 類別 | Productivity |

## 授權

開源專案，歡迎使用、修改與分發。
