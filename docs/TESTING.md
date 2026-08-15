# Testing — Ray Markdown Reader 1.0.0

## Automated checks

Run with Node.js 24:

```powershell
fnm exec --using=24.19.0 -- npm.cmd test -- --run
fnm exec --using=24.19.0 -- npm.cmd run test:e2e
fnm exec --using=24.19.0 -- npm.cmd run build
cd src-tauri
cargo check
```

Current automated coverage:

- `Document.test.ts`: extension, UTF-8, BOM, size, newline preservation, dirty state, and save baseline
- `FileService.test.ts`: cancellation, Android content URI, transactional replacement, save, and failed-save retention
- `MarkdownService.test.ts`: escaped HTML, safe links, image references, GFM, highlighting, and plain text
- `ExternalLinkService.test.ts`: HTTP(S)-only opener boundary
- `ThemeService.test.ts`: system default and persistent manual choice
- `Localization.test.ts`: Traditional Chinese selection and English fallback
- `mobile-app.spec.ts`: focused empty shell, removed desktop UI, 48px controls, theme persistence, and phone-width overflow

The browser E2E suite intentionally does not pretend to validate Android's system picker, content providers, Back handling, TalkBack, or the external browser. Those remain physical-device acceptance items in `GOOGLE_PLAY_RELEASE_HANDOFF.md`.

## Test principles

- Mock only Tauri system boundaries in unit tests.
- Preserve the current dirty document on picker cancellation, read failure, and write failure.
- Add a failing regression test before fixing behavior.
- Keep removed workspace features out of tests and production code.
- Run `git diff --check` before every release commit.
