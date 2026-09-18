$ErrorActionPreference = 'Stop'
$keyDirectory = Join-Path $env:USERPROFILE 'AndroidKeys'
$keyPath = Join-Path $keyDirectory 'ray-markdown-reader-upload-20260918.p12'
$certificatePath = Join-Path $keyDirectory 'ray-markdown-reader-upload-20260918.pem'
$keytool = Join-Path $env:JAVA_HOME 'bin/keytool.exe'
if (!(Test-Path -LiteralPath $keytool)) { throw 'JAVA_HOME must point to the installed JDK.' }
if (!(Test-Path -LiteralPath $keyDirectory)) {
    New-Item -ItemType Directory -Path $keyDirectory | Out-Null
}
if (!(Test-Path -LiteralPath $keyPath)) {
    Write-Host 'Set a NEW password at the keytool prompts. Save it in your password manager.'
    Write-Host 'Input is hidden. Do not send your password to chat.'
    & $keytool -genkeypair -keystore $keyPath -storetype PKCS12 -alias upload -keyalg RSA -keysize 4096 -validity 10000 -dname 'CN=Ray Markdown Reader Upload'
    if ($LASTEXITCODE -ne 0 -or !(Test-Path -LiteralPath $keyPath)) { throw 'Key creation did not complete.' }
} else {
    Write-Host 'Existing replacement keystore preserved; exporting its public certificate only.'
}
if (Test-Path -LiteralPath $certificatePath) {
    throw "Certificate already exists; no files were overwritten: $certificatePath"
}
Write-Host 'Enter the same NEW password once more to export the public certificate.'
& $keytool -exportcert -rfc -keystore $keyPath -alias upload -file $certificatePath
if ($LASTEXITCODE -ne 0 -or !(Test-Path -LiteralPath $certificatePath)) { throw 'Certificate export did not complete.' }
& $keytool -printcert -file $certificatePath
if ($LASTEXITCODE -ne 0) { throw 'Certificate verification failed.' }
Write-Host "READY: Upload only this public certificate to the Play reset form: $certificatePath"
Write-Host 'Keep the .p12 private. Back it up securely and save the password separately.'
