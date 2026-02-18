# 實作總結報告 — QuillTide Reader

**版本**: v0.2.0
**開發方法**: 測試驅動開發 (TDD)
**最後更新**: 2026-02-05

---

## 專案概述

QuillTide Reader 是一款**本地優先**的 Markdown 閱讀器與編輯器，以 Tauri 2（Rust + TypeScript）建置，支援 Windows、macOS、Linux 及 Android。

核心策略：**離線可靠、無雲端同步、無資料追蹤**。

---

## 架構：服務層設計（7 個模組）

```
src/
├── app.ts                      # 主應用程式類別（協調所有服務）
├── main.ts                     # 入口點
├── styles.css                  # 全域樣式
└── services/
    ├── FileService.ts          # 檔案/資料夾開啟、讀寫、檔案樹
    ├── ThemeService.ts         # 明暗主題切換、localStorage 持久化
    ├── MarkdownService.ts      # Markdown 渲染、XSS sanitize
    ├── ErrorService.ts         # 錯誤碼（E1xxx–E3xxx）、統一錯誤 UI
    ├── ExportService.ts        # 匯出 HTML / Markdown / 純文字
    ├── RecentFilesService.ts   # 最近開啟、釘選功能
    └── SettingsService.ts      # 字級、行高、版心寬度、TOC 設定
```

### 架構原則

- **關注點分離**：每個服務單一職責
- **事件驅動**：服務間透過事件通信，降低耦合
- **類型安全**：全程 TypeScript strict mode
- **可測試性**：所有服務可獨立單元測試

---

## 已完成功能（v0.2.0）

### P0 核心功能

| 功能 | 服務 | 說明 |
|------|------|------|
| Markdown 渲染 + GFM | MarkdownService | 標題、列表、表格、程式碼、引用 |
| 程式碼語法高亮 | MarkdownService | highlight.js v11 |
| XSS 防護 | MarkdownService | sanitizeHtml()，17+ 攻擊測試案例 |
| 檔案/資料夾開啟 | FileService | Tauri dialog + fs plugins |
| 檔案樹導覽 | FileService | 側欄樹狀結構 |
| 明亮 / 真黑暗主題 | ThemeService | localStorage 持久化 |
| 錯誤診斷 | ErrorService | E1xxx（檔案）、E2xxx（渲染）、E3xxx（系統） |
| App 命名基準 | — | QuillTide Reader、com.quilltide.reader |

### P1 留存功能

| 功能 | 服務 | 說明 |
|------|------|------|
| 最近開啟 + 釘選 | RecentFilesService | localStorage 持久化 |
| 匯出 HTML/MD/TXT | ExportService | 含錯誤處理 |
| 字級 / 行高 / 版心 | SettingsService | CSS variables、localStorage |
| TOC 顯示切換 | SettingsService | showToc 設定 |
| 分割編輯模式 | app.ts | 左側編輯 + 右側即時預覽 |
| 行號顯示 | app.ts | 編輯器左側行號同步滾動 |

---

## 測試成果

```
Test Files  5 passed
Tests       73 passed (73)
```

### 各服務測試覆蓋

| 測試檔案 | 測試數 | 重點 |
|----------|--------|------|
| ThemeService.test.ts | 9 | 初始化、切換、localStorage |
| FileService.test.ts | 9 | 開啟、讀取、錯誤處理 |
| MarkdownService.test.ts | 30+ | GFM 渲染 + 17 XSS 攻擊案例 |
| ErrorService.test.ts | 20+ | 錯誤碼、訊息、log 格式 |
| SearchFeature.test.ts | 5+ | 快速搜尋功能 |

---

## 建置輸出

```bash
npm run build

dist/index.html                  3.88 kB │ gzip:  1.31 kB
dist/assets/index-*.css         11.26 kB │ gzip:  2.56 kB
dist/assets/index-*.js          42.83 kB │ gzip: 13.79 kB
✓ built in ~160ms
```

---

## 版本歷程對照

| 版本 | 服務數 | 測試數 | App 名稱 |
|------|--------|--------|----------|
| v0.1.0 | 3 | 30 | MarkView |
| v0.2.0 | 7 | 73 | QuillTide Reader |

---

## 待辦（C09、C10）

| ID | 項目 | 優先度 |
|----|------|--------|
| C09 | 大檔效能優化（開啟速度、記憶體峰值） | P1 |
| C10 | 書籤/註解、跨檔搜尋（本地索引） | P2 |

詳見 [`docs/APP_STORE_GAP_ANALYSIS.md`](APP_STORE_GAP_ANALYSIS.md)。

---

## 技術債

1. `app.security.csp` 目前為 `null`，需在 Android 上架前設定 CSP
2. 搜尋功能 UI 已實作，跨檔搜尋邏輯列入 C10
3. 整合測試、E2E 測試尚待補齊（目前以單元測試為主）
