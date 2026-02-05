# Google Play Store Listing Assets — QuillTide Reader

Last updated: 2026-02-05

## App Identity

- **App Name**: QuillTide Reader
- **Package Name**: com.quilltide.reader
- **Category**: Productivity
- **Content Rating**: Everyone

## Required Graphics

### App Icon
- **Format**: PNG (32-bit with alpha)
- **Size**: 512 x 512 px
- **Location**: `app-icon.png` (already exists)
- **Requirements**:
  - No transparency on edges
  - Consistent with in-app icon

### Feature Graphic
- **Format**: PNG or JPEG
- **Size**: 1024 x 500 px
- **Location**: `assets/feature-graphic.png` (to be created)
- **Design Guidelines**:
  - Clean, minimal design
  - Show app name and tagline
  - Suggested tagline: "Local-first Markdown, zero cloud lock-in"

### Screenshots (Required: 2-8)
- **Format**: PNG or JPEG
- **Sizes**:
  - Phone: 1080 x 1920 px (9:16) or 1080 x 2400 px
  - Tablet 7": 1200 x 1920 px (optional)
  - Tablet 10": 1920 x 1200 px (optional)
- **Location**: `assets/screenshots/`
- **Suggested Screenshots**:
  1. Welcome screen with sidebar
  2. Markdown file opened with syntax highlighting
  3. Edit mode (split view)
  4. Dark mode view
  5. File tree navigation
  6. Search functionality

## Store Listing Text

### Short Description (80 characters max)
```
離線優先的 Markdown 閱讀器，無雲端、無追蹤，完全掌控您的文件。
```

**English Alternative:**
```
Offline-first Markdown reader. No cloud, no tracking. Your files, your control.
```

### Full Description (4000 characters max)

```
QuillTide Reader 是一款專為重視隱私的使用者打造的 Markdown 閱讀與編輯工具。

【本地優先設計】
• 所有檔案僅在您的裝置上處理
• 無雲端同步、無資料上傳
• 無使用行為追蹤或分析
• 完全離線可用

【核心功能】
• 完整支援 GitHub Flavored Markdown (GFM)
• 程式碼語法高亮
• 即時預覽的分割編輯模式
• 資料夾瀏覽與檔案樹導覽
• 快速搜尋檔案
• 明暗主題切換

【安全與隱私】
• 內建 HTML 內容過濾，防止惡意腳本執行
• 不收集任何個人資料
• 詳細的隱私政策公開透明

【支援格式】
• .md (Markdown)
• .markdown
• .txt (純文字)

【適合誰使用？】
• 軟體開發者閱讀技術文件
• 筆記愛好者整理本地筆記
• 重視隱私的使用者
• 需要離線工作的專業人士

---
QuillTide Reader - 您的本地 Markdown 工作站
```

### What's New (Release Notes)
```
v0.2.0
• 完整繁體中文介面
• 本地優先設計：無雲端、無追蹤
• 強化安全性：HTML 內容過濾
• 改進的錯誤處理與診斷
```

## Content Rating Questionnaire

Based on the app's functionality:

| Question | Answer |
|----------|--------|
| Violence | No |
| Sexual Content | No |
| Language | No |
| Controlled Substances | No |
| User-Generated Content | No (app doesn't share content) |
| Sharing of Location | No |
| In-App Purchases | No |
| Ads | No |

**Expected Rating**: Everyone (E)

## Privacy & Data Safety

Refer to: `docs/GOOGLE_PLAY_DATA_SAFETY_CHECKLIST.md`

## Contact Information

- **Developer Name**: (Your name or organization)
- **Email**: (Support email)
- **Privacy Policy URL**: https://ntustray.github.io/markdown-file-reader/PRIVACY_POLICY

## Checklist Before Submission

- [ ] App icon uploaded (512x512)
- [ ] Feature graphic created and uploaded (1024x500)
- [ ] At least 2 phone screenshots uploaded
- [ ] Short description entered (80 chars max)
- [ ] Full description entered
- [ ] Privacy policy URL verified accessible via HTTPS
- [ ] Data safety form completed
- [ ] Content rating questionnaire completed
- [ ] Target audience and content defined
- [ ] App category selected (Productivity)
- [ ] Contact details entered

## Asset Generation Commands (Optional)

If using ImageMagick to resize icons:
```bash
# Generate feature graphic placeholder
convert -size 1024x500 xc:#1a1a2e \
  -fill white -gravity center -pointsize 72 \
  -annotate 0 "QuillTide Reader" \
  assets/feature-graphic.png
```
