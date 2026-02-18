# tests/

本目錄包含 QuillTide Reader 的所有測試。

## 目錄結構

```
tests/
├── setup.ts          # 全域 mock（Tauri API、localStorage）
├── unit/             # 單元測試（73 個）
│   ├── ThemeService.test.ts
│   ├── FileService.test.ts
│   ├── MarkdownService.test.ts
│   ├── ErrorService.test.ts
│   └── SearchFeature.test.ts
└── fixtures/
    └── sample.md     # 測試用 Markdown 範例
```

## 執行測試

```bash
npm test              # 所有測試
npm run test:ui       # 互動式 UI
npm run test:coverage # 覆蓋率報告
```

完整測試策略與覆蓋範圍說明見 [`docs/TESTING.md`](../docs/TESTING.md)。
