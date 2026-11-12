$licDir = "$env:LOCALAPPDATA\Android\sdk\licenses"
if (!(Test-Path $licDir)) {
    New-Item -ItemType Directory -Force -Path $licDir | Out-Null
}

$hashes = @"
8933bad161af4178b1185d1a37fbf41ea5269c55
d56f518747942e6750f13f13970f4323e8563dd0
24333f8a63b68b44714860ea2fb86621104b548f
84831b9409646a918e30573bab4c9c91346d8abd
7c7840212049fa024626ff4ea0fb548c599185a0
601085b94c277f54f80c3e164d0e60624994da82
2788e78cb9873373f8685e1376e296e610655a30
"@

[System.IO.File]::WriteAllText("$licDir\android-sdk-license", $hashes.Trim(), [System.Text.Encoding]::ASCII)
[System.IO.File]::WriteAllText("$licDir\android-sdk-preview-license", "84831b9409646a918e30573bab4c9c91346d8abd", [System.Text.Encoding]::ASCII)
[System.IO.File]::WriteAllText("$licDir\android-sdk-arm-dbt-license", "859f317696f67ef3d7f30a50a5560e7834b43903", [System.Text.Encoding]::ASCII)
[System.IO.File]::WriteAllText("$licDir\m2repository-license", "bbab632e8d356877964b4ec0a99679f2fe7fd75f", [System.Text.Encoding]::ASCII)

Write-Host ""
Write-Host "[SUCCESS] All Android SDK licenses have been written in raw ASCII encoding!" -ForegroundColor Green
Write-Host "Now run: flutter build apk --debug" -ForegroundColor Cyan
