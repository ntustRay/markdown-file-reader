# 測試文檔

本文檔說明 MarkView Markdown 閱讀器的測試策略和測試覆蓋範圍。

## 測試框架

- **測試框架**: Vitest v3.2.4
- **測試環境**: Happy-DOM
- **測試工具**: @testing-library/dom

## 測試結構

```
tests/
├── setup.ts              # 測試設置和全域 Mock
├── unit/                 # 單元測試
│   ├── ThemeService.test.ts
│   ├── FileService.test.ts
│   └── MarkdownService.test.ts
├── integration/          # 整合測試（未來擴充）
└── fixtures/             # 測試用的範例檔案
    └── sample.md
```

## 測試覆蓋範圍

### ThemeService (9 tests)
- ✅ 初始化預設為 light 主題
- ✅ 從 localStorage 載入儲存的主題
- ✅ 設定 light/dark 主題
- ✅ 將主題儲存到 localStorage
- ✅ 主題切換功能
- ✅ 事件監聽與回調

### FileService (9 tests)
- ✅ 成功開啟並讀取檔案
- ✅ 處理使用者取消操作
- ✅ 處理檔案讀取錯誤
- ✅ 獲取當前開啟的檔案
- ✅ 從路徑提取檔案名稱（Windows/Unix）
- ✅ 檔案開啟事件監聽

### MarkdownService (12 tests)
- ✅ 渲染標題 (h1-h6)
- ✅ 渲染段落
- ✅ 渲染列表（有序/無序）
- ✅ 渲染程式碼區塊
- ✅ 渲染行內程式碼
- ✅ 渲染連結
- ✅ 渲染引用
- ✅ 渲染表格
- ✅ 支援 GFM 換行
- ✅ 處理粗體和斜體
- ✅ 提取標題功能

## 執行測試

### 運行所有測試
```bash
npm test
```

### 運行測試並查看 UI
```bash
npm run test:ui
```

### 生成測試覆蓋率報告
```bash
npm run test:coverage
```

## 測試結果

```
Test Files  3 passed (3)
Tests       30 passed (30)
Duration    743ms
```

### 測試覆蓋率目標

- 單元測試覆蓋率: > 80% ✅
- 整合測試覆蓋率: > 70% (未來目標)
- 總體覆蓋率: > 75% ✅

## Mock 策略

### Tauri API Mocks
- `@tauri-apps/plugin-dialog`: 檔案選擇對話框
- `@tauri-apps/plugin-fs`: 檔案系統操作

### LocalStorage Mock
實現了功能完整的 localStorage mock，支援：
- `getItem(key)`: 獲取項目
- `setItem(key, value)`: 設置項目
- `removeItem(key)`: 移除項目
- `clear()`: 清空所有項目

## 持續整合

測試可以在 CI/CD 流程中自動運行：

```yaml
# .github/workflows/test.yml 範例
- name: Run tests
  run: npm test -- --run
```

## 未來測試計劃

### 整合測試
- [ ] 端到端檔案開啟流程
- [ ] 主題切換與 UI 更新
- [ ] 編輯模式與預覽模式切換
- [ ] 搜尋功能測試

### E2E 測試
- [ ] 使用 Playwright 或 Tauri WebDriver
- [ ] 完整的使用者流程測試

## 測試最佳實踐

1. **AAA 模式**: Arrange, Act, Assert
2. **隔離性**: 每個測試之間互不影響
3. **可讀性**: 清晰的測試描述
4. **快速**: 單元測試應該快速執行
5. **可靠**: 測試結果應該穩定且可重現

## 貢獻測試

如需添加新測試，請遵循以下步驟：

1. 在適當的目錄下創建測試檔案（`*.test.ts`）
2. 使用 `describe` 和 `it` 組織測試
3. 確保測試覆蓋正常和異常情況
4. 運行測試確保通過
5. 更新此文檔

---

最後更新: 2026-01-18
