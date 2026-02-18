# Google Play Data Safety Checklist — QuillTide Reader

Last updated: 2026-02-05

> Goal: keep this checklist aligned with `docs/PRIVACY_POLICY.md` and the real app behavior.

## Product posture
- Local-first app
- No cloud sync
- No collaborative editing

## Data collection/sharing declaration baseline

### Data collected by app developer
- Personal info: **No**
- Financial info: **No**
- Health and fitness: **No**
- Messages: **No**
- Photos and videos: **No**
- Audio files: **No**
- Files and docs: **Processed locally only** (user-selected files), **not collected by developer**
- App activity analytics: **No first-party cloud analytics**
- Device or other IDs: **No**

### Data shared with third parties
- Shared data: **No**

## Security practices statement
- Data in transit: N/A for local-only core flow
- Account creation required: No
- Users can request data deletion: N/A for cloud account data; users control local deletion

## Console submission checklist
- [ ] Privacy policy URL is publicly reachable via HTTPS (GitHub Pages not yet enabled — see `docs/PRIVACY_POLICY.md` for setup steps)
- [ ] Play Console Data safety answers match this file (manual step in Google Play Console)
- [x] Policy text matches latest app behavior (verified 2026-02-05)
- [x] Release notes mention local-first/no-cloud posture (added to RELEASE_NOTES.md)

## Evidence links (repo)
- Privacy policy: `docs/PRIVACY_POLICY.md`
- Theme local storage: `src/services/ThemeService.ts`
- Local file open/save: `src/services/FileService.ts`
- Markdown sanitization: `src/services/MarkdownService.ts`
