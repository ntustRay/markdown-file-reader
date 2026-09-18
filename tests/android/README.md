# Real-device picker regression

`picker-cancel.ps1` exercises the actual Android system picker, not a mocked bridge.
It caught the intermittent return-from-picker hang before the native result was
deferred to the next UI-queue turn.

Prerequisites: an authorized ADB device, the Android SDK under LOCALAPPDATA, and
the separate `com.ntustray.raymarkdownreader.qa` install. Keep the phone unlocked
and do not interact with it during the run.

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File tests/android/picker-cancel.ps1
```

Expected: six PASS lines (three Create cancellations, three Open cancellations).
The script restarts only the QA app, discarding any in-memory QA draft; it never
clears app data or touches the Play-installed package. It writes a temporary UI
hierarchy to `/sdcard/ray-qa-ui.xml`, but creates no document.

For local builds, set `applicationIdSuffix = ".qa"` and
`versionNameSuffix = "-qa"` in the generated Gradle **debug** build type. Recheck
the suffix after running the Tauri CLI, which can remove it. Build with Gradle
`assembleUniversalDebug` using the freshly compiled release JNI libraries and
`-x :app:rustBuildUniversalDebug`. Never upload the QA APK to Play.

The phone smoke test also checks real create/save/reopen, Unicode, duplicate
filenames, and unsaved-change decisions. Those results are in `docs/NEXT_SESSION.md`.
