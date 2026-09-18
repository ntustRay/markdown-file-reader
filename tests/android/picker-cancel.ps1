param([string]$Package = 'com.ntustray.raymarkdownreader.qa')
$ErrorActionPreference = 'Stop'
$adb = Join-Path $env:LOCALAPPDATA 'Android/Sdk/platform-tools/adb.exe'
function Read-Ui {
    $output = & $adb shell uiautomator dump /sdcard/ray-qa-ui.xml
    if ($LASTEXITCODE -ne 0 -or $output -notmatch 'dumped to:') { throw 'UI dump failed' }
    [xml](& $adb shell cat /sdcard/ray-qa-ui.xml)
}
# Restart only the separate QA install; its in-memory draft will be discarded.
if ($Package -ne 'com.ntustray.raymarkdownreader.qa') { throw 'QA package required' }
& $adb shell am force-stop $Package
& $adb shell am start -n "$Package/com.ntustray.raymarkdownreader.MainActivity" | Out-Null
for ($attempt = 0; $attempt -lt 4; $attempt++) {
    $ui = Read-Ui
    $button = $ui.SelectSingleNode('//node[@resource-id="new-file"]')
    if ($null -ne $button) { break }
}
if ($null -eq $button) { throw 'New button not found' }
foreach ($buttonId in @('new-file', 'open-file')) {
    for ($round = 1; $round -le 3; $round++) {
        $button = $ui.SelectSingleNode("//node[@resource-id='$buttonId']")
        if ($null -eq $button -or $button.enabled -ne 'true') { throw "$buttonId is unavailable" }
        $coordinates = [regex]::Matches($button.bounds, '\d+') | ForEach-Object { [int]$_.Value }
        & $adb shell input tap ([int](($coordinates[0] + $coordinates[2]) / 2)) ([int](($coordinates[1] + $coordinates[3]) / 2))
        $ui = Read-Ui
        if ($null -ne $ui.SelectSingleNode('//node[@resource-id="new-file"]')) { throw 'Picker did not open' }
        for ($attempt = 0; $attempt -lt 3; $attempt++) {
            & $adb shell input keyevent 4
            $ui = Read-Ui
            $button = $ui.SelectSingleNode("//node[@resource-id='$buttonId']")
            if ($null -ne $button) { break }
        }
        if ($null -eq $button -or $button.enabled -ne 'true') { throw "FAIL: $buttonId cancel $round left controls disabled" }
        "PASS: $buttonId cancellation $round restores controls"
    }
}
