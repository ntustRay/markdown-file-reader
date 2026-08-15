# Ray Markdown Reader

A focused Android app for opening, reading, editing, and saving one local Markdown or plain-text file.

## Version 1.0.0

- Opens one `.md`, `.markdown`, or `.txt` file with the Android system picker
- Shows Markdown in a full-screen preview and `.txt` as unformatted text
- Switches the whole screen between Preview and Edit
- Saves changes back to the same selected file
- Prompts to Save, Discard, or Cancel before replacing or leaving a changed document
- Supports English and Traditional Chinese
- Follows the system theme until the user chooses a persistent light or dark theme
- Opens only HTTP(S) links in the device browser
- Works without accounts, ads, analytics, cloud services, or broad storage access

The app intentionally has no folders, sidebar, tabs, recent files, search, split view, export, inline images, or draft recovery.

## Development

Use Node.js 24 and the current Rust stable toolchain.

```powershell
npm.cmd install
npm.cmd test -- --run
npm.cmd run test:e2e
npm.cmd run build
cd src-tauri
cargo check
```

Android builds additionally require Android Studio, Java, Android SDK Platform 36, SDK Platform-Tools, SDK Build-Tools, Android SDK Command-line Tools, NDK, and the Rust Android targets. See [Google Play release handoff](docs/GOOGLE_PLAY_RELEASE_HANDOFF.md).

## Release identity

| Field | Value |
| --- | --- |
| App name | Ray Markdown Reader |
| Package ID | `com.ntustray.raymarkdownreader` |
| Version | `1.0.0` / version code `1000000` |
| Minimum Android | Android 9 / API 28 |
| Target Android | Android 16 / API 36 |
| Category | Productivity |
| Developer | ntustRay |
| Support | ntustray.opensource@gmail.com |

## Product and release documents

- [MVP scope and TODO](docs/GOOGLE_PLAY_MVP_TODO.md)
- [Google Play release handoff](docs/GOOGLE_PLAY_RELEASE_HANDOFF.md)
- [Store listing copy](docs/STORE_LISTING_ASSETS.md)
- [Privacy policy](docs/PRIVACY_POLICY.md)
- [Data safety answers](docs/GOOGLE_PLAY_DATA_SAFETY_CHECKLIST.md)
- [Testing](docs/TESTING.md)

## Privacy

Files stay on the device and are accessed only after the user selects them. Ray Markdown Reader does not collect or share user data. See the [privacy policy](docs/PRIVACY_POLICY.md).
