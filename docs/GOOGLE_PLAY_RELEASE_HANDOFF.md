# Google Play Release Handoff — Ray Markdown Reader 1.0.0

This file contains only work that requires the developer's machine, physical Android phone, signing identity, or Play Console account. Product implementation and repository-safe preparation should be completed before starting here.

## 1. Install the Android toolchain

Install Android Studio, then use SDK Manager to install:

- Android SDK Platform 36
- Android SDK Platform-Tools
- Android SDK Build-Tools
- Android SDK Command-line Tools
- Android NDK

Set `JAVA_HOME`, `ANDROID_HOME`, and `NDK_HOME` as described by the current Tauri Android prerequisites. Restart the terminal, then add Rust Android targets:

```powershell
rustup target add aarch64-linux-android armv7-linux-androideabi i686-linux-android x86_64-linux-android
```

Do not install an older SDK merely to satisfy a stale guide. Recheck Google Play's target API requirement immediately before upload.

## 2. Generate and verify the Android project

```powershell
fnm exec --using=24.19.0 -- npm.cmd run tauri -- android init
```

After generation:

- Set and verify `compileSdk` and `targetSdk` 36 in the generated Gradle configuration.
- Keep `minSdkVersion` 28 from `src-tauri/tauri.conf.json`.
- Inspect the generated and merged manifests. Remove any unneeded permission and confirm there is no Internet, broad storage, media, advertising ID, camera, microphone, contacts, or location permission.
- Decide whether generated Android project files should be committed; remove the matching `src-tauri/gen` ignore only for files intentionally placed under version control.

## 3. Test on the physical Android 16 phone

Verify both English and Traditional Chinese, light and dark themes, portrait and landscape:

- Open writable `.md`, `.markdown`, and `.txt` files through the system picker.
- Open a UTF-8 BOM file and a CRLF file; save and confirm both formats are preserved.
- Confirm invalid UTF-8, unsupported extension, and files over 10 MB are rejected safely.
- Edit, preview, save, reopen, and confirm exact content.
- Exercise Save, Discard, and Cancel before opening another file.
- Cancel the picker and trigger a read failure; confirm the old dirty document remains.
- Test a read-only provider and confirm failed save retains the edit in memory.
- Confirm Back closes the keyboard first, then shows the unsaved-change prompt.
- Confirm HTTP(S) links and remote-image references open in the external browser.
- Confirm relative/local images are not actionable and no images load in the app.
- Run TalkBack through the complete flow.

## 4. Create and protect the upload key

Create a dedicated upload keystore outside the repository. Never paste its password into chat, source, scripts, shell history, or documentation. Back up the key and credentials in two secure locations. Use Google Play App Signing.

The repository already ignores `*.jks`, `*.keystore`, `keystore.properties`, and `key.properties` as a final guardrail.

## 5. Build the release artifacts

Configure signing locally according to the current Tauri Google Play guide, then build:

```powershell
fnm exec --using=24.19.0 -- npm.cmd run tauri -- android build --aab --target aarch64 --target armv7
```

Inspect the AAB with Android Studio's APK Analyzer or `bundletool`. Confirm package ID, version name/code, min/target SDK, architectures, icons, signing certificate, and permissions.

## 6. Complete Google Play Console

- Create the app as Ray Markdown Reader with package `com.ntustray.raymarkdownreader`.
- Verify no exact or confusingly similar name conflict appears in Play Console.
- Publish `docs/PRIVACY_POLICY.md` at a stable public HTTPS URL and verify it without login.
- Use the English default and Traditional Chinese listing in `docs/STORE_LISTING_ASSETS.md`.
- Upload the 512 × 512 icon, 1024 × 500 feature graphic, and real release screenshots.
- Complete Data safety, Ads, App access, Target audience, Content rating, and every other account-specific declaration.
- Complete personal developer and Android-device verification if Play Console requests it.

## 7. Closed test and production

Recruit 15–20 testers so at least 12 remain opted in continuously for 14 days. Upload the AAB to Closed testing, distribute the opt-in link, and record the start/end dates and tester count.

Install the Play-delivered build and rerun the smoke test. Review the pre-launch report for crashes, ANRs, accessibility, and compatibility. After the eligibility period, answer Google's production-access questions truthfully and request production access.

The first Play Console upload and all credential/account verification are intentionally manual.
