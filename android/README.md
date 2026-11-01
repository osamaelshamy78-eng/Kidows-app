# Android app (TWA)

A Trusted Web Activity: a thin Android wrapper that opens https://mandm.mambz.com
full screen. App updates come from the website, so a new APK/AAB is only needed
to change the wrapper itself (name, icon, colours, version).

- Package name: `com.mambz.littlenoor` (permanent once on Google Play)
- Version: `appVersionCode` / `appVersionName` in `twa-manifest.json` and `app/build.gradle` — raise the code for every Play upload
- Generated with `@bubblewrap/core` 1.24.1 from the site's web manifest; `jcenter()` replaced with Google's Maven Central mirror

## Signing key

The upload key `little-noor-upload.keystore` (alias `littlenoor`) is **not in the repo**. The owner keeps it and its password. Losing it means asking Google Play support for an upload-key reset.

Its SHA-256 fingerprint is in `public/.well-known/assetlinks.json`, which lets the app open without a browser bar.

## Build

Needs JDK 17+ and the Android SDK (platform 36, build-tools 35).

```bash
cd android
echo "sdk.dir=/path/to/android-sdk" > local.properties
./gradlew assembleRelease bundleRelease
BT=/path/to/android-sdk/build-tools/35.0.0
$BT/zipalign -f -p 4 app/build/outputs/apk/release/app-release-unsigned.apk aligned.apk
$BT/apksigner sign --ks ../little-noor-upload.keystore --ks-key-alias littlenoor --out LittleNoor.apk aligned.apk
jarsigner -keystore ../little-noor-upload.keystore app/build/outputs/bundle/release/app-release.aab littlenoor
```

## Publishing to Google Play later

1. Upload the signed `.aab` and turn on **Play App Signing** (the default).
2. In Play Console → Setup → App signing, copy the **app signing key** SHA-256 and **add it** as a second fingerprint in `public/.well-known/assetlinks.json` (keep the upload key's one). Without it, the Play version shows a browser bar.
3. Fill in the Families policy, data safety form and privacy policy (the app has no ads, no sign-in and collects no personal data; Vercel Web Analytics is cookieless).
4. The Play version is signed by Google, so a phone with the sideloaded APK has to uninstall it before installing from Play.
