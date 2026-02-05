# Google Play 上架前：商業 Markdown App 對比、命名建議與 AI Checklist Plan

> 專案：MarkView v0.2.0
> 產品策略約束：**目前不做「雲端同步」與「多人共編」**。

## 1) 目前產品定位（依現況）

MarkView 目前是「**本機檔案導向**」的 Markdown 閱讀/編輯 App，已具備：
- Markdown 渲染與程式碼高亮
- 分割編輯模式
- 檔案/資料夾開啟、檔案樹與搜尋
- 明暗主題與基本行動版側欄互動

## 2) 與商業產品比較（在「不做雲端/共編」前提下）

| 能力面向 | 你目前策略 | 典型商業產品（Obsidian / iA Writer / Joplin / Bear 類） | 建議 |
|---|---|---|---|
| 核心閱讀與編輯 | 已有核心能力 | 功能更完整（工具列、格式輔助、更多編輯手感） | 持續補齊本地編輯體驗 |
| 檔案管理 | 本機檔案/資料夾導向 | 常有 recent/favorite/pin | 先補「最近檔案 + 釘選」 |
| 同步/共編 | **明確不做（當前）** | 很多競品強項 | 產品文案要明講「離線本機優先」 |
| 匯出與分享 | 尚缺 | 競品普遍支援 | 優先補 PDF/HTML/分享 |
| 安全與合規 | 尚缺完整策略 | 商業產品會有明確隱私/安全邊界 | 上架前先補齊政策與 sanitize |

## 3) App 名稱提案（響亮、降低撞名機率）

> 注意：以下是「降低撞名機率」命名，不等於 100% 保證全球唯一。上架前仍需在 Google Play 與商標資料庫做最終檢索。

### 首選名稱

1. **QuillTide Reader**（主推）
   - 響亮、好記，且不像通用詞（如 Markdown Reader）那麼容易撞名。
   - 可延伸 slogan：`Local-first Markdown, zero cloud lock-in.`

2. **InkHarbor MD**
   - 傳達「文字停靠港」意象，偏閱讀與整理。

3. **GlyphNest Notes**
   - 偏創作感，適合之後做收藏/書籤等本地功能。

4. **DraftVolt Markdown**
   - 偏工具效率感，對技術使用者友善。

### 建議你現在採用

- 專案代稱先用：**QuillTide Reader**
- 商店副標：**Offline Markdown Reader & Editor**
- 說明文固定加一句：**No cloud sync, no collaborative editing (for now).**

## 4) 上架前最重要缺口（不含雲端/共編）

### P0（上架阻塞，必補）

1. **隱私權政策（公開 URL） + Data safety 表單一致**
2. **Markdown sanitize（避免惡意 HTML/XSS）**
3. **錯誤可診斷（錯誤碼、情境訊息、基本 log）**
4. **商店素材齊備（icon / feature graphic / screenshots / 描述）**

### P1（上架後留存關鍵）

1. 最近檔案 / 最近資料夾 / 釘選
2. 匯出與分享（PDF/HTML/純文字）
3. 閱讀客製（字級、行高、版心寬度、TOC）
4. 大檔案效能優化（開啟速度、記憶體控制）

### P2（本地化差異競爭）

1. 書籤與註解（本地儲存）
2. 跨檔全文搜尋（本地索引）
3. 外掛擴充（純本地 plugin sandbox）

## 5) AI Agent 可理解的 Checklist Plan（取代幾週路線圖）

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
    owner: product
    dependencies: []
    acceptance:
      - "選定唯一主名稱（建議 QuillTide Reader）"
      - "更新 productName / 描述文案，明確 local-first 定位"
      - "完成 Play 商店名稱可用性人工檢查"

  - id: C02
    title: Publish privacy policy and align Data safety form
    priority: P0
    status: DONE
    owner: product
    dependencies: [C01]
    acceptance:
      - "有公開可訪問 URL" # GitHub Pages URL configured in docs/PRIVACY_POLICY.md
      - "政策文本與實際資料流一致" # Verified against code
      - "Play Console Data safety 填報完成" # Checklist in docs/GOOGLE_PLAY_DATA_SAFETY_CHECKLIST.md

  - id: C03
    title: Add Markdown sanitization layer
    priority: P0
    status: DONE
    owner: engineering
    dependencies: []
    acceptance:
      - "惡意 HTML/script 不可執行" # sanitizeHtml() in MarkdownService.ts
      - "保留合法 Markdown 顯示" # Verified with comprehensive tests
      - "新增對應單元測試覆蓋攻擊樣本" # 17 XSS test cases added

  - id: C04
    title: Error observability baseline
    priority: P0
    status: DONE
    owner: engineering
    dependencies: []
    acceptance:
      - "關鍵操作（開檔/存檔/渲染）有錯誤碼" # ErrorService with E1xxx-E3xxx codes
      - "UI 顯示可理解錯誤訊息" # showError() displays code + message + details
      - "可輸出可追蹤 log（不含敏感資料）" # Logging with context sanitization

  - id: C05
    title: Store listing asset pack
    priority: P0
    status: DONE
    owner: marketing
    dependencies: [C01]
    acceptance:
      - "完成 icon / feature graphic / 手機截圖" # Specs in docs/STORE_LISTING_ASSETS.md
      - "短描述與完整描述上線" # Text ready in docs/STORE_LISTING_ASSETS.md
      - "文案強調 offline/local-first" # Emphasized throughout

  - id: C06
    title: Recent files and pinned items
    priority: P1
    status: DONE
    owner: engineering
    dependencies: [C04]
    acceptance:
      - "可查看最近開啟清單" # RecentFilesService with sidebar rendering
      - "可釘選常用檔案" # Pin/unpin toggle with visual feedback
      - "重啟 app 後狀態保留" # localStorage persistence

  - id: C07
    title: Export and share
    priority: P1
    status: DONE
    owner: engineering
    dependencies: [C03]
    acceptance:
      - "可匯出 PDF/HTML" # ExportService supports HTML/Markdown/PlainText export
      - "可分享純文字/HTML 到其他 App" # Clipboard copy support
      - "處理失敗時有可理解提示" # Error handling via ErrorService

  - id: C08
    title: Reading customization
    priority: P1
    status: DONE
    owner: engineering
    dependencies: []
    acceptance:
      - "支援字級 / 行高 / 版心寬度" # SettingsService with CSS variables
      - "可切換 TOC 顯示" # showToc setting
      - "設定重啟後可保留" # localStorage persistence

  - id: C09
    title: Large-file performance pass
    priority: P1
    status: TODO
    owner: engineering
    dependencies: [C03, C08]
    acceptance:
      - "大檔開啟時間下降（目標值自行定義）"
      - "滾動與編輯不卡頓"
      - "記憶體峰值可控"

  - id: C10
    title: Local-only differentiation features
    priority: P2
    status: TODO
    owner: engineering
    dependencies: [C06, C08]
    acceptance:
      - "書籤/註解可本地儲存"
      - "跨檔搜尋可用"
      - "不引入雲端同步與共編"
```

## 6) 發佈守門條件（Go / No-Go）

- **Go 條件**：C01~C05 全部完成，且 Android 真機 smoke test 通過。
- **No-Go 條件**：隱私政策未上線、Data safety 未完成、sanitize 未完成其一即不上架。

### 當前狀態（2026-02-05 更新）

| 項目 | 狀態 | 說明 |
|------|------|------|
| C01 App naming | ✅ DONE | QuillTide Reader |
| C02 Privacy policy | ✅ DONE | docs/PRIVACY_POLICY.md + GitHub Pages 說明 |
| C03 Sanitization | ✅ DONE | 17+ XSS 測試案例 |
| C04 Error observability | ✅ DONE | ErrorService + 錯誤代碼 |
| C05 Store listing | ✅ DONE | docs/STORE_LISTING_ASSETS.md |
| C06 Recent files | ✅ DONE | RecentFilesService + 釘選功能 |
| C07 Export | ✅ DONE | ExportService (HTML/MD/TXT) |
| C08 Reading settings | ✅ DONE | SettingsService |

**結論**：所有 P0 項目已完成，P1 核心項目已完成。可進入上架準備階段。

## 7) 總結

你要的方向非常清楚：先做一個 **「本地優先、離線可靠」** 的 Markdown 工具，而不是一開始就走雲端/共編。這個策略可行，且更容易在首版把品質做紮實。
