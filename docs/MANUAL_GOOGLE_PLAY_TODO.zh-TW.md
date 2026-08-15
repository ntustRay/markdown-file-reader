# Ray Markdown Reader：剩餘人工待辦

最後更新：2026-08-15

這份清單只保留需要你本人、實體手機、簽章資料或 Google Play Console 帳號才能完成的工作。程式功能、測試、app 身分、權限、圖示母檔、英中商店文案、隱私政策與 Data Safety 草稿都已完成並推送。

## 一、準備 Android 開發環境

- [ ] 安裝 Android Studio。
- [ ] 在 Android Studio 的 SDK Manager 安裝：
  - Android SDK Platform 36
  - Android SDK Platform-Tools
  - Android SDK Build-Tools
  - Android SDK Command-line Tools
  - Android NDK
- [ ] 設定 `JAVA_HOME`、`ANDROID_HOME`、`NDK_HOME`。
- [ ] 重新開啟終端機。
- [ ] 告訴 Codex：「Android 工具鏈已安裝，請繼續。」

到這裡先交回給 Codex。Codex 可以接著處理 Android 初始化、API 36 設定、manifest 稽核、建置命令與其他不涉及密碼的工作。

## 二、準備實體 Android 手機

- [ ] 準備主要驗收手機：Android 16。
- [ ] 開啟開發人員選項與 USB 偵錯。
- [ ] 使用 USB 連接電腦並在手機上允許這台電腦進行偵錯。
- [ ] 準備下列測試檔案：
  - 可寫入的 `.md`
  - 可寫入的 `.markdown`
  - 可寫入的 `.txt`
  - UTF-8 BOM 檔案
  - CRLF 換行檔案
  - 無效 UTF-8 檔案
  - 超過 10 MB 的檔案
  - 唯讀來源提供者中的檔案
- [ ] 告訴 Codex：「手機已連接，可以開始真機驗收。」

測試時，你需要在手機上實際點擊系統檔案選擇器、允許 USB 偵錯、操作 Back、軟鍵盤、外部瀏覽器與 TalkBack。Codex 可以提供逐項指示並記錄結果。

## 三、建立並保管上傳金鑰

- [ ] 建立專用的 Google Play upload keystore，放在 repository 以外的位置。
- [ ] 設定一組不重複的 keystore 密碼與 key 密碼。
- [ ] 將 keystore 與密碼分別備份到兩個安全位置。
- [ ] 啟用 Google Play App Signing。
- [ ] 確認 upload key 與 Google 管理的 app signing key 是不同用途的金鑰。

不要把 keystore、密碼、token、復原碼或登入連結貼到聊天室、commit、文件或 shell 指令紀錄。需要設定簽章時，只告訴 Codex「本機簽章資料已設定完成」，不要提供秘密內容。

## 四、建立 Google Play Console app

- [ ] 使用個人開發者帳號登入 Google Play Console。
- [ ] 完成 Google 要求的個人身分驗證。
- [ ] 使用 Play Console 手機 app 完成 Android 裝置驗證（如果帳號顯示此要求）。
- [ ] 建立 app：
  - App 名稱：`Ray Markdown Reader`
  - Package ID：`com.ntustray.raymarkdownreader`
  - 預設語言：English
  - 類型：App
  - 價格：Free
- [ ] 在 Play Console 再搜尋一次同名與近似名稱，確認沒有名稱衝突。

Package ID 建立後不能隨意更換。建立前請逐字確認為 `com.ntustray.raymarkdownreader`。

## 五、公開隱私政策

- [ ] 將 `docs/PRIVACY_POLICY.md` 原文發布到穩定、公開、免登入的 HTTPS 網頁。
- [ ] 使用無痕視窗確認網址可以直接開啟，而且不是 404 或下載頁。
- [ ] 將公開網址填入 Play Console 的 Privacy policy 欄位。

Repository 中的 Markdown 檔只是政策來源，不代表公開網址已經部署完成。

## 六、準備商店圖片

- [x] 512 × 512 Play icon 已完成：`assets/store/play-icon-512.png`
- [ ] 建立 1024 × 500 feature graphic。
- [ ] 從實際 release／Play 測試版本截取至少兩張手機截圖。
- [ ] 建議至少準備：
  - Markdown 預覽畫面
  - 全畫面編輯、檔名與儲存按鈕
  - 深色主題畫面
- [ ] 確認圖片沒有出現未支援的側欄、資料夾、搜尋、分割預覽、匯出、inline image 或雲端功能。

等真機 UI 驗收完成後，可以再叫 Codex 協助整理 feature graphic 與截圖規格。

## 七、填寫 Play Console 內容

- [ ] 使用 `docs/STORE_LISTING_ASSETS.md` 填入英文預設商店文案。
- [ ] 新增繁體中文商店頁並填入繁中文案。
- [ ] 類別選擇 Productivity。
- [ ] Support email 填入 `ntustray.opensource@gmail.com`。
- [ ] Ads declaration：No ads。
- [ ] App access：不需要登入，所有功能皆可使用。
- [ ] Target audience：18 歲以上，非兒童 app。
- [ ] Data safety：依 `docs/GOOGLE_PLAY_DATA_SAFETY_CHECKLIST.md` 填寫。
- [ ] 完成 IARC content rating 問卷；依實際功能回答，不預先假設分級結果。
- [ ] 完成 Play Console 顯示的其他 App content 與區域聲明。
- [ ] 發行地區選擇所有可用國家與地區。

## 八、上傳並驗證 AAB

- [ ] 在 Codex 完成 Android 建置設定後，使用本機 upload key 產生 signed release AAB。
- [ ] 第一次 AAB 由你本人上傳到 Play Console。
- [ ] 先建立 Internal testing release。
- [ ] 從 Google Play 安裝 Play 實際派送的版本，不只測試本機 APK。
- [ ] 在 Android 16 手機重新執行完整 smoke test。
- [ ] 查看 pre-launch report，處理 crash、ANR、相容性與無障礙問題。

如果 Play Console 顯示 package、target API、簽章或 permission 錯誤，請把錯誤文字或截圖交給 Codex；不要提供任何密碼或金鑰。

## 九、完成 14 天 Closed testing

- [ ] 招募 15–20 位測試者，避免中途退出後低於門檻。
- [ ] 建立 Closed testing track。
- [ ] 上傳通過 Internal testing 的 AAB。
- [ ] 將 opt-in 連結傳給測試者。
- [ ] 確認至少 12 位測試者成功 opt in。
- [ ] 維持至少 12 位測試者連續 14 天。
- [ ] 記錄開始日期、預計結束日期與每天的有效測試者人數。
- [ ] 收集實際回饋與修正必要問題。

不要只加入 email 名單；測試者必須透過 opt-in 流程實際加入測試。

## 十、申請 Production

- [ ] 14 天資格完成後，在 Play Console 申請 production access。
- [ ] 如實回答 Google 對測試流程、測試者參與和回饋的問題。
- [ ] 建立 Production release。
- [ ] 再確認版本、AAB、商店文案、隱私網址、Data Safety、內容分級與發行地區。
- [ ] 送出審查。
- [ ] 上架後從公開 Google Play 頁面安裝一次並完成最終 smoke test。

## 下次回來時從哪裡開始

最先做「第一、準備 Android 開發環境」。完成後直接對 Codex 說：

> Android Studio、SDK 36、NDK 和環境變數都設定好了，請從 Android init 繼續做到需要我操作手機或 Play Console 的地方。

技術細節與指令另見 `docs/GOOGLE_PLAY_RELEASE_HANDOFF.md`。
