# Google Play 上架前：缺口分析與 Checklist Plan — QuillTide Reader

> 最後更新：2026-02-05
> 產品策略約束：**目前不做「雲端同步」與「多人共編」**。

---

## 1) 產品定位

QuillTide Reader 是**本機檔案導向**的 Markdown 閱讀/編輯 App：

- Markdown 渲染與程式碼高亮
- 分割編輯模式
- 檔案/資料夾開啟、檔案樹與搜尋
- 最近開啟 + 釘選、匯出、閱讀客製
- 明暗主題
- 無雲端同步、無資料收集

---

## 2) 與商業產品比較

| 能力面向 | QuillTide Reader | 典型競品（Obsidian / iA Writer / Bear）| 策略 |
|---|---|---|---|
| 核心閱讀與編輯 | 已完成 | 功能更完整 | 持續補齊本地編輯體驗 |
| 檔案管理 | 最近檔案 + 釘選 ✅ | 常見功能 | 已達基本水準 |
| 同步/共編 | **明確不做** | 競品強項 | 產品文案強調離線優先 |
| 匯出與分享 | HTML/MD/TXT ✅ | 普遍支援 | 待補 PDF |
| 安全與合規 | XSS sanitize ✅ | 有明確邊界 | 已達上架標準 |

---

## 3) App 名稱

**已確定使用**：**QuillTide Reader**
- Slogan：`Local-first Markdown, zero cloud lock-in.`
- Package：`com.quilltide.reader`
- 商店副標：`Offline Markdown Reader & Editor`

---

## 4) Checklist Plan（C01–C10）

```yaml
plan_name: google-play-launch-local-first
constraints:
  - no_cloud_sync: true
  - no_collaborative_editing: true

items:
  - id: C01
    title: Finalize app name and package naming baseline
    priority: P0
    status: DONE
    acceptance:
      - "選定唯一主名稱：QuillTide Reader"
      - "更新 productName / identifier / 描述文案"
      - "明確 local-first 定位"

  - id: C02
    title: Publish privacy policy and align Data safety form
    priority: P0
    status: DONE
    acceptance:
      - "有公開可訪問 URL（GitHub Pages 待啟用）"
      - "政策文本與實際資料流一致"
      - "Play Console Data safety 填報完成（待手動操作）"

  - id: C03
    title: Add Markdown sanitization layer
    priority: P0
    status: DONE
    acceptance:
      - "惡意 HTML/script 不可執行"
      - "保留合法 Markdown 顯示"
      - "17+ XSS 單元測試覆蓋攻擊樣本"

  - id: C04
    title: Error observability baseline
    priority: P0
    status: DONE
    acceptance:
      - "關鍵操作有錯誤碼（E1xxx–E3xxx）"
      - "UI 顯示可理解錯誤訊息"
      - "log 輸出不含敏感資料"

  - id: C05
    title: Store listing asset pack
    priority: P0
    status: DONE
    acceptance:
      - "素材規格與文案記錄於 docs/STORE_LISTING_ASSETS.md"
      - "文案強調 offline/local-first"
      - "圖片素材待實際產出（icon 512px、feature graphic）"

  - id: C06
    title: Recent files and pinned items
    priority: P1
    status: DONE
    acceptance:
      - "可查看最近開啟清單"
      - "可釘選常用檔案"
      - "重啟 App 後狀態保留（localStorage）"

  - id: C07
    title: Export and share
    priority: P1
    status: DONE
    acceptance:
      - "可匯出 HTML / Markdown / 純文字"
      - "剪貼簿複製支援"
      - "匯出失敗時有可理解提示"

  - id: C08
    title: Reading customization
    priority: P1
    status: DONE
    acceptance:
      - "支援字級 / 行高 / 版心寬度（CSS variables）"
      - "可切換 TOC 顯示"
      - "設定重啟後可保留（localStorage）"

  - id: C09
    title: Large-file performance pass
    priority: P1
    status: TODO
    acceptance:
      - "大檔開啟時間下降（目標值自行定義）"
      - "滾動與編輯不卡頓"
      - "記憶體峰值可控"

  - id: C10
    title: Local-only differentiation features
    priority: P2
    status: TODO
    acceptance:
      - "書籤/註解可本地儲存"
      - "跨檔搜尋可用（本地索引）"
      - "不引入雲端同步與共編"
```

---

## 5) 當前狀態（2026-02-05）

| 項目 | 狀態 | 說明 |
|------|------|------|
| C01 App naming | ✅ DONE | QuillTide Reader |
| C02 Privacy policy | ✅ DONE | docs/PRIVACY_POLICY.md（GitHub Pages 待啟用）|
| C03 Sanitization | ✅ DONE | 17+ XSS 測試案例 |
| C04 Error observability | ✅ DONE | ErrorService + E1xxx–E3xxx |
| C05 Store listing | ✅ DONE | docs/STORE_LISTING_ASSETS.md |
| C06 Recent files | ✅ DONE | RecentFilesService + 釘選 |
| C07 Export | ✅ DONE | ExportService (HTML/MD/TXT) |
| C08 Reading settings | ✅ DONE | SettingsService |
| C09 大檔效能 | ⏳ TODO | P1 |
| C10 本地差異功能 | ⏳ TODO | P2 |

**結論**：所有 P0 已完成，P1 核心已完成。可進入技術建置與上架操作階段。

---

## 6) 發佈守門條件（Go / No-Go）

- **Go 條件**：C01–C05 全部完成，且 Android 真機 smoke test 通過
- **No-Go 條件**：隱私政策 URL 未上線、Data safety 未填、sanitize 未完成其一即不上架

詳細上架步驟與阻塞項目清單見 [`../GOOGLE_PLAY_LAUNCH_CHECKLIST.md`](../GOOGLE_PLAY_LAUNCH_CHECKLIST.md)。
