# QuillTide Reader — 版本更新說明

## v0.2.0（2026-02-05）

### 本版重點

v0.2.0 是功能大幅擴展的版本，完成 Google Play 上架所需的 P0/P1 準備工作（C01–C08），並將 App 正式命名為 **QuillTide Reader**。

### 新功能

**P0 核心（上架必要）**

- App 正式命名為 **QuillTide Reader**（package：`com.quilltide.reader`）
- XSS 防護：Markdown 渲染層加入 HTML sanitize，阻擋惡意腳本（17 個攻擊樣本測試）
- 統一錯誤處理：ErrorService，錯誤碼 E1xxx–E3xxx，可診斷的錯誤訊息
- 隱私政策文件：`docs/PRIVACY_POLICY.md`，本地優先聲明

**P1 留存功能**

- 最近開啟清單 + 釘選：RecentFilesService，重啟後狀態保留
- 匯出功能：ExportService，支援 HTML / Markdown / 純文字 / 剪貼簿複製
- 閱讀客製設定：SettingsService，字級、行高、版心寬度、TOC 開關
- 分割編輯模式：左側編輯器 + 右側即時預覽，行號同步滾動

### 完整功能列表（v0.2.0）

| 功能 | 說明 |
|------|------|
| Markdown 渲染（GFM）| 標題、列表、表格、程式碼、引用、連結 |
| 程式碼語法高亮 | highlight.js v11 |
| XSS 防護 | sanitizeHtml()，17+ 攻擊樣本測試覆蓋 |
| 分割編輯模式 | 左側編輯 + 右側即時預覽，行號同步 |
| 檔案/資料夾開啟 | Tauri 原生對話框，支援 .md / .markdown / .txt |
| 檔案樹導覽 | 側欄樹狀結構 |
| 最近開啟 + 釘選 | 重啟後狀態保留（localStorage）|
| 匯出 | HTML / Markdown / 純文字，剪貼簿支援 |
| 閱讀客製 | 字級、行高、版心寬度、TOC |
| 明亮 / 真黑暗主題 | #121212 背景，localStorage 持久化 |
| 錯誤診斷 | E1xxx–E3xxx 錯誤碼，可理解錯誤訊息 |

### 隱私與安全

- 本地優先設計：無雲端同步、無資料收集、無使用追蹤
- 偏好設定僅儲存於裝置本地 localStorage
- 詳見：[`docs/PRIVACY_POLICY.md`](docs/PRIVACY_POLICY.md)

### 安裝方式

#### Windows

- MSI 安裝程式：`QuillTide Reader_0.2.0_x64_zh-TW.msi`
- NSIS 安裝程式：`QuillTide Reader_0.2.0_x64-setup.exe`

系統需求：Windows 10+ (x64)，WebView2 執行環境

#### Android

Android 版本建置中，即將上架 Google Play。
詳見：[`GOOGLE_PLAY_LAUNCH_CHECKLIST.md`](GOOGLE_PLAY_LAUNCH_CHECKLIST.md)

### 技術細節

- 前端：TypeScript、Vite 6、CSS3
- 後端：Rust、Tauri 2
- Markdown：marked v12.0.0、highlight.js v11.11.1
- 測試：Vitest v3.2.4，73 個單元測試全數通過
- 服務層：7 個模組（FileService、ThemeService、MarkdownService、ErrorService、ExportService、RecentFilesService、SettingsService）

---

## v0.1.0

初始版本。基礎 Markdown 渲染、明暗主題、Tauri 架構建立。

完整變更記錄：https://github.com/ntustRay/markdown-file-reader/compare/v0.1.0...v0.2.0
