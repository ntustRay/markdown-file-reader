# Ray Markdown Reader — Google Play MVP Scope and TODO

> Status: agreed product scope
> Last updated: 2026-08-15
> Target release: Google Play `1.0.0`

This document is the source of truth for the first public Google Play release. It replaces the broader product direction in the older gap analysis and launch checklist wherever they conflict.

## 1. Release goal

Ship a small, reliable Android app that opens one Markdown or text file at a time, renders it for reading, switches to a full-screen editor, and saves changes back to the same file.

The release is Android-first. Desktop behavior and the old workspace-style UI are not compatibility requirements.

## 2. Locked product decisions

### Identity and distribution

- App name: `Ray Markdown Reader`
- Package ID: `com.ntustray.raymarkdownreader`
- Version name: `1.0.0`
- Developer name: `ntustRay`
- Public support email: `ntustray.opensource@gmail.com`
- Category: Productivity
- Price: Free
- Distribution: All available Google Play countries and regions
- Target audience: Ages 18 and over; the app is not designed for children
- Minimum Android version: Android 9 / API 28
- Primary acceptance device: Physical phone running Android 16
- Phone portrait is the primary design and screenshot target. Landscape must remain usable. Tablets need functional single-pane layout only.

`Ray Markdown Reader` was selected after an exact-name search did not surface an existing app or Markdown product with that name. This is not an exhaustive trademark clearance or a guarantee that a future product will not use the same display name. Repeat an exact and confusingly-similar name check in Play Console before creating the final listing.

### Supported workflow

1. Launch to a minimal empty state. Do not restore the previous file.
2. Tap **Open file** and use the Android system document picker.
3. Open exactly one `.md`, `.markdown`, or `.txt` file.
4. Show the file name and a full-screen document view.
5. Render `.md` and `.markdown` as Markdown; render `.txt` as unformatted plain text.
6. Switch between full-screen Preview and full-screen Edit. Do not use split view.
7. Save only to the currently opened file. Do not create files or implement Save As.
8. Opening another file replaces the current file only after the new selection is successfully read.

### File contract

- Maximum file size: 10 MB. Reject larger files before decoding or rendering them.
- Supported encoding: Valid UTF-8, with or without UTF-8 BOM.
- Reject unsupported encodings instead of replacing invalid bytes and risking a corrupt save.
- Preserve whether the original file had a UTF-8 BOM.
- Preserve the original `LF` or `CRLF` line-ending convention when saving.
- If the source provider is read-only or a write fails, keep the edited content in memory and show an actionable error.
- Use only the URI access granted by the system document picker. Do not request broad storage or media permissions.

### Unsaved-change contract

- Preview reflects the current in-memory edit immediately and does not require a save.
- Before opening another file or leaving through the Android Back action, show three choices: **Save**, **Discard**, and **Cancel**.
- If the soft keyboard is visible, the first Back action closes the keyboard. A later Back action performs the leave flow.
- Do not discard the current document until the replacement file has been selected and read successfully.
- Cancelling the picker, failing to read the replacement, or failing to save must leave the current document and its edits intact.
- Pressing Home, switching apps, process termination, and OS reclamation do not guarantee a prompt or recovery. Version 1.0.0 has no autosave or draft recovery.

### Markdown and link contract

- Support normal GitHub-Flavored Markdown used by `marked`, including headings, paragraphs, emphasis, lists, task lists, blockquotes, tables, fenced code blocks, and links.
- Keep fenced-code syntax highlighting with `highlight.js`.
- Do not execute or render raw HTML. Unsupported HTML must appear as source text rather than silently disappearing.
- Only `http://` and `https://` links are actionable.
- Open actionable links in the device's external browser, never inside the app WebView.
- Do not load remote or local images inside the app.
- Render a remote image as a text link that opens its `http://` or `https://` source in the external browser.
- Render a local or relative image as non-actionable source/alternative text.
- Block `javascript:`, `file:`, `content:`, custom schemes, and every other URL scheme.
- Do not request the Android Internet permission. The external browser owns network access.

### UI and localization contract

- Top bar: current file name, Open file, theme toggle, and Save while editing.
- Main area: one full-screen Preview or Edit surface.
- Floating action button: switch between Edit and Preview.
- Empty state: app name and one Open file action.
- Remove the sidebar, hamburger menu, folder path, folder picker, file tree, search, recent files, pinned files, exports, reading settings, and all related UI.
- First launch follows the Android system light/dark theme.
- After a manual theme change, persist the explicit light or dark choice locally.
- Bundle Traditional Chinese and English strings. Use Traditional Chinese when the device locale is Traditional Chinese; otherwise fall back to English.
- Do not add an in-app language setting for 1.0.0.
- Bundle fonts/icons locally or use system fonts and local SVG/CSS icons. Runtime Google Fonts requests are not allowed.

### Privacy and business contract

- No ads, accounts, analytics, telemetry, crash uploads, cloud sync, collaborative editing, or first-party servers.
- File contents and theme preference remain on the device.
- Operational errors may be shown locally but are not uploaded.
- Google Play Data safety must declare no data collection and no data sharing, subject to a final dependency and manifest audit.

## 3. Explicit non-goals for 1.0.0

- Folder opening or folder trees
- Recent files or reopening the last file
- Pinned files or bookmarks
- In-document or cross-file search
- Multiple files or tabs
- Split editor/preview
- New file, Save As, export, share, print, or PDF
- Local or inline image rendering
- Remote image rendering inside the app
- Raw HTML, Mermaid, math, or custom Markdown plugins
- File association or opening a Markdown file from another app
- Autosave, draft recovery, or version history
- Reading customization beyond light/dark theme
- Desktop release compatibility
- Tablet-specific navigation or multi-column design

## 4. Phased implementation TODO

Do not start store artwork or the 14-day closed-test clock until all P0 product gates pass on a physical Android device.

### Phase 0 — Protect the new scope

- [x] Rename the app everywhere to `Ray Markdown Reader`.
- [x] Change the package ID to `com.ntustray.raymarkdownreader` before creating the Play Console app.
- [x] Set version name to `1.0.0` and establish an integer Android `versionCode` that increments for every uploaded bundle.
- [x] Replace `QuillTide`, `MarkView`, `quilltide_*`, and old desktop-workspace copy.
- [x] Update `README.md`, privacy/data-safety docs, release notes, and the older launch checklist to match this scope.
- [x] Mark the older `docs/APP_STORE_GAP_ANALYSIS.md` feature roadmap as superseded; do not leave completed claims for removed features.
- [x] Add a regression check that fails if removed UI labels or remote font URLs return.

**Gate:** One identity, one package ID, and no conflicting release documentation.

### Phase 1 — Prove the Android platform seams first

- [x] Run an environment preflight for Java, Rust, Android Studio, Android SDK Platform/Platform-Tools/Build-Tools/Command-line Tools, NDK, `ANDROID_HOME`, `NDK_HOME`, and Rust Android targets. (Android toolchain is missing; see release handoff.)
- [x] Update Tauri and its plugins to a mutually compatible supported version before generating mobile scaffolding; review release notes for breaking changes.
- [ ] Run `tauri android init` and commit the generated Android project files that belong in source control.
- [x] Set `minSdkVersion` to 28.
- [ ] Target Android 16 / API 36. The earliest realistic production request crosses the 2026-08-31 API 36 deadline after the mandatory closed test.
- [x] Create a minimal Android-only Tauri capability instead of reusing the desktop capability that grants broad `**` filesystem scope.
- [ ] Prove on the Android 16 physical phone that the system picker returns a `content://` URI and the app can read a selected `.md`, `.markdown`, and `.txt` file through the filesystem plugin.
- [ ] Prove that the selected document can be overwritten without `READ_EXTERNAL_STORAGE`, `WRITE_EXTERNAL_STORAGE`, `MANAGE_EXTERNAL_STORAGE`, media, or Internet permissions.
- [ ] Test at least one writable local document and one read-only provider result.
- [ ] Prove that cancelling the picker and a read failure preserve the existing in-memory document.
- [x] Add the Tauri opener plugin on Android and restrict its capability scope to `http://*` and `https://*` URLs only.
- [ ] Prove external-browser opening on the Android 16 phone and handle the no-browser/error case.
- [ ] Decide the Back-event implementation only after proving keyboard-first Back behavior on device.

Tauri's dialog plugin returns Android content URIs and documents that its filesystem plugin accepts the returned path format. The opener plugin supports URL opening on Android. These are supported seams, but read/write URI lifetime and provider behavior still require the physical-device spike before UI work.

**Gate:** A throwaway mobile flow can select, read, overwrite, and reopen one document and can open a safe URL externally without broad runtime permissions.

### Phase 2 — Build the single-document domain model

- [x] Replace folder-oriented `FileService` state with one controlled document state.
- [ ] Model the document explicitly: URI, display name, file kind, original bytes metadata, saved content, draft content, and read/write state.
- [ ] Use real states rather than unrelated booleans, for example `empty | loading | preview | editing | error` plus a dirty comparison.
- [x] Validate extension, byte size, and UTF-8 at the file boundary before creating document state.
- [x] Detect and preserve UTF-8 BOM and dominant/original line ending.
- [x] Determine dirty state by comparing the normalized draft with the last successfully saved content; reverting all edits should clear dirty state.
- [x] Implement save as one operation against the current URI. Update the saved baseline only after a confirmed successful write.
- [x] Implement the Save/Discard/Cancel decision as an explicit result type.
- [x] Make file replacement transactional: retain the old state until the new document is valid and loaded.
- [x] Add localized, actionable errors for unsupported extension, over 10 MB, invalid UTF-8, read failure, read-only source, write failure, and external-link failure.

**Gate:** Unit tests cover every file and unsaved-change transition, including all failure paths with no data loss.

### Phase 3 — Make Markdown rendering match the contract

- [x] Render `.txt` by escaping all markup and preserving whitespace.
- [x] Configure the smallest required GFM feature set and retain fenced-code highlighting.
- [x] Replace the current sanitizer behavior that removes unsupported HTML. Escape raw HTML tokens so their source remains visible.
- [x] Convert Markdown images according to the locked remote/local rules; never leave an `<img src>` that can fetch content.
- [x] Sanitize link protocols before rendering and again before invoking the opener boundary.
- [x] Intercept link clicks so the WebView never navigates away from the app document.
- [x] Add a restrictive Content Security Policy with no remote font, image, script, frame, or connection sources.
- [ ] Add security tests for raw HTML, event handlers, scripts, iframes, encoded/obfuscated protocols, remote images, relative images, and ordinary HTTP(S) links.
- [x] Add representative GFM and syntax-highlight fixtures.

**Gate:** Malicious fixtures cannot execute code, navigate the WebView, read local resources, or trigger non-HTTP(S) apps; supported Markdown remains readable.

### Phase 4 — Replace the desktop workspace with the mobile UI

- [x] Remove sidebar, overlay, hamburger menu, folder picker, breadcrumbs, search, recent/pinned lists, and split-pane markup.
- [x] Remove `RecentFilesService`, `SettingsService`, `ExportService`, folder-tree code, and tests that exist only for removed behavior.
- [x] Rebuild CSS around a single phone viewport instead of patching the 1,500-line desktop stylesheet.
- [x] Implement the agreed empty state, top bar, full-screen Preview/Edit surfaces, conditional Save action, and Edit/Preview floating action button.
- [ ] Keep the document readable with Android safe areas, display cutouts, font scaling, and the on-screen keyboard.
- [x] Prevent the toolbar and floating action from covering document or editor content.
- [ ] Support phone portrait and landscape without horizontal page scrolling.
- [x] Make all touch targets at least 48 dp and provide visible focus/pressed/disabled states.
- [x] Give every icon-only control an accessible name in both languages.
- [ ] Preserve editor selection and scroll position when switching Preview/Edit where practical; do not add a complex synchronized-scroll system.
- [x] Use the system theme on first launch and persist only an explicit manual override.
- [x] Replace remote Google Fonts and Material Symbols with system/local assets.

**Gate:** The complete flow is usable one-handed on the Android 16 phone, with no sidebar or desktop-only controls at any orientation.

### Phase 5 — Localization and automated verification

- [x] Centralize user-facing strings in a small typed localization module; do not introduce a large i18n framework unless the platform requires it.
- [x] Add complete `en` and `zh-TW` strings for every label, dialog, validation message, and error.
- [x] Test `zh-TW`, English, and an unsupported locale that must fall back to English.
- [x] Update unit tests for file validation, encoding, newline/BOM preservation, dirty state, safe Markdown, link policy, image policy, theme selection, and localization fallback.
- [ ] Replace desktop E2E expectations with mobile viewport journeys for empty, preview, edit, dirty, save, discard, cancel, theme, and link flows.
- [x] Run typecheck/build, unit tests, E2E tests, and `git diff --check`.
- [ ] Run an accessibility pass with Android TalkBack: reading order, labels, focus, dialog actions, editor, and theme contrast.
- [ ] Test 10 MB boundary files and representative long code blocks/tables for responsiveness and memory stability.

**Gate:** Automated checks pass and all critical journeys pass on the physical Android 16 phone in both languages and themes.

### Phase 6 — Android release engineering

- [ ] Audit the generated manifest and final merged manifest. Confirm no Internet, broad storage, media, advertising ID, analytics, camera, microphone, contacts, or location permissions.
- [ ] Confirm target API 36 again immediately before upload because Google Play requirements change over time.
- [ ] Generate a dedicated upload keystore outside the repository.
- [ ] Back up the keystore and credentials in two secure locations. Never commit them or paste them into project docs.
- [x] Add `*.jks`, `*.keystore`, signing property files, and local credential paths to `.gitignore` before creating the key.
- [ ] Use Google Play App Signing and keep the upload key distinct from the Google-managed app signing key.
- [ ] Build a signed release Android App Bundle (`.aab`), not only an APK.
- [ ] Inspect bundle package ID, version name/code, min/target SDK, architectures, icons, and permissions.
- [ ] Install a Play-generated artifact through Internal testing and repeat the physical-device smoke test.
- [ ] Review Play Console pre-launch report crashes, ANRs, accessibility findings, and compatibility results.

**Gate:** The Play-delivered build, not only a local debug build, passes the release smoke test with the expected manifest.

### Phase 7 — Store identity, listing, and policy

- [x] Design a new app icon aligned with `Ray Markdown Reader`; replace the current generic blue `M` icon.
- [x] Generate launcher/adaptive icons and a 512 × 512 Play icon.
- [ ] Create a 1024 × 500 feature graphic consistent with the icon and without misleading claims.
- [ ] Capture at least two real phone screenshots from the release build. Recommended set: empty/open flow, Markdown preview, full-screen edit, and dark theme.
- [x] Write an English default listing and a Traditional Chinese localized listing.
- [ ] Make store text match the actual 1.0.0 scope. Do not advertise folders, search, split view, images, export, file associations, or autosave.
- [ ] Update and publish the privacy policy at a stable HTTPS URL. The currently documented GitHub Pages URL must be verified live rather than assumed.
- [ ] Update Data safety answers after inspecting the release bundle and every dependency. Expected result: no data collected and no data shared.
- [ ] Complete Ads declaration: no ads.
- [ ] Complete App access: no login or restricted areas.
- [ ] Complete target audience: ages 18 and over, not designed for children.
- [ ] Complete the IARC content-rating questionnaire accurately; do not hard-code an expected rating as if it were already assigned.
- [ ] Complete all other Play Console App content declarations shown for the account and regions.
- [ ] Verify the developer profile and Android-device verification task using the Play Console mobile app.
- [ ] Enter developer name `ntustRay` and support email `ntustray.opensource@gmail.com` consistently.
- [ ] Re-run exact/confusingly-similar searches for `Ray Markdown Reader` before finalizing listing graphics.

**Gate:** Play Console shows no incomplete App content or store-listing blockers, and every public claim is demonstrated by the release build.

### Phase 8 — Mandatory testing and production access

- [ ] Start with an optional Internal test for the owner and a small trusted group.
- [ ] Recruit 15–20 Google-account testers to maintain a buffer above the required 12.
- [ ] Start a Closed test only with the release candidate and a prepared feedback form.
- [ ] Keep at least 12 testers opted in continuously for at least 14 days.
- [ ] Ask testers to exercise Open, Preview/Edit, modify, Preview, Save, theme, external link, dirty-file replacement, Back, and error behavior.
- [ ] Collect device/Android version, scenario completion, defects, usability feedback, and consent to follow up. Do not collect document contents.
- [ ] Triage feedback and upload fixes with incremented `versionCode` while maintaining the qualifying closed-test track.
- [ ] Record what testers used, what they reported, and what changed; these answers are required when applying for production access.
- [ ] After the 14-day criterion is met, apply for Production access and answer the testing, app value, and production-readiness questions truthfully.
- [ ] Allow for Google's production-access review before scheduling launch.

**Gate:** Production access is granted; the final candidate has no unresolved P0/P1 defect or policy blocker.

### Phase 9 — Production release

- [ ] Upload the final AAB with a new `versionCode` if it differs from the approved test artifact.
- [ ] Recheck release notes, countries/regions, price, signing, Data safety, privacy URL, content rating, screenshots, and contact details.
- [ ] Resolve every blocking Play Console error and assess warnings individually.
- [ ] Submit the Production release for review.
- [ ] After approval, verify the live store listing, installation from Google Play, app identity, and the core flow on the Android 16 phone.
- [ ] Record the released AAB version, `versionCode`, commit SHA, review result, and live listing URL.

**Gate:** A public user can find, install, open, edit, save, and safely leave a document using the Google Play build.

## 5. Release smoke test

Run this exact sequence on the Play-installed build in English/light and Traditional Chinese/dark:

1. Launch and confirm there is no previous document, sidebar, or runtime permission prompt.
2. Cancel the picker and confirm the empty state remains.
3. Open a valid Markdown file and confirm file name, GFM, and highlighted code.
4. Confirm raw HTML is visible as source and cannot execute.
5. Confirm remote/local images do not load in the app.
6. Tap a remote image link and an ordinary HTTPS link; confirm both open externally.
7. Confirm unsafe URL schemes do nothing and show safe feedback when appropriate.
8. Switch to full-screen Edit, change text, and switch to Preview without saving.
9. Start opening another file, choose Cancel, and confirm the draft remains.
10. Start opening another file, choose Discard, then cancel the picker; confirm the draft remains.
11. Save successfully and verify the same file changed with BOM and line endings preserved.
12. Trigger a write failure and confirm the draft remains.
13. With the keyboard open, press Back once to close it; press Back again and exercise Save, Discard, and Cancel.
14. Open invalid UTF-8, unsupported-extension, over-10-MB, and read-only fixtures and confirm actionable errors without data loss.
15. Rotate between portrait and landscape and confirm the core controls and content remain usable.

## 6. Definition of done

Version 1.0.0 is done only when:

- The locked scope above is implemented with no advertised removed feature.
- The signed Play-delivered AAB passes the release smoke test on Android 16.
- Automated checks and the release manifest/permission audit pass.
- English and Traditional Chinese are complete and accessible.
- Privacy policy, Data safety, content rating, target audience, store listing, and contact details are complete and accurate.
- At least 12 testers have remained opted into Closed testing for 14 continuous days and meaningful feedback has been recorded.
- Google grants Production access and approves the Production release.
- The live Google Play installation is verified.

## 7. Post-launch only

Do not add these before 1.0.0 unless a release-blocking test proves they are necessary:

- File associations / Open with
- Local image support through folder access
- Autosave or crash recovery
- In-document search
- Multiple files or tabs
- New file / Save As / export
- Additional languages
- Tablet-specific UI

## 8. Primary references

- [Tauri Dialog plugin](https://v2.tauri.app/plugin/dialog/) — Android support, system picker, and `content://` URI behavior
- [Tauri File System plugin](https://v2.tauri.app/plugin/file-system/) — Android filesystem scope and permission configuration
- [Tauri Opener plugin](https://v2.tauri.app/plugin/opener/) — Android URL opening and capability scopes
- [Tauri Android prerequisites](https://v2.tauri.app/start/prerequisites/#android) — Android Studio, SDK/NDK, environment variables, and Rust targets
- [Google Play target API requirements](https://support.google.com/googleplay/android-developer/answer/11926878?hl=en-AU) — API 36 requirement beginning 2026-08-31
- [Google Play testing requirements for new personal accounts](https://support.google.com/googleplay/android-developer/answer/14151465?hl=en) — 12 opted-in testers for 14 continuous days and Production-access application
- [Google Play device verification](https://support.google.com/googleplay/android-developer/answer/14316361?hl=en) — real Android device verification for new personal accounts
- [Google Play Data safety](https://support.google.com/googleplay/android-developer/answer/10787469?hl=en) — form and privacy-policy requirements even when no data is collected
- [Google Play preview assets](https://support.google.com/googleplay/android-developer/answer/9866151?hl=en) — icon, feature graphic, screenshot, and short-description requirements
- [Google Play content ratings](https://support.google.com/googleplay/android-developer/answer/9859655?hl=en) — IARC questionnaire and target-audience declarations
- [Google Play App Signing](https://support.google.com/googleplay/android-developer/answer/9842756?hl=en) — Google-managed signing key and developer-held upload key
