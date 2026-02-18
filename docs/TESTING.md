# 測試文件 — QuillTide Reader

**最後更新**: 2026-02-05

---

## 測試框架

| 工具 | 版本 | 用途 |
|------|------|------|
| Vitest | v3.2.4 | 單元測試框架 |
| Happy-DOM | v20.3.1 | DOM 模擬環境 |
| @testing-library/dom | v10.4.1 | DOM 輔助工具 |
| Playwright | v1.58.1 | E2E 測試（待補齊） |

---

## 測試結構

```
tests/
├── setup.ts                    # 全域 mock 與測試設置
├── unit/                       # 單元測試
│   ├── ThemeService.test.ts    # 9 tests
│   ├── FileService.test.ts     # 9 tests
│   ├── MarkdownService.test.ts # 30+ tests（含 XSS 案例）
│   ├── ErrorService.test.ts    # 20+ tests
│   └── SearchFeature.test.ts   # 5+ tests
└── fixtures/
    └── sample.md               # 測試用 Markdown 範例
```

---

## 執行測試

```bash
# 執行所有測試
npm test

# 測試 UI 介面（互動式）
npm run test:ui

# 生成覆蓋率報告
npm run test:coverage

# CI 模式（無互動）
npm test -- --run
```

---

## 測試覆蓋範圍

### ThemeService（9 tests）
- 初始化預設為 `light` 主題
- 從 localStorage 載入已儲存主題
- 設定 light / dark 主題
- 寫入 localStorage
- 切換主題（toggle）
- 事件監聽與回調

### FileService（9 tests）
- 成功開啟並讀取檔案
- 使用者取消操作的處理
- 檔案讀取錯誤處理
- 從路徑提取檔案名稱（Windows / Unix 路徑均支援）
- 取得當前開啟的檔案
- 檔案開啟事件監聽

### MarkdownService（30+ tests）
- 標題渲染（H1–H6）
- 段落、有序/無序列表
- 程式碼區塊（行內 + 區塊）
- 連結、引用、表格
- GFM 換行支援
- 粗體、斜體
- 標題提取（TOC 用）
- **XSS 防護（17 個攻擊樣本）**：`<script>`、`onclick`、`javascript:` URL、data URI 等

### ErrorService（20+ tests）
- E1xxx 系列：檔案操作錯誤
- E2xxx 系列：Markdown 渲染錯誤
- E3xxx 系列：系統/未知錯誤
- UI 錯誤訊息顯示（showError）
- Log 輸出格式（不含敏感資料）

### SearchFeature（5+ tests）
- 快速搜尋觸發
- 搜尋結果過濾

---

## Mock 策略

### Tauri API Mocks（tests/setup.ts）
```typescript
// @tauri-apps/plugin-dialog — 模擬檔案選擇對話框
// @tauri-apps/plugin-fs    — 模擬檔案系統操作
```

### localStorage Mock
完整實作 `getItem`、`setItem`、`removeItem`、`clear`，每個測試前重置。

---

## 覆蓋率目標

| 類型 | 目標 | 現況 |
|------|------|------|
| 單元測試 | > 80% | ✅ 達標 |
| 整合測試 | > 70% | 待補 |
| E2E 測試 | — | 待補（Playwright）|

---

## CI/CD 範例

```yaml
# .github/workflows/test.yml
- name: Run unit tests
  run: npm test -- --run

- name: Run coverage
  run: npm run test:coverage
```

---

## 新增測試指南

1. 在 `tests/unit/` 建立 `*.test.ts`
2. 使用 `describe` / `it` 組織測試（AAA 模式：Arrange, Act, Assert）
3. 同時測試正常路徑與異常路徑
4. 執行 `npm test` 確認通過
5. 更新此文件的覆蓋範圍說明

---

## 未來測試計劃

### 整合測試
- [ ] 完整檔案開啟 → 渲染 → 存檔流程
- [ ] 主題切換 + UI 狀態同步
- [ ] 匯出流程（HTML/MD/TXT）

### E2E 測試（Playwright）
- [ ] Android 真機 smoke test
- [ ] 分割編輯模式切換
- [ ] 最近檔案 + 釘選流程
