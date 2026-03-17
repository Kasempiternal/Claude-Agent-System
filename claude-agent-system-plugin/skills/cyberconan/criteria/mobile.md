# Mobile Vulnerability Criteria

20 vulnerability vectors for mobile applications (iOS Swift/ObjC, Android Kotlin/Java, React Native, Flutter). Each vector includes grep patterns for initial detection, validation logic to confirm real findings, and false positive signals to avoid noise.

---

## Category: Data Storage (HIGH-CRITICAL)

### Insecure Local Storage (MSTG-STORAGE-1)
**Severity**: HIGH
**Grep Candidates**: `UserDefaults`, `NSUserDefaults`, `SharedPreferences`, `getSharedPreferences(`, `putString(`, `getString(`, `edit()`, `.set(`, `.string(forKey:`, `AsyncStorage`, `@AppStorage`, `flutter_secure_storage`
**Validation**: Check if sensitive data (tokens, passwords, API keys, PII, session data, encryption keys) is stored in UserDefaults (iOS) or SharedPreferences (Android). These storage mechanisms are NOT encrypted and are accessible on jailbroken/rooted devices. In React Native, check AsyncStorage usage for secrets. Look for patterns like `UserDefaults.standard.set(token, forKey: "authToken")` or `sharedPrefs.edit().putString("password", password)`.
**False Positive Signals**: Non-sensitive data in UserDefaults/SharedPreferences (UI preferences, theme, language, onboarding state), sensitive data stored in Keychain/Keystore instead, flutter_secure_storage used (wraps Keychain/Keystore), encrypted storage wrappers.
**Remediation**: Store sensitive data in iOS Keychain or Android Keystore. Use `flutter_secure_storage` for Flutter, `react-native-keychain` for React Native. UserDefaults/SharedPreferences are only appropriate for non-sensitive app preferences. Never store tokens, passwords, or PII in plaintext local storage.

### Unencrypted Database
**Severity**: HIGH
**Grep Candidates**: `SQLite`, `openDatabase(`, `FMDB`, `Room`, `RoomDatabase`, `CoreData`, `NSPersistentContainer`, `Realm`, `realm.write`, `sqflite`, `objectbox`, `CREATE TABLE`, `INSERT INTO`
**Validation**: Check if local databases (SQLite, Core Data, Realm, Room) store sensitive data without encryption. Look for database schemas that include columns for tokens, passwords, personal data, financial data, or health data. Check if SQLCipher, Realm encryption, or equivalent is configured.
**False Positive Signals**: SQLCipher configured with encryption key from Keychain/Keystore, Realm encryption enabled (encryptionKey parameter), Room with SQLCipher integration, Core Data with encrypted store, database contains only non-sensitive cached data.
**Remediation**: Encrypt local databases with SQLCipher (SQLite), Realm encryption, or Core Data encrypted persistent store. Store the encryption key in iOS Keychain or Android Keystore, never hardcoded. For Room (Android): use `SupportFactory` with SQLCipher. Alternatively, avoid storing sensitive data locally.

### Keychain/Keystore Misuse
**Severity**: HIGH
**Grep Candidates**: `kSecAttrAccessible`, `SecItemAdd(`, `SecItemCopyMatching(`, `KeyStore`, `KeyGenParameterSpec`, `kSecAttrAccessibleAlways`, `kSecAttrAccessibleAfterFirstUnlock`, `setUserAuthenticationRequired`, `BiometricPrompt`, `LAContext`
**Validation**: Check iOS Keychain accessibility level: `kSecAttrAccessibleAlways` makes data accessible even when device is locked (weakest). Check Android Keystore configuration: missing `setUserAuthenticationRequired(true)` for sensitive keys. Look for Keychain items without proper access control flags.
**False Positive Signals**: `kSecAttrAccessibleWhenUnlockedThisDeviceOnly` (strongest iOS), `kSecAttrAccessibleAfterFirstUnlockThisDeviceOnly` (acceptable), Android Keystore with `setUserAuthenticationRequired(true)` and `setUserAuthenticationValidityDurationSeconds()`, proper biometric binding.
**Remediation**: iOS: Use `kSecAttrAccessibleWhenUnlockedThisDeviceOnly` for most sensitive data. Add `kSecAttrAccessControl` with `.biometryCurrentSet` for biometric-protected items. Android: Set `setUserAuthenticationRequired(true)` on KeyGenParameterSpec. Use `setUserAuthenticationValidityDurationSeconds(0)` for per-use authentication.

### Backup Exposure
**Severity**: MEDIUM
**Grep Candidates**: `allowBackup`, `android:allowBackup`, `NSURLIsExcludedFromBackupKey`, `isExcludedFromBackup`, `BackupAgent`, `kSecAttrAccessible`, `ThisDeviceOnly`, `addResourceValues(`, `FileProtection`
**Validation**: Check if sensitive application data is included in device backups (iCloud, Google backups, iTunes). Android: `android:allowBackup="true"` in AndroidManifest.xml (default is true). iOS: check if sensitive files have `NSURLIsExcludedFromBackupKey` set to true. Keychain items without `ThisDeviceOnly` are included in iCloud backups.
**False Positive Signals**: `android:allowBackup="false"`, sensitive files excluded from backup, Keychain items use `ThisDeviceOnly` accessibility, custom BackupAgent that excludes sensitive data, no sensitive data stored in filesystem.
**Remediation**: Android: Set `android:allowBackup="false"` or implement a custom BackupAgent that excludes sensitive data. iOS: Set `NSURLIsExcludedFromBackupKey` on sensitive files. Use `ThisDeviceOnly` Keychain accessibility levels. Encrypt sensitive data before storage regardless of backup settings.

---

## Category: Network Security (HIGH)

### Certificate Pinning Missing/Bypass
**Severity**: HIGH
**Grep Candidates**: `TrustManager`, `X509TrustManager`, `checkServerTrusted`, `SSLSocketFactory`, `HostnameVerifier`, `URLSessionDelegate`, `didReceive challenge`, `serverTrust`, `NSAppTransportSecurity`, `NSExceptionDomains`, `ssl_pinning`, `CertificatePinner`, `TrustKit`, `NetworkSecurityConfig`
**Validation**: Check if the application implements certificate pinning for API connections. Look for: (1) No pinning implementation at all, (2) Custom TrustManager that accepts all certificates, (3) Empty checkServerTrusted() method, (4) HostnameVerifier that returns true for all hostnames, (5) URLSession delegate that always calls completionHandler with .useCredential. Financial and healthcare apps especially need pinning.
**False Positive Signals**: TrustKit configured with correct pins, OkHttp CertificatePinner with valid pins, NSAppTransportSecurity with proper pin configuration, network_security_config.xml with pin-set, custom TrustManager that properly validates against pinned certificates.
**Remediation**: Implement certificate pinning using TrustKit (iOS/Android), OkHttp CertificatePinner (Android), or URLSession with pinned certificates (iOS). Pin to the intermediate CA certificate (not leaf) for easier rotation. Implement pin rotation strategy with backup pins. Use network_security_config.xml on Android.

### Cleartext Traffic
**Severity**: HIGH
**Grep Candidates**: `http://`, `NSAllowsArbitraryLoads`, `NSExceptionAllowsInsecureHTTPLoads`, `cleartextTrafficPermitted`, `usesCleartextTraffic`, `android:usesCleartextTraffic`, `NSAppTransportSecurity`, `network_security_config`
**Validation**: Check for HTTP (non-HTTPS) URLs in API calls and network configuration. iOS: Look for `NSAllowsArbitraryLoads: true` in Info.plist (disables ATS). Android: Check `android:usesCleartextTraffic="true"` in AndroidManifest.xml or `cleartextTrafficPermitted="true"` in network_security_config.xml. Search for hardcoded `http://` URLs in API base configurations.
**False Positive Signals**: `http://localhost` or `http://10.0.2.2` (development only), ATS exceptions limited to specific debug domains, network security config restricts cleartext to development domains only, HTTP URLs used only for non-sensitive public resources (images from CDN).
**Remediation**: Use HTTPS for all network communication. iOS: Do not set `NSAllowsArbitraryLoads: true` — configure per-domain exceptions only if absolutely needed. Android: Set `android:usesCleartextTraffic="false"` in manifest and use network_security_config.xml for any exceptions. Replace all `http://` API URLs with `https://`.

### Custom SSL/TLS Validation
**Severity**: CRITICAL
**Grep Candidates**: `TrustManager`, `X509TrustManager`, `checkServerTrusted`, `SSLContext`, `SSLSocketFactory`, `ALLOW_ALL`, `TrustAllCerts`, `InsecureTrustManager`, `disable_ssl`, `verify=False`, `CERT_NONE`
**Validation**: Check for custom SSL/TLS trust managers that bypass certificate validation. The most critical pattern is an empty `checkServerTrusted()` method or one that never throws — this accepts ANY certificate including attacker-controlled ones. Look for `TrustManager` implementations where checkServerTrusted() has no validation logic.
**False Positive Signals**: Custom TrustManager that properly validates certificates against pinned certs, debug-only trust-all configuration with proper build type checks, test code (not production), library code that provides opt-in custom validation.
**Remediation**: Never implement custom TrustManagers that skip validation. Remove any all-trusting TrustManager implementations. Use the platform default trust store. If custom validation is needed (certificate pinning), ensure it is MORE restrictive than defaults, not less. Use build flavors/schemes to ensure debug SSL bypasses never reach production.

---

## Category: Authentication (HIGH)

### Biometric Authentication Bypass
**Severity**: HIGH
**Grep Candidates**: `LAContext`, `evaluatePolicy`, `BiometricPrompt`, `biometricAuthenticate`, `deviceCredentialAllowed`, `canEvaluatePolicy`, `LocalAuthentication`, `FingerprintManager`, `kSecAccessControlBiometryAny`, `kSecAccessControlBiometryCurrentSet`
**Validation**: Check for biometric authentication implementations that: (1) Fall back to weak device PIN after biometric failure, (2) Use event-based biometric (just check success/failure) without cryptographic binding, (3) Do not bind authentication to a Keychain/Keystore cryptographic operation, (4) Allow unlimited retries, (5) Use `kSecAccessControlBiometryAny` (survives biometric enrollment changes) instead of `kSecAccessControlBiometryCurrentSet`.
**False Positive Signals**: Biometric auth bound to Keychain/Keystore key that performs cryptographic operation on success, `kSecAccessControlBiometryCurrentSet` used, no fallback to weak alternatives, server-side session bound to biometric authentication event.
**Remediation**: Bind biometric authentication to a cryptographic operation (Keychain item retrieval or Keystore key signing). Use `kSecAccessControlBiometryCurrentSet` on iOS. On Android, use `BiometricPrompt` with `CryptoObject`. Do not rely on the boolean result of biometric check alone — require a cryptographic proof.

### Insecure Token Storage
**Severity**: HIGH
**Grep Candidates**: `access_token`, `refresh_token`, `auth_token`, `bearer`, `Authorization`, `localStorage`, `AsyncStorage`, `UserDefaults`, `SharedPreferences`, `setItem(`, `putString(`
**Validation**: Check where authentication tokens (access tokens, refresh tokens, API keys) are stored after login. Insecure if stored in: SharedPreferences, UserDefaults, AsyncStorage, plain files, or SQLite without encryption. Tokens should be in Keychain (iOS) or Keystore (Android) or secure storage wrappers.
**False Positive Signals**: Tokens stored in iOS Keychain (SecItemAdd), Android EncryptedSharedPreferences or Keystore, react-native-keychain, flutter_secure_storage, tokens exist only in memory (not persisted).
**Remediation**: Store tokens in iOS Keychain with appropriate accessibility level. On Android, use EncryptedSharedPreferences or store in Keystore-backed storage. For React Native, use react-native-keychain. For Flutter, use flutter_secure_storage. Never persist tokens in UserDefaults, SharedPreferences, or AsyncStorage.

### Session Management Issues
**Severity**: HIGH
**Grep Candidates**: `session`, `timeout`, `expir`, `logout`, `signOut`, `invalidate`, `revoke`, `token`, `refresh`, `maxAge`, `idle`
**Validation**: Check for: (1) No session timeout (tokens or sessions persist indefinitely), (2) Tokens not revoked on logout (client deletes token but server still accepts it), (3) Missing refresh token rotation (same refresh token reused indefinitely), (4) No server-side session invalidation on password change, (5) Parallel sessions not managed (user cannot see/revoke other sessions).
**False Positive Signals**: Token expiration configured (short-lived access tokens), refresh token rotation implemented, server-side token revocation on logout, session invalidation on password change, session listing and remote revocation available.
**Remediation**: Set short expiration on access tokens (15-30 minutes). Implement refresh token rotation (issue new refresh token on each refresh, invalidate old). Revoke all tokens on password change. Implement server-side token blacklist or session store with revocation support. Add session timeout for idle users.

---

## Category: Platform-Specific (MEDIUM-HIGH)

### Deep Link Hijack
**Severity**: HIGH
**Grep Candidates**: `CFBundleURLSchemes`, `CFBundleURLTypes`, `intent-filter`, `android:scheme`, `android:host`, `deeplink`, `universal link`, `app link`, `applinks:`, `pathPattern`, `handleURL`, `openURL`, `NavigationDeepLink`
**Validation**: Check if deep link handlers validate parameters before processing. Look for: (1) Custom URL schemes without parameter validation, (2) Universal/App Links with broad path patterns, (3) Deep link handlers that navigate to arbitrary internal screens, (4) Deep link parameters used in sensitive operations (authentication, payments) without validation. Custom URL schemes are claimable by any app (not verified).
**False Positive Signals**: Universal Links / App Links used (domain-verified, harder to hijack), deep link parameters validated and sanitized, deep links only navigate to public content, deep link handler requires authenticated session before processing.
**Remediation**: Use Universal Links (iOS) or App Links (Android) instead of custom URL schemes — they are domain-verified. Validate all deep link parameters. Do not pass sensitive data through deep links. Require authentication before processing deep links to sensitive screens. Use AASA (apple-app-site-association) and assetlinks.json properly.

### WebView JavaScript Bridge
**Severity**: HIGH
**Grep Candidates**: `WKWebView`, `UIWebView`, `WebView`, `addJavascriptInterface(`, `evaluateJavaScript(`, `WKScriptMessageHandler`, `@JavascriptInterface`, `shouldOverrideUrlLoading`, `webView.loadUrl("javascript:`, `WebViewClient`, `javaScriptEnabled`, `postMessage(`
**Validation**: Check for WebViews that: (1) Load untrusted content (user URLs, third-party content) with JavaScript enabled, (2) Expose native functions via JavaScript bridge (@JavascriptInterface, WKScriptMessageHandler) without proper origin validation, (3) Use `evaluateJavaScript()` with user-controlled strings, (4) Use deprecated UIWebView (iOS — inherently less secure). Look for native functions exposed to JS that access filesystem, camera, contacts, or other sensitive APIs.
**False Positive Signals**: WebView loads only trusted first-party content, JavaScript bridge restricted to specific trusted origins, @JavascriptInterface methods validate caller, JavaScript disabled for untrusted content, WKWebView with proper configuration (not UIWebView).
**Remediation**: Use WKWebView (not UIWebView) on iOS. Validate the origin of messages received via JavaScript bridge. Minimize native functions exposed to JavaScript. Disable JavaScript for WebViews loading untrusted content. Use `allowsInlineMediaPlayback` and other configuration options to restrict WebView capabilities. Never use `loadUrl("javascript:...")` with user input.

### Intent Hijack (Android)
**Severity**: HIGH
**Grep Candidates**: `intent-filter`, `exported`, `android:exported`, `BroadcastReceiver`, `ContentProvider`, `sendBroadcast(`, `registerReceiver(`, `startActivity(`, `startService(`, `bindService(`, `getIntent(`, `getExtras(`, `getStringExtra(`, `grantUriPermissions`
**Validation**: Check Android manifest for exported components (activities, services, receivers, providers) without proper permission protection. Look for: (1) `android:exported="true"` without `android:permission`, (2) Intent filters without explicit `exported="false"`, (3) BroadcastReceivers for sensitive operations without `android:permission`, (4) ContentProviders with `grantUriPermissions` and broad path patterns. On API 31+, components with intent filters are exported by default.
**False Positive Signals**: Components protected with custom permissions (android:permission), signature-level permissions required, components intentionally public (launcher activity, share targets), LocalBroadcastManager used (not exported), ContentProvider with proper URI permission grants.
**Remediation**: Set `android:exported="false"` on all components that don't need external access. Protect exported components with `android:permission` using signature-level custom permissions. Use LocalBroadcastManager for internal broadcasts. Validate all Intent extras from external sources. Set granular URI permissions on ContentProviders.

### IPC Vulnerabilities
**Severity**: MEDIUM
**Grep Candidates**: `ContentProvider`, `ContentResolver`, `BroadcastReceiver`, `UIPasteboard`, `NSExtensionContext`, `openURL`, `canOpenURL`, `LSApplicationQueriesSchemes`, `XPC`, `NSXPCConnection`, `Binder`, `AIDL`, `Messenger`
**Validation**: Check inter-process communication for: (1) Content Providers exposing sensitive data without permission checks, (2) Broadcast Receivers processing intents without origin validation, (3) iOS URL scheme handlers accepting unvalidated parameters, (4) Clipboard/pasteboard used for sensitive data transfer (accessible to all apps on older OS versions), (5) XPC services without proper entitlement checks.
**False Positive Signals**: Proper permission checks on all IPC endpoints, signature-level permissions, iOS app groups with proper entitlements, content provider with proper SQL injection prevention (parameterized queries).
**Remediation**: Protect all IPC endpoints with appropriate permissions. Validate all data received via IPC. Use signature-level permissions for sensitive IPC. On iOS, validate URL scheme parameters. Avoid using clipboard for sensitive data. Use encrypted communication channels for sensitive IPC.

### Clipboard Exposure
**Severity**: MEDIUM
**Grep Candidates**: `UIPasteboard`, `generalPasteboard`, `ClipboardManager`, `setPrimaryClip`, `getPrimaryClip`, `clipboard`, `copy`, `paste`, `Clipboard.setData`, `Clipboard.getData`
**Validation**: Check if sensitive data (passwords, tokens, credit card numbers, OTPs) is copied to the system clipboard. On older OS versions, any app can read clipboard content. Look for password fields allowing copy, OTP auto-copy functionality, or explicit clipboard operations with sensitive data.
**False Positive Signals**: Local clipboard (UIPasteboard with localOnly: true on iOS 10+), clipboard cleared after short timeout, iOS 14+ clipboard access notifications (user sees when apps read clipboard), non-sensitive data only.
**Remediation**: Prevent copying from sensitive fields (password, credit card). If clipboard must be used (OTPs), clear it after a short timeout (30-60 seconds). On iOS, use local pasteboard (UIPasteboard.withUniqueName()). On Android, use ClipboardManager.clearPrimaryClip() after timeout. Show user notification when sensitive data is copied.

### Screenshot/Screen Capture Prevention Missing
**Severity**: MEDIUM
**Grep Candidates**: `FLAG_SECURE`, `LayoutParams.FLAG_SECURE`, `isSecure`, `UITextField.isSecureTextEntry`, `secureTextEntry`, `willResignActive`, `didEnterBackground`, `screenshotObserver`, `userDidTakeScreenshot`, `SurfaceView`
**Validation**: Check if screens displaying sensitive information (banking, health, authentication, personal data) prevent screenshot and screen recording. Android: Look for missing FLAG_SECURE on sensitive activities. iOS: Check if app obscures content on app switcher (applicationWillResignActive). Look for sensitive data visible in app previews (recent apps screen).
**False Positive Signals**: FLAG_SECURE set on sensitive activities, content obscured in app switcher (blur overlay on applicationWillResignActive), DRM-protected content (SurfaceView on Android), app does not display highly sensitive data.
**Remediation**: Android: Add `getWindow().setFlags(WindowManager.LayoutParams.FLAG_SECURE, WindowManager.LayoutParams.FLAG_SECURE)` to sensitive activities. iOS: In `applicationWillResignActive`, add a blur/overlay view to hide content. Listen for screenshot notifications to alert the user. Use isSecureTextEntry for password fields.

### Debug Logging in Release Builds
**Severity**: MEDIUM
**Grep Candidates**: `NSLog(`, `print(`, `debugPrint(`, `Log.d(`, `Log.v(`, `Log.i(`, `console.log(`, `System.out.println(`, `Timber.d(`, `logger.debug(`, `BuildConfig.DEBUG`, `#if DEBUG`, `#ifdef DEBUG`
**Validation**: Check if debug logging statements that output sensitive information are present in release-mode code paths. Look for: (1) Log statements containing tokens, passwords, user data, API responses, (2) Logging not conditionally disabled in release builds, (3) Verbose/debug log levels active in production configuration. On Android, logcat is accessible to other apps on older devices.
**False Positive Signals**: Logging wrapped in `#if DEBUG` / `#ifdef DEBUG` blocks, Timber with release tree that strips debug logs, ProGuard/R8 rules stripping log calls, custom logger that checks build configuration, log statements that only output non-sensitive data (screen names, timing).
**Remediation**: Wrap all debug logging in conditional compilation: `#if DEBUG` (Swift), `if (BuildConfig.DEBUG)` (Android). Use Timber (Android) with a release tree that strips debug/verbose logs. Add ProGuard rules to strip Log.d/Log.v calls. Never log sensitive data even in debug builds. Use a structured logging framework with configurable levels.

### Root/Jailbreak Detection Missing
**Severity**: MEDIUM
**Grep Candidates**: `isJailbroken`, `isRooted`, `RootBeer`, `rootDetection`, `jailbreakDetection`, `canOpenURL`, `cydia://`, `su`, `/system/app/Superuser`, `checkRoot`, `SafetyNet`, `Play Integrity`, `DeviceCheck`, `App Attest`
**Validation**: Check if the application detects rooted/jailbroken devices for sensitive operations (banking, healthcare, enterprise). Look for: (1) No root/jailbreak detection at all, (2) Detection only at startup (bypassable with runtime hooking), (3) Detection result stored in a modifiable location, (4) No server-side verification (client-side only). Higher-risk apps (financial, healthcare, enterprise MDM) require stronger detection.
**False Positive Signals**: RootBeer (Android) or equivalent library integrated, multiple detection methods used (file checks, system properties, binary checks), server-side device attestation (SafetyNet/Play Integrity on Android, App Attest/DeviceCheck on iOS), detection performed before each sensitive operation (not just at startup), app is low-risk and does not handle sensitive data.
**Remediation**: Implement multi-layer root/jailbreak detection: file system checks (/Applications/Cydia.app, /system/app/Superuser), binary checks (su, ssh), symbolic link checks, sandboxing checks. Use server-side attestation (Play Integrity API on Android, App Attest on iOS). Perform checks before sensitive operations, not just at startup. Consider obfuscating detection logic to resist reverse engineering.
