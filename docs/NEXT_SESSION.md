# Next Session Handoff

Updated: 2026-08-24

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

## Verification

- Unit tests: 32 passed.
- E2E tests: 4 passed.
- Frontend build: passed.
- Real-device first-open regression: 5/5 passed.
- Release AAB signing and contents: verified.

## Next

1. Enter the privacy-policy URL in Play Console, then complete the remaining store listing and policy fields using:
   - `docs/STORE_LISTING_ASSETS.md`
   - `docs/GOOGLE_PLAY_DATA_SAFETY_CHECKLIST.md`
2. Review the Internal testing pre-launch report and fix only blocking issues.
3. Create Closed testing and follow the exact tester count and duration shown by Play Console.

## Important

- Never request or store the keystore password. No password is saved in the repository.
- Windows Developer Mode is off. Tauri symlink creation fails, so copy each compiled release `.so` into generated `jniLibs` before running Gradle.
- `src-tauri/gen/android` is generated and ignored by Git.
- Do not touch the user's untracked `markview-app.png`, `markview-screenshot.png`, or `nul` files.
