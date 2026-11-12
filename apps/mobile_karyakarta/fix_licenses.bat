@echo off
set "LIC_DIR=%LOCALAPPDATA%\Android\sdk\licenses"
if not exist "%LIC_DIR%" mkdir "%LIC_DIR%"

(
echo 8933bad161af4178b1185d1a37fbf41ea5269c55
echo d56f518747942e6750f13f13970f4323e8563dd0
echo 24333f8a63b68b44714860ea2fb86621104b548f
echo 84831b9409646a918e30573bab4c9c91346d8abd
echo 7c7840212049fa024626ff4ea0fb548c599185a0
echo 601085b94c277f54f80c3e164d0e60624994da82
echo 2788e78cb9873373f8685e1376e296e610655a30
) > "%LIC_DIR%\android-sdk-license"

(
echo 84831b9409646a918e30573bab4c9c91346d8abd
) > "%LIC_DIR%\android-sdk-preview-license"

(
echo 859f317696f67ef3d7f30a50a5560e7834b43903
) > "%LIC_DIR%\android-sdk-arm-dbt-license"

(
echo bbab632e8d356877964b4ec0a99679f2fe7fd75f
) > "%LIC_DIR%\m2repository-license"

echo [SUCCESS] All Android SDK licenses have been generated cleanly!
