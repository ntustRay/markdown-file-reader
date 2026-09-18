# Next Session Handoff

Updated: 2026-09-18

## Current release: 1.1.0 / 1001000 (not uploaded)

- Implemented Android **New .md** using the system create-document picker.
  Choose name/location, then edit, save, and reopen. Existing drafts survive
  cancellation and failures; overlapping file operations are blocked.
- Fixed stale Discard dialog results after Escape and removed unsupported TV
  launcher declarations. The generated main Android manifest is deliberately
  tracked; preserve it when regenerating the Android project.
- Verification: 43 unit tests, 12 Playwright tests, TypeScript/Vite build, both
  ARM Rust release builds, Android Kotlin compilation and AAB packaging passed.
- Android release lint: 0 errors, 35 warnings, 1 hint. Remaining warnings concern
  generated resources/icons, dependency update suggestions and generated Kotlin.
  Plugin Gradle unit-test task reports NO-SOURCE (not a native runtime test).
- Playwright uses a mocked Android bridge. No ADB device or emulator was available;
  the new system picker still requires real-device smoke testing.
- Unsigned AAB: `src-tauri/target/RayMarkdownReader-1.1.0-unsigned.aab`
  - SHA-256: `C9500DD9789F83B8334B4D538AA7D0CF26AB22B292A16C1079D8E10EE1787619`
  - Package `com.ntustray.raymarkdownreader`, version `1.1.0` / `1001000`,
    min SDK 28, target SDK 36, ARM64 + ARMv7, no new Android permissions.
- Signing is blocked: upload keystore exists, but signing passwords are not in
  the process environment. Do not search for, save, or request passwords in chat.
  Local generated Gradle signing is conditional so unsigned packaging is possible.
- **Google Play has NOT been updated to 1.1.0.** Historical Console statuses below
  were last checked September 6 and are not current verification.

### Resume release

1. Sign locally in an interactive terminal (jarsigner prompts for the keystore
   password; do not put it in the command). Run from the repository root:

   ```powershell
   & "$env:JAVA_HOME/bin/jarsigner.exe" -keystore C:\Users\MingRay\AndroidKeys\ray-markdown-reader-upload.jks -signedjar src-tauri/target/RayMarkdownReader-1.1.0.aab src-tauri/target/RayMarkdownReader-1.1.0-unsigned.aab upload
   & "$env:JAVA_HOME/bin/jarsigner.exe" -verify src-tauri/target/RayMarkdownReader-1.1.0.aab
   ```

2. Verify signing certificate against the existing Play upload certificate. Never
   upload the unsigned artifact. Upload signed version 1001000 to Alpha, use the
   bilingual 1.1.0 notes in `RELEASE_NOTES.md`, and submit for review.
3. On a phone test New .md -> name/location -> Chinese/emoji text -> Save -> reopen;
   also test cancel, duplicate filenames, and Save/Discard/Cancel on a dirty file.
4. Continue genuine tester recruitment; do not claim production access before the
   Console confirms all testing requirements are met.

## Completed

- Android toolchain, Android 16 phone, and Tauri Android project are working.
- Android document picker can open, edit, and save `.md`, `.markdown`, and `.txt` files.
- Fixed the first-launch race where the first Open file tap could be ignored.
- Commit `ae9f661` is pushed to `origin/master`.
- Upload keystore exists outside the repository:
  - Original: `C:\Users\MingRay\AndroidKeys\ray-markdown-reader-upload.jks`
  - Local backup: `C:\Users\MingRay\AndroidKeys\backup\ray-markdown-reader-upload.jks`
  - Alias: `upload`
- Google Play App Signing is enabled.
- Signed AAB was uploaded to Internal testing:
  - Local copy: `C:\Users\MingRay\AndroidReleases\RayMarkdownReader-1.0.0.aab`
  - SHA-256: `F789F0ECDBDD86EE94B6B001E91BE1B4E930678518CA1B0727E0FE44A859EC83`
  - Package: `com.ntustray.raymarkdownreader`
  - Version: `1.0.0` / `1000000`
  - SDK: min 28, target 36
  - ABIs: ARM64 and ARMv7
- Internal tester was added. The Play-delivered build was installed and smoke-tested successfully.
- Privacy policy is published at:
  - `https://ntustray.github.io/markdown-file-reader/privacy-policy/`
- Google Play app-content declarations are complete (no remaining items):
  - Privacy policy, app access, ads, content rating, target audience, Data safety,
    government app, financial features, health features, and Advertising ID.
- Google Play store settings are complete:
  - Type: App
  - Category: Productivity
  - Public email: `ntustray.opensource@gmail.com`
  - Public website: `https://ntustray.github.io/markdown-file-reader/privacy-policy/`
- The default English store listing is complete and saved in Play Console:
  - App icon, feature graphic, and two phone screenshots are attached.
  - The AI-generated-content declaration is complete; only the feature graphic
    is marked as AI generated or edited.
- Closed testing track `Alpha` is published (dashboard verified 2026-09-06):
  - Release: `1.0.0 Closed test`
  - App Bundle: version `1.0.0` / `1000000`
  - Availability: all 177 countries/regions
  - Tester list: `test` (2 users)
  - Feedback email: `ntustray.opensource@gmail.com`
  - English and Traditional Chinese release notes are saved.
- Play Console's release preview has no blocking errors. It has one non-blocking
  warning because native debug symbols were not uploaded.
- All 15 Play Console changes were submitted to Google review on 2026-09-01.
  The dashboard now marks **Publish a closed testing release** complete.
- Android developer verification checked on 2026-09-06:
  - Package `com.ntustray.raymarkdownreader`: **Registered**.
  - All three listed signing-key fingerprints: **Verified**.
  - No package registration or additional key submission was needed.
  - Identity tab uses the existing developer-account identity.
  - Account home briefly displayed a generic account-verification hint; account
    details showed verified contact email, phone, and developer email, but no
    actionable identity-verification task. Do not equate these with a separate
    explicit identity-verification status.
- Closed-test dashboard shows **1 opted-in tester**; 11 more are needed.
- Alpha tester settings verified: track active, `test` email list has 2 eligible
  accounts, and both enrollment link buttons are enabled.
  - Opt in: https://play.google.com/apps/testing/com.ntustray.raymarkdownreader
  - Install: https://play.google.com/store/apps/details?id=com.ntustray.raymarkdownreader
  - Testers must use the Google account added to the eligible email list.
  - Recruitment is awaiting consenting testers' Google account emails; no
    invitations have been sent or public recruitment posts published.
  - Ask testers to open a disposable Markdown/text file, preview, edit, save,
    reopen to verify persistence, and report device/Android version, steps,
    expected result and actual result to the configured feedback email.
- The pre-launch report has not been generated yet; Play Console says it will be
  generated after an artifact is uploaded to a testing track.
- Required store assets are ready locally:
  - `assets/store/play-icon-512.png`
  - `assets/store/feature-graphic-1024x500.png`
  - `assets/store/phone-preview-light-1080x2400.png`
  - `assets/store/phone-editor-dark-1080x2400.png`

## Previous release verification (September 6)

- Source fixes on 2026-09-06: pending saves preserve later edits as dirty,
  save UI prevents overlapping writes, and literal percent filenames open correctly.
  Added six regression cases, including Android URI writes and reopening during a save.
  These source fixes were pushed as `6534f7e`; they are included in the new 1.1.0
  unsigned AAB above, but are not yet uploaded to Play.
- Unit tests: 38 passed.
- E2E tests: 4 passed.
- Frontend build: passed.
- Real-device first-open regression: 5/5 passed.
- Release AAB signing and contents: verified.

## Next

1. Recruit 11 more actual opted-in testers (target 15-18 total for attrition).
2. Add consenting testers to the email list, then provide the closed-test opt-in
   link. Adding an email alone does not count as opting in.
3. Verify at least 12 testers remain opted in continuously for 14 days, collect
   real usage feedback, and then apply for production access.
4. Review the pre-launch report after Google generates it and fix only blocking issues.

## Important

- Never request or store the keystore password. No password is saved in the repository.
- Closed testing is published; the live opted-in count is 1 as of 2026-09-06.
- The September 30 package-registration deadline is separate from the closed-test
  requirement. The existing Play package and its three listed keys are registered.
- Windows Developer Mode is off. Tauri symlink creation fails, so copy each compiled release `.so` into generated `jniLibs` before running Gradle.
- `src-tauri/gen/android` is generated and ignored by Git, except the explicitly
  tracked main `AndroidManifest.xml` that removes unsupported TV declarations.
- Do not touch the user's untracked `markview-app.png`, `markview-screenshot.png`, or `nul` files.
