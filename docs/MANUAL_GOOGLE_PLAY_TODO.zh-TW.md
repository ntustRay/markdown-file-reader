# Ray Markdown Reader：人工待辦

## 1. 建立 Play Console app

完成：
- [x] App 已建立，帳號沒有待完成的身分或裝置驗證。

步驟：
1. 登入 Play Console，完成要求的驗證。
2. 建立 `Ray Markdown Reader`：`com.ntustray.raymarkdownreader`、English、App、Free。

## 2. 連接測試手機

完成：
- [x] Codex 可辨識 Android 16 手機，開啟、編輯、儲存皆通過。

步驟：
1. 無需操作，已完成。

## 3. 保管簽章資料

完成：
- [x] upload keystore 已建立本機備份，Google Play App Signing 已啟用。
- [ ] keystore 與密碼仍需分開備份到另一個裝置或雲端。

步驟：
1. 在 repository 外建立 upload keystore。
2. 將 keystore 與密碼分開備份到兩個安全位置。

## 4. 填寫商店資料

完成：
- [x] 隱私權政策已公開，網址免登入可開啟。
- [ ] Play Console 的商店資訊與政策欄位都沒有未完成項目。

步驟：
1. 公開隱私政策，確認網址免登入可開啟。
2. 依 `STORE_LISTING_ASSETS.md` 與 `GOOGLE_PLAY_DATA_SAFETY_CHECKLIST.md` 填寫資料。
3. 完成內容分級、目標族群、發行地區及其他必要聲明。

## 5. 上傳並測試 AAB

完成：
- [x] Signed AAB 已上傳，Play 派送版本已通過 smoke test。
- [ ] pre-launch report 沒有阻擋問題。

步驟：
1. 請 Codex 產生並檢查 signed AAB，再親自上傳到 Internal testing。
2. 從 Play 安裝、測試，將問題交給 Codex 修正。

## 6. 完成 Closed testing

完成：
- [ ] 已符合 Play Console 顯示的測試人數、天數與回饋要求。

步驟：
1. 建立 Closed testing，邀請測試者加入。
2. 維持資格並記錄日期、人數與回饋。

## 7. 正式上架

完成：
- [ ] Production 已核准，公開商店版本通過最後 smoke test。

步驟：
1. 申請 Production access，建立 release 並送審。
2. 上架後從公開商店安裝並測試。

不要向 Codex 提供 keystore、密碼、token 或復原碼。
