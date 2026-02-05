# QuillTide Reader - Markdown 閱讀器

一個使用 Tauri 構建、以本地優先（local-first）為核心的跨平台 Markdown 閱讀器與編輯器。

![Version](https://img.shields.io/badge/version-0.2.0-blue)
![Test](https://img.shields.io/badge/tests-30%20passed-green)
![License](https://img.shields.io/badge/license-MIT-blue)

## ✨ 功能特性

> No cloud sync, no collaborative editing (for now).

### 核心功能
- 📖 **Markdown 閱讀器**: 優雅的閱讀介面，支援 GitHub Flavored Markdown (GFM)
- ✏️ **分割編輯模式**: 左側編輯，右側即時預覽
- 🌓 **主題切換**: 明亮模式與深色模式 (#121212 真正的暗黑模式)
- 📁 **檔案管理**: 側邊欄檔案列表，快速切換文件
- 🔍 **快速搜尋**: 即時搜尋功能 (⌘K)
- 🎨 **現代化 UI**: 基於 Material Design，使用 Inter 和 JetBrains Mono 字體

### 技術特色
- ⚡ **高性能**: 使用 Rust 後端，快速且輕量
- 🧪 **測試驅動**: 30 個單元測試，確保程式碼品質
- 🏗️ **模組化架構**: 清晰的服務層與組件分離
- 📱 **響應式設計**: 適配各種螢幕尺寸
- 🔒 **類型安全**: 完整的 TypeScript 支援

## 🚀 快速開始

### 環境要求

- Node.js (>= 18)
- Rust (>= 1.70)
- npm 或其他套件管理器

### 安裝步驟

1. **克隆專案**
   ```bash
   git clone <repository-url>
   cd markdown-file-reader
   ```

2. **安裝相依套件**
   ```bash
   npm install
   ```

3. **開發模式運行**
   ```bash
   npm run tauri:dev
   ```

4. **構建生產版本**
   ```bash
   npm run tauri:build
   ```

## 📖 使用說明

### 基本操作

1. **開啟檔案**: 點擊左下方的「開啟檔案」按鈕
2. **閱讀模式**: 預覽渲染後的 Markdown 內容
3. **編輯模式**: 點擊「編輯」按鈕進入分割編輯模式
4. **主題切換**: 點擊右上角的主題按鈕切換明暗模式

### 鍵盤快捷鍵

- `⌘K` / `Ctrl+K`: 快速搜尋 (規劃中)
- `⌘E` / `Ctrl+E`: 切換編輯模式 (規劃中)
- `⌘D` / `Ctrl+D`: 切換主題 (規劃中)

## 🏗️ 專案結構

```
markdown-file-reader/
├── src/                      # 前端原始碼
│   ├── main.ts              # 應用程式入口
│   ├── app.ts               # 主應用程式類別
│   ├── services/            # 服務層
│   │   ├── FileService.ts   # 檔案管理服務
│   │   ├── ThemeService.ts  # 主題管理服務
│   │   └── MarkdownService.ts # Markdown 渲染服務
│   ├── components/          # UI 組件 (未來擴充)
│   ├── models/              # 資料模型 (未來擴充)
│   └── styles.css           # 全域樣式
├── tests/                   # 測試目錄
│   ├── setup.ts            # 測試設置
│   ├── unit/               # 單元測試
│   │   ├── FileService.test.ts
│   │   ├── ThemeService.test.ts
│   │   └── MarkdownService.test.ts
│   ├── integration/        # 整合測試 (未來擴充)
│   └── fixtures/           # 測試用範例檔案
├── src-tauri/              # Tauri 後端 (Rust)
│   ├── src/
│   │   ├── main.rs
│   │   └── lib.rs
│   ├── Cargo.toml
│   └── tauri.conf.json
├── spec/                   # 設計規格
│   ├── markdown_reader_light_mode/
│   ├── markdown_reader_true_dark_mode/
│   └── markdown_editor_split_mode/
├── index.html
├── package.json
├── vitest.config.ts
└── vite.config.ts
```


## 🔒 隱私與資料安全

- 隱私政策（草案）: [`docs/PRIVACY_POLICY.md`](./docs/PRIVACY_POLICY.md)
- Google Play Data Safety 對齊清單: [`docs/GOOGLE_PLAY_DATA_SAFETY_CHECKLIST.md`](./docs/GOOGLE_PLAY_DATA_SAFETY_CHECKLIST.md)

> 上架前請將隱私政策發佈到公開 HTTPS URL，並填寫 Play Console Data safety 表單。

## 🧪 測試

本專案採用測試驅動開發 (TDD) 方法，確保程式碼品質。

### 執行測試

```bash
# 運行所有測試
npm test

# 運行測試並查看 UI
npm run test:ui

# 生成測試覆蓋率報告
npm run test:coverage
```

### 測試結果

- ✅ 30 個測試全部通過
- ✅ 3 個測試檔案
- ✅ 覆蓋 FileService, ThemeService, MarkdownService

詳細測試文檔請參閱 [TESTING.md](./TESTING.md)

## 🎨 設計規格

本專案基於三個設計規格實現：

1. **Light Mode**: 明亮閱讀模式，柔和的色彩與陰影
2. **True Dark Mode**: 真正的深色模式 (#121212 背景)
3. **Split Editor Mode**: 分割編輯模式，左側編輯器，右側即時預覽

設計規格位於 `spec/` 目錄。

## 🛠️ 技術棧

### 前端
- **框架**: TypeScript + Vite
- **Markdown**: marked.js (GFM 支援)
- **字體**: Inter (UI), JetBrains Mono (程式碼)
- **圖標**: Material Symbols

### 後端
- **框架**: Rust + Tauri 2.x
- **外掛程式**:
  - `tauri-plugin-dialog`: 檔案選擇對話框
  - `tauri-plugin-fs`: 檔案系統操作

### 開發工具
- **測試**: Vitest + Happy-DOM
- **類型檢查**: TypeScript 5.6+
- **建置**: Vite 6.0

## 📝 開發計劃

### 已完成 ✅
- [x] 基礎 Markdown 閱讀功能
- [x] 主題切換 (Light/Dark)
- [x] 分割編輯模式
- [x] 測試框架設置
- [x] 服務層架構
- [x] 現代化 UI 設計

### 進行中 🚧
- [ ] 檔案樹側邊欄
- [ ] 快速搜尋功能
- [ ] 鍵盤快捷鍵

### 未來功能 📋
- [ ] 程式碼語法高亮
- [ ] 匯出為 PDF/HTML
- [ ] 書籤功能
- [ ] 最近開啟檔案歷史
- [ ] 自訂主題顏色
- [ ] 插件系統

## 🤝 貢獻

歡迎貢獻！請遵循以下步驟：

1. Fork 此專案
2. 創建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟 Pull Request

### 開發指南

- 遵循 TDD 原則，先寫測試
- 確保所有測試通過
- 保持程式碼整潔與可讀性
- 更新相關文檔

## 📄 授權

MIT License

## 📮 聯絡方式

如有問題或建議，請開啟 Issue。

---

**製作**: QuillTide Team
**版本**: v0.2.0
**最後更新**: 2026-01-18
