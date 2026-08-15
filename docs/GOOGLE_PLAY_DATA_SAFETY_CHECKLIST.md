# Google Play Data Safety — Ray Markdown Reader 1.0.0

Last reviewed: August 15, 2026

These are the expected Play Console answers for the current source. Reconfirm them against the final signed AAB and merged Android manifest before submission.

## Expected answers

- Does the app collect or share any required user data types? **No**
- Is all user data encrypted in transit? **Not applicable; the app transmits no user data**
- Can users request deletion? **Not applicable; the developer receives and retains no user data**
- Does the app provide account creation? **No**
- Does the app contain ads? **No**

Files and documents selected through Android's system picker are processed locally and are not collected by the developer. The locally stored theme choice is also not collected.

Opening an HTTP(S) link hands the URL to a separate browser app. Ray Markdown Reader does not make the network request. Do not describe the browser's independent processing as data collected by Ray Markdown Reader.

## Required final evidence

- [ ] Inspect the final merged manifest and confirm no Internet, broad storage, media, advertising ID, analytics, camera, microphone, contacts, or location permission.
- [ ] Inspect all release dependencies and confirm no analytics, ads, crash upload, or network SDK was added.
- [ ] Confirm the release behavior matches [the privacy policy](PRIVACY_POLICY.md).
- [ ] Confirm the public privacy-policy HTTPS URL works without login or download.
- [ ] Enter the answers in Play Console and save a dated screenshot for release records.

## Source evidence

- File picker and same-file save: `src/services/FileService.ts`
- Local theme preference: `src/services/ThemeService.ts`
- URL allowlist and external browser boundary: `src/services/ExternalLinkService.ts`
- Raw HTML and image policy: `src/services/MarkdownService.ts`
- Android capabilities: `src-tauri/capabilities/default.json`
