# Frontend Vulnerability Criteria

15 vulnerability vectors for client-side applications (React, Vue, Angular, Svelte, vanilla JS). Each vector includes grep patterns for initial detection, validation logic to confirm real findings, and false positive signals to avoid noise.

---

## Category: Cross-Site Scripting (HIGH-CRITICAL)

### DOM XSS (CWE-79)
**Severity**: CRITICAL
**Grep Candidates**: `innerHTML`, `outerHTML`, `document.writeln(`, `v-html`, `[innerHTML]`, `insertAdjacentHTML(`, `createContextualFragment(`, `DOMParser().parseFromString(`
**Validation**: Confirm user-controlled data flows into DOM manipulation sinks. Also search for `document` followed by `.write(` as a single call — this is a classic DOM XSS sink. Search for React's `dangerouslySetInnerHTML` prop (camelCase in JSX). Trace the data from sources (location.hash, location.search, document.referrer, window.name, postMessage data, URL parameters, user-generated content from APIs) to the sink. The critical question: can an attacker control the string that gets parsed as HTML?
**False Positive Signals**: Static HTML strings (no user data), content sanitized with DOMPurify.sanitize() before insertion, React JSX (auto-escapes by default), Angular template binding (auto-escapes via double-curly), framework-sanitized bindings, innerHTML set to text-only content (no HTML parsing needed).
**Remediation**: Use textContent instead of innerHTML for text. When HTML rendering is required, sanitize with DOMPurify. In React: avoid the dangerouslySetInnerHTML prop; if unavoidable, sanitize first. In Vue: avoid v-html with user data. In Angular: use DomSanitizer with bypassSecurityTrustHtml only after custom sanitization.

### Reflected XSS (CWE-79)
**Severity**: HIGH
**Grep Candidates**: `location.search`, `location.hash`, `location.href`, `URLSearchParams(`, `document.URL`, `document.referrer`, `window.name`, `new URL(`, `url.searchParams`, `req.query`, `req.params`
**Validation**: Check if URL parameters, hash fragments, or other reflected input is rendered into the page without encoding. In server-rendered apps, check if query parameters are included in HTML responses without escaping. In SPAs, check if URL-derived data is inserted into the DOM unsafely.
**False Positive Signals**: Framework auto-escaping (React JSX, Angular templates, Vue mustache syntax), URL parameter used only for logic (not rendering), explicit HTML encoding applied, CSP blocking inline scripts.
**Remediation**: Use framework auto-escaping (never bypass it). For server-rendered pages, HTML-encode all user input before including in responses. Implement Content-Security-Policy to prevent inline script execution as defense-in-depth. Validate and sanitize all URL-derived input before rendering.

### Stored XSS (CWE-79)
**Severity**: CRITICAL
**Grep Candidates**: `innerHTML`, `v-html`, `[innerHTML]`, `markdown`, `renderMarkdown`, `marked(`, `showdown`, `sanitize`, `DOMPurify`, `rich-text`, `wysiwyg`, `editor`, `comment`, `message`, `post`, `description`, `bio`, `profile`
**Validation**: Identify where user-generated content (comments, posts, profiles, messages, descriptions) is stored and later rendered. Check if the rendering pipeline sanitizes HTML. Look for user content flowing from database to rendered HTML for other users. If content is rendered with innerHTML/v-html without sanitization, this is stored XSS.
**False Positive Signals**: DOMPurify.sanitize() applied before rendering, markdown rendered with sanitization enabled (marked with sanitize option), server-side HTML sanitization (bleach in Python, sanitize-html in Node.js), content stored as plaintext and rendered with textContent.
**Remediation**: Sanitize user content at render time (not just at storage) with DOMPurify. For markdown, use a renderer with HTML sanitization enabled. Implement CSP as defense-in-depth. Consider storing content as markdown/plaintext and rendering safely rather than storing raw HTML.

### Mutation XSS (mXSS)
**Severity**: HIGH
**Grep Candidates**: `DOMPurify`, `sanitize-html`, `xss`, `sanitize(`, `<math`, `<svg`, `<table`, `<noscript`, `<style`, `<select`, `namespace`, `foreignObject`
**Validation**: Check if the application uses an older or misconfigured HTML sanitizer that can be bypassed via browser DOM mutation. mXSS occurs when sanitized HTML mutates during DOM insertion - the browser reinterprets elements differently than the sanitizer expected. Look for: (1) Outdated DOMPurify (< 3.0), (2) Custom sanitizers (almost always bypassable), (3) innerHTML assignment of sanitized content in unusual DOM contexts (SVG, MathML, table).
**False Positive Signals**: Latest DOMPurify version with default config, server-side sanitization followed by textContent rendering, no user HTML rendering at all, CSP script-src without unsafe-inline.
**Remediation**: Keep DOMPurify updated to latest version. Use DOMPurify with default configuration (do not weaken it). Avoid custom sanitizers. Consider using DOMPurify RETURN_DOM or RETURN_DOM_FRAGMENT for safer insertion. Set CSP script-src without unsafe-inline as defense-in-depth.

---

## Category: Client-Side Attacks (MEDIUM-HIGH)

### Prototype Pollution (CWE-1321)
**Severity**: HIGH
**Grep Candidates**: `__proto__`, `constructor.prototype`, `Object.assign(`, `_.merge(`, `_.defaultsDeep(`, `$.extend(`, `deepMerge(`, `deepCopy(`, `JSON.parse(`, `Object.defineProperty(`
**Validation**: Check if user-controlled objects (from query parameters, JSON bodies, URL parameters) are passed to deep merge, deep clone, or recursive object manipulation functions. The attack injects __proto__ or constructor.prototype properties that pollute the global Object prototype. Look for: (1) Deep merge with user objects, (2) lodash merge/defaultsDeep with user input, (3) jQuery extend(true, {}, userObj), (4) Custom recursive merge functions.
**False Positive Signals**: Object.freeze() on prototypes, Map/Set used instead of plain objects, input validated to reject __proto__ and constructor keys, modern lodash (>= 4.17.12 patches some vectors but not all), Object.create(null) for target objects.
**Remediation**: Sanitize object keys: reject __proto__, constructor, and prototype before merging. Use Object.create(null) for target objects in merge operations. Use Map instead of plain objects for user data. Keep lodash and similar libraries updated. Freeze Object.prototype in security-critical applications.

### CSS Injection
**Severity**: MEDIUM
**Grep Candidates**: `style=`, `style:`, `cssText`, `setAttribute('style'`, `setProperty(`, `backgroundImage`, `background:`, `url(`, `expression(`, `behavior:`, `@import`, `:style`
**Validation**: Check if user input is used in CSS context: inline style attributes, dynamic style elements, CSS custom properties. CSS injection can exfiltrate data via background-image URL, attribute selectors, and font-face unicode-range. Look for element.style.cssText = userInput or style={{ background: userInput }}.
**False Positive Signals**: Static CSS classes (className from allowlist), CSS-in-JS with proper escaping (styled-components, emotion), CSS modules, style values validated against allowlist (only accepting specific colors, sizes).
**Remediation**: Never use user input directly in CSS. Use CSS classes from an allowlist instead of dynamic styles. If dynamic styles are needed, validate against a strict allowlist of values. Sanitize CSS with a CSS parser that strips dangerous properties (url(), expression(), @import).

### Open Redirect (CWE-601)
**Severity**: MEDIUM
**Grep Candidates**: `window.location`, `location.href`, `location.assign(`, `location.replace(`, `window.open(`, `navigate(`, `router.push(`, `$router.push(`, `history.push(`, `next=`, `returnUrl`, `redirect`, `url=`
**Validation**: Check if user-controlled values (URL parameters, hash fragments, form inputs) are used to set window.location or navigate. Look for patterns where a URL parameter like ?redirect=... is read and used as navigation target. Attackers can redirect users to phishing sites.
**False Positive Signals**: URL validated to start with / (relative path only), URL parsed and hostname checked against allowlist, navigation to hardcoded routes, router navigation within the SPA (internal routes only).
**Remediation**: For redirects: only allow relative paths (must start with /, reject //). If external URLs are needed, validate against strict domain allowlist. Parse the URL and verify hostname before redirecting. Never use raw user input as navigation target.

### postMessage Abuse
**Severity**: HIGH
**Grep Candidates**: `addEventListener('message'`, `addEventListener("message"`, `onmessage`, `postMessage(`, `event.data`, `event.origin`, `e.origin`, `e.data`
**Validation**: Check message event handlers for: (1) Missing origin check (no event.origin validation), (2) Weak origin check (substring match instead of exact), (3) Data from message used in dangerous sinks (innerHTML, eval, location). Also check if postMessage sends sensitive data without specifying target origin (using * instead of specific origin).
**False Positive Signals**: Strict origin check (event.origin === 'https://trusted.example.com'), message data validated/typed before use, communication between same-origin frames only, postMessage with specific targetOrigin (not *).
**Remediation**: Always validate event.origin against exact allowlisted origins (not substring/regex). Type-check and validate event.data before use. When sending: specify exact target origin instead of *. Never pass message data to eval, innerHTML, or location without validation.

### DOM Clobbering
**Severity**: MEDIUM
**Grep Candidates**: `document.getElementById(`, `document.forms`, `document.anchors`, `document.images`, `id=`, `name=`, `getElementById`, `getElementsByName`, `window.`
**Validation**: Check if user-controlled HTML (even sanitized) can set id or name attributes that collide with JavaScript variable names or DOM API properties. DOM clobbering occurs when HTML elements with specific id/name attributes override JavaScript globals or DOM collection properties. Look for code that accesses global variables or DOM properties that could be shadowed by user-injected elements.
**False Positive Signals**: No user HTML rendering, DOMPurify with SANITIZE_DOM (default on), content rendered in shadow DOM (isolated scope), strict CSP preventing inline handlers.
**Remediation**: Use DOMPurify with default config (SANITIZE_DOM is on by default). Avoid relying on global DOM properties (document.forms, window.x). Use explicit getElementById() with null checks. Use variable declarations (const/let) that cannot be shadowed by DOM elements.

---

## Category: Client-Side Security (MEDIUM)

### Client-Side Authorization Decisions
**Severity**: HIGH
**Grep Candidates**: `isAdmin`, `user.role`, `role ===`, `permission`, `canAccess`, `authorized`, `v-if="user.admin"`, `{isAdmin &&`, `*ngIf="user.role`, `hasPermission(`, `checkRole(`
**Validation**: Check if security-critical decisions (showing admin UI, enabling dangerous operations, revealing sensitive data) are made purely in client-side JavaScript based on client-stored state (localStorage, cookies, JS variables). If the server does not independently enforce the same checks, this is a vulnerability - the client-side check can be bypassed by modifying JS variables or making direct API calls.
**False Positive Signals**: Client-side checks used only for UX (hiding UI elements) with server-side enforcement on all API calls, role data comes from verified JWT decoded server-side, same authorization middleware on all backend endpoints.
**Remediation**: Every authorization decision must be enforced server-side. Client-side role checks are acceptable only for UX purposes (showing/hiding UI elements), never for security. Ensure all API endpoints independently verify authorization regardless of what the frontend displays.

### Sensitive Data in Client Storage
**Severity**: HIGH
**Grep Candidates**: `localStorage.setItem(`, `localStorage.getItem(`, `sessionStorage.setItem(`, `sessionStorage.getItem(`, `IndexedDB`, `openDatabase(`, `window.localStorage`, `window.sessionStorage`
**Validation**: Check what data is stored in localStorage/sessionStorage. Look for: (1) Authentication tokens (JWT, session tokens), (2) PII (email, name, address), (3) API keys, (4) Financial data, (5) Passwords or password hashes. localStorage is accessible to any XSS attack and persists indefinitely.
**False Positive Signals**: Non-sensitive data (UI preferences, theme, language), encrypted data with key not in client, session tokens in httpOnly cookies (not localStorage), temporary data cleared on logout.
**Remediation**: Never store sensitive tokens in localStorage (vulnerable to XSS). Use httpOnly secure cookies for authentication tokens. If client storage is needed for non-auth data, encrypt sensitive values. Clear stored data on logout. Use sessionStorage instead of localStorage for session-scoped data.

### Missing Content Security Policy
**Severity**: MEDIUM
**Grep Candidates**: `Content-Security-Policy`, `CSP`, `meta http-equiv`, `script-src`, `style-src`, `default-src`, `unsafe-inline`, `unsafe-eval`, `nonce`, `strict-dynamic`
**Validation**: Check if the application sets a Content-Security-Policy header or meta tag. Evaluate the policy strength: (1) Does it exist at all? (2) Does it use unsafe-inline for script-src? (3) Does it use unsafe-eval? (4) Is default-src set to a restrictive value? (5) Are there overly broad sources (*.example.com, data:, blob:)?
**False Positive Signals**: Strong CSP with nonce-based or hash-based script loading, strict-dynamic in use, report-only mode as stepping stone (not final), CSP set at CDN/proxy level (not visible in code), development-only weak CSP with production override.
**Remediation**: Implement a strict CSP. Start with report-only mode and iterate. Target policy: default-src 'self'; script-src 'nonce-{random}' 'strict-dynamic'; style-src 'self' 'nonce-{random}'; img-src 'self' data:; font-src 'self'; connect-src 'self' https://api.example.com; frame-ancestors 'none'.

### Clickjacking (CWE-1021)
**Severity**: MEDIUM
**Grep Candidates**: `X-Frame-Options`, `frame-ancestors`, `DENY`, `SAMEORIGIN`, `frameborder`, `iframe`, `embed`, `object`
**Validation**: Check if the application can be framed by malicious sites. Look for missing X-Frame-Options header and missing CSP frame-ancestors directive. Sensitive pages (login, account settings, payment) are primary targets for clickjacking.
**False Positive Signals**: X-Frame-Options: DENY set, CSP frame-ancestors: 'self' or 'none', application intentionally embeddable (widget, OAuth), reverse proxy sets the header.
**Remediation**: Set X-Frame-Options: DENY (or SAMEORIGIN if framing within same origin is needed). Better: use CSP frame-ancestors: 'none' (or 'self'). Apply to all pages, especially sensitive ones (login, settings, payment). Note: frame-ancestors in CSP supersedes X-Frame-Options.

### CORS Misconfiguration (Client-Side)
**Severity**: MEDIUM
**Grep Candidates**: `Access-Control-Allow-Origin`, `withCredentials`, `credentials: 'include'`, `credentials: true`, `crossOrigin`, `mode: 'cors'`, `mode: 'no-cors'`
**Validation**: Check client-side requests for CORS misuse: (1) mode: 'no-cors' hides errors but sends cookies (opaque responses, potential data leaks), (2) credentials: 'include' with broad server CORS (allows cross-site authenticated requests), (3) Cross-origin requests to untrusted APIs without response validation. Also check if CORS errors are suppressed in ways that hide real security issues.
**False Positive Signals**: Requests to same-origin API, requests to trusted first-party APIs with proper CORS, credentials not included for public APIs, proxy or gateway handles CORS transparently.
**Remediation**: Only use credentials: 'include' for trusted same-site or first-party APIs. Never use mode: 'no-cors' with authenticated requests. Validate all cross-origin API responses. Ensure server CORS configuration matches client expectations.
