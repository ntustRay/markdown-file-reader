# Markdown Reader v0.2.0

## 🌏 繁體中文版本

此版本將所有介面文字、文件和說明翻譯為繁體中文。

### 變更內容

- ✨ 所有使用者介面文字轉換為繁體中文
- 📝 README.md 翻譯為繁體中文
- 📄 專案文件全面繁體中文化
- 🔧 程式碼註解更新為繁體中文

### 完整功能列表

所有 v0.1.0 的功能均保持不變：

- **Markdown 渲染**: 完整支援 GitHub Flavored Markdown (GFM)
- **檔案選擇**: 簡易的檔案選擇對話框，支援 `.md`、`.markdown` 和 `.txt` 檔案
- **明暗主題切換**: 流暢的明暗模式切換
  - 持久化主題偏好設定（儲存於 localStorage）
  - 平滑過渡動畫
  - 所有 UI 元素完整的主題覆蓋
- **響應式設計**: 簡潔現代的介面

## 📦 安裝方式

### Windows
下載以下任一安裝程式：
- **MSI 安裝程式**: `Markdown Reader_0.2.0_x64_zh-TW.msi` - 傳統 Windows 安裝程式
- **NSIS 安裝程式**: `Markdown Reader_0.2.0_x64-setup.exe` - 輕量級安裝執行檔

### 系統需求
- Windows 10 或更新版本 (x64)
- WebView2 執行環境（通常已預裝於 Windows 10/11）

## 🚀 使用方式

1. 啟動應用程式
2. 點擊「開啟 Markdown 檔案」按鈕
3. 從系統中選擇一個 Markdown 檔案
4. 使用工具列中的主題切換按鈕（☀️/🌙）來切換明暗模式

## 🛠️ 技術細節

### 構建工具
- **前端**: TypeScript, Vite, CSS3
- **後端**: Rust, Tauri 2.9.5
- **Markdown 解析器**: marked.js v12.0.0
- **Tauri 外掛程式**:
  - dialog（檔案選擇器）
  - fs（檔案系統存取）

## 🙏 致謝

使用 ❤️ 構建：
- [Tauri](https://tauri.app/) - 桌面應用程式框架
- [marked](https://marked.js.org/) - Markdown 解析器
- [Vite](https://vitejs.dev/) - 構建工具

## 📝 授權

這是一個開源專案。歡迎使用、修改和分發。

---

**完整變更記錄**: https://github.com/ntustRay/markdown-file-reader/compare/v0.1.0...v0.2.0
