# Implementation Summary — Ray Markdown Reader 1.0.0

Ray Markdown Reader is an Android-first, single-document Tauri app.

## Runtime shape

- `src/domain/Document.ts` owns document validation, normalized draft state, UTF-8 BOM, line-ending preservation, dirty comparison, and serialization.
- `src/services/FileService.ts` owns the Android system-picker and filesystem-plugin boundary. Replacement is transactional and save updates the baseline only after a successful write.
- `src/services/MarkdownService.ts` renders GFM, escapes raw HTML, never emits images, and marks only HTTP(S) links for external opening.
- `src/services/ExternalLinkService.ts` validates the URL again before invoking the Android browser boundary.
- `src/services/ThemeService.ts` follows the system initially and persists only an explicit user choice.
- `src/localization.ts` contains typed English and Traditional Chinese strings with English fallback.
- `src/app.ts` coordinates the one-file full-screen Preview/Edit workflow and unsaved-change decisions.

## Security and privacy

- Restrictive CSP with no remote runtime assets
- Android-only Tauri capability
- No global `**` filesystem scope
- System-picker URI access only
- Opener scope restricted to HTTP and HTTPS
- No accounts, network service, analytics, ads, or telemetry

## Removed from the former desktop workspace

Sidebar, folder tree, recent and pinned files, search, split view, exports, reading settings, remote fonts, and desktop compatibility requirements were deliberately removed for the Google Play MVP.

## Remaining platform proof

The repository does not currently contain generated Android scaffolding or a signed AAB because the machine lacks Android Studio, Java, SDK/NDK, and Rust Android targets. Follow `GOOGLE_PLAY_RELEASE_HANDOFF.md` after installing that toolchain.
