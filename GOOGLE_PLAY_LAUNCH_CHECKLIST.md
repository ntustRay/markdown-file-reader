# Google Play 上架 Checklist — QuillTide Reader

> 現況快照：2026-02-18
> C01–C08 全部完成。此文件列出**實際上架仍缺少的項目**。

---

## 凡例

| 符號 | 意義 |
|------|------|
| ✅ | 已完成 |
| ❌ | 尚未完成（阻塞上架） |
| ⚠️ | 已記錄/設計，但尚未實際執行 |
| 🔵 | 建議但非必要 |

---

## A｜Android 技術建置

### A1 — 開發環境

- [ ] ❌ 安裝 **Android Studio** 或獨立 Android SDK（Build Tools ≥ 34）
- [ ] ❌ 安裝 **Android NDK**（Tauri 2 Android 需要 r27 或更新版本）
- [ ] ❌ 設定環境變數：`ANDROID_HOME`、`NDK_HOME`
- [ ] ❌ 安裝 Rust Android targets：
  ```bash
  rustup target add aarch64-linux-android armv7-linux-androideabi x86_64-linux-android i686-linux-android
  ```
- [ ] ❌ 安裝 `cargo-ndk`：`cargo install cargo-ndk`

### A2 — Tauri Android 初始化

- [ ] ❌ 執行 `npx tauri android init` 生成 `src-tauri/gen/android/` 專案
- [ ] ❌ 確認 `AndroidManifest.xml` 內 `uses-permission` 宣告正確（僅需 file 相關權限，不需網路）
- [ ] ❌ 在 `tauri.conf.json` 的 `bundle.android` 補上 `targetSdkVersion`（建議 34 或 35）：
  ```json
  "android": {
    "minSdkVersion": 24,
    "targetSdkVersion": 35
  }
  ```
- [ ] ⚠️ 設定 `app.security.csp`（目前為 `null`，上架前應填入適當 CSP 值）

### A3 — 簽名金鑰（Keystore）

- [ ] ❌ 生成 Release Keystore（**只做一次，妥善備份，遺失後無法更新 App**）：
  ```bash
  keytool -genkeypair -v -keystore quilltide-release.keystore \
    -alias quilltide -keyalg RSA -keysize 2048 -validity 10000
  ```
- [ ] ❌ 將 keystore 路徑與密碼設定到 Tauri Android 簽名設定（`src-tauri/gen/android/` 對應設定檔）
- [ ] ❌ 確認 `.gitignore` 已排除 `*.keystore` 與密碼相關檔案
- [ ] 🔵 考慮使用 Google Play App Signing（建議：讓 Google 管理最終金鑰，自己持 upload key）

### A4 — Release 建置

- [ ] ❌ 執行 Release AAB 建置：
  ```bash
  npx tauri android build --target aarch64 --release
  ```
- [ ] ❌ 確認產出物為 `.aab`（Android App Bundle），非 `.apk`（Play Store 要求 AAB）
- [ ] ❌ 確認 APK/AAB 大小合理（建議 < 150 MB；超過需使用 Play Asset Delivery）

### A5 — 真機/模擬器測試

- [ ] ❌ 在 Android 7.0（API 24）實機或模擬器執行 smoke test（最低支援版本）
- [ ] ❌ 在 Android 14/15 最新版本測試
- [ ] ❌ 驗證檔案開啟/存檔/匯出在 Android 上正常運作（Android 的 Storage Access Framework 行為與桌面不同）
- [ ] ❌ 驗證 UI 在手機螢幕（尤其 Portrait 模式）正常顯示
- [ ] 🔵 在平板（7"、10"）驗證 Layout

---

## B｜Google Play Console 帳號與 App 設定

- [ ] ❌ 申請 **Google Play 開發者帳號**（一次性費用 USD $25）：https://play.google.com/console
- [ ] ❌ 在 Play Console「建立應用程式」，填入：
  - App 名稱：`QuillTide Reader`
  - 預設語言：`zh-TW`（或 `en-US`，視主要市場而定）
  - 應用程式或遊戲：`應用程式`
  - 免費或付費：`免費`
- [ ] ❌ 設定 **內部測試軌道（Internal Testing）**，先用內部測試驗證 AAB 正常安裝
- [ ] ❌ 上傳 AAB 至內部測試軌道，確認無安裝錯誤

---

## C｜素材準備（Assets）

> 文字內容已記錄於 `docs/STORE_LISTING_ASSETS.md`，但圖片素材尚未實際產出。

### C1 — 必要圖片

- [ ] ⚠️ **App Icon**：512 × 512 px PNG（Play Store 用，非 mipmap 的那一張）
  - 格式：32-bit PNG with alpha
  - 邊緣不可透明
  - 路徑建議：`assets/store/icon-512.png`
- [ ] ❌ **Feature Graphic**：1024 × 500 px PNG 或 JPEG
  - 上傳後顯示於 Play 商店頁頭部
  - 路徑建議：`assets/store/feature-graphic.png`
  - 文件中標記為「to be created」
- [ ] ❌ **手機截圖**：至少 2 張，最多 8 張
  - 尺寸：1080 × 1920 px（9:16）或 1080 × 2400 px
  - 建議內容：
    1. 開啟 Markdown 檔案的閱讀畫面
    2. 分割編輯模式（Edit + Preview）
    3. Dark Mode 畫面
    4. 側欄檔案樹
- [ ] 🔵 **平板截圖**（7" 1200 × 1920，10" 1920 × 1200）

### C2 — 聯絡資訊（目前是佔位符）

`docs/STORE_LISTING_ASSETS.md` 中有兩個欄位尚未填真實值：

- [ ] ❌ 填入真實 **Developer Name**（開發者名稱或組織名）
- [ ] ❌ 填入真實 **Support Email**（需能收信的信箱，Play Console 審核可能寄信）

---

## D｜合規填寫（Play Console 操作）

### D1 — 隱私政策 URL

- [ ] ⚠️ 啟用 **GitHub Pages**（`docs/PRIVACY_POLICY.md` 中已說明步驟但尚未執行）：
  - repo Settings → Pages → Branch: `master` → Folder: `/docs`
  - 預期 URL：`https://ntustray.github.io/markdown-file-reader/PRIVACY_POLICY`
- [ ] ❌ 驗證上述 URL 可經由 HTTPS 公開訪問（用瀏覽器確認，非 404）
- [ ] ❌ 在 Play Console「App content」→「Privacy policy」貼上已驗證的 URL

### D2 — Data Safety 表單（Play Console）

`docs/GOOGLE_PLAY_DATA_SAFETY_CHECKLIST.md` 中尚有一項未勾選：

- [ ] ⚠️ 登入 Play Console，前往「App content」→「Data safety」，依照 `docs/GOOGLE_PLAY_DATA_SAFETY_CHECKLIST.md` 填寫：
  - 是否收集資料：否（Local only）
  - 是否分享資料：否
  - 安全實踐：傳輸加密（N/A，本地 App）、資料刪除請求（使用者控制本地資料）

### D3 — 內容分級問卷

- [ ] ❌ Play Console「App content」→「Content rating」→ 完成 IARC 問卷
  - 預期結果：Everyone（E）— 無暴力、無性內容、無使用者互動
  - 依 `docs/STORE_LISTING_ASSETS.md` 的答案填寫

### D4 — 目標受眾

- [ ] ❌ Play Console「App content」→「Target audience」→ 選擇「18 歲以上」
  - 原因：非兒童 App，`docs/PRIVACY_POLICY.md` 已聲明不針對 13 歲以下兒童

### D5 — 新聞 App 聲明（如適用）

- [ ] ❌ Play Console 確認是否需要填寫「News apps」聲明（此 App 不是新聞 App，勾「否」即可）

---

## E｜商店頁面填寫（Play Console）

> 文案已備妥於 `docs/STORE_LISTING_ASSETS.md`，需在 Play Console 頁面實際輸入。

- [ ] ❌ 填入 **短描述**（80 字元以內）
- [ ] ❌ 填入 **完整描述**（4000 字元以內）
- [ ] ❌ 填入 **版本更新說明**（What's new），v0.2.0 文案已在 `RELEASE_NOTES.md`
- [ ] ❌ 選擇 **應用程式類別**：`Productivity`（生產力）
- [ ] ❌ 上傳 App Icon（512 × 512）
- [ ] ❌ 上傳 Feature Graphic（1024 × 500）
- [ ] ❌ 上傳至少 2 張手機截圖
- [ ] ❌ 填入聯絡資訊（Email、Website）

---

## F｜發佈前最終確認

- [ ] ❌ 在 Play Console 「Release」頁確認無阻塞性警告（紅色 ✗）
- [ ] ❌ 所有「App content」子區段均顯示綠色勾號
- [ ] ❌ 內部測試版本安裝無誤、功能正常
- [ ] ❌ 送出正式 Production 版本審查（Google 通常 1–7 個工作天）

---

## 待辦後續（上架後 P1/P2）

| 項目 | 優先度 | 對應 Checklist |
|------|--------|----------------|
| C09：大檔效能優化 | P1 | `APP_STORE_GAP_ANALYSIS.md` |
| C10：書籤、跨檔搜尋等本地差異功能 | P2 | `APP_STORE_GAP_ANALYSIS.md` |
| 多語言商店頁面（英文） | P1 | 新增 |
| Crash 回報機制（本地 log export） | P1 | 新增 |

---

## 參考文件

| 文件 | 說明 |
|------|------|
| [`docs/APP_STORE_GAP_ANALYSIS.md`](docs/APP_STORE_GAP_ANALYSIS.md) | 整體缺口分析與 C01–C10 計劃 |
| `docs/PRIVACY_POLICY.md` | 隱私政策全文 + GitHub Pages 啟用步驟 |
| `docs/GOOGLE_PLAY_DATA_SAFETY_CHECKLIST.md` | Data Safety 表單答案對應 |
| `docs/STORE_LISTING_ASSETS.md` | 圖片規格、文案、聯絡資訊 |
| `RELEASE_NOTES.md` | v0.2.0 更新說明 |
| `src-tauri/tauri.conf.json` | App 版本、identifier、Android SDK 設定 |
