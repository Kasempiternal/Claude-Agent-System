# Backend Vulnerability Criteria

35 vulnerability vectors for server-side applications. Each vector includes grep patterns for initial detection, validation logic to confirm real findings, and false positive signals to avoid noise.

---

## Category: Injection (CRITICAL)

### SQL Injection (CWE-89)
**Severity**: CRITICAL
**Grep Candidates**: `+ "SELECT`, `+ "INSERT`, `+ "UPDATE`, `+ "DELETE`, `f"SELECT`, `f"INSERT`, `f"UPDATE`, `f"DELETE`, `.query(`, `.execute(`, `raw(`, `.rawQuery(`, `String.format(`, `%s` near SQL, `cursor.execute(`, `db.query(`, `sequelize.query(`, `knex.raw(`
**Validation**: Confirm user-controlled input (req.body, req.params, req.query, request.args, request.form, @RequestParam, @PathVariable) flows into the SQL string without parameterization. Trace the data flow from input to query construction. String concatenation or template literals with user input in SQL context = confirmed.
**False Positive Signals**: Parameterized queries (? placeholders, $1, :param), ORM methods (.where({}), .findOne()), static SQL with no user input, constants-only interpolation, query builders with bound parameters.
**Remediation**: Use parameterized queries or prepared statements. In Node.js: `db.query('SELECT * FROM users WHERE id = ?', [userId])`. In Python: `cursor.execute('SELECT * FROM users WHERE id = %s', (user_id,))`. Never concatenate user input into SQL strings.

### Command Injection (CWE-78)
**Severity**: CRITICAL
**Grep Candidates**: `child_process`, `subprocess.call(`, `subprocess.run(`, `subprocess.Popen(`, `os.system(`, `os.popen(`, `Runtime.getRuntime()`, `ProcessBuilder(`, `system(`, `popen(`, `shell_exec(`, `passthru(`, `proc_open(`, `shell=True`, `execSync(`, `spawnSync(`
**Validation**: Confirm user input flows into the command string. Check if the command is constructed with string concatenation/interpolation using request parameters, form data, or any externally controlled value. `shell=True` with user input in Python is always critical.
**False Positive Signals**: Hardcoded commands with no user input, commands using allowlisted arguments only, proper input validation with strict allowlist (not blocklist), execFile with validated arguments array (no shell interpretation).
**Remediation**: Avoid shell execution entirely. Use language-native libraries instead of shelling out. If unavoidable: use execFile (not shell-based execution), pass arguments as arrays (not strings), validate input against strict allowlist, never use shell=True with user input.

### NoSQL Injection (CWE-943)
**Severity**: CRITICAL
**Grep Candidates**: `$where`, `$regex`, `$gt`, `$ne`, `$nin`, `$or`, `.find(`, `.findOne(`, `.updateOne(`, `.deleteOne(`, `req.body` near MongoDB operations, `JSON.parse(` near query, `mapReduce(`
**Validation**: Confirm user input (especially JSON request bodies) is passed directly into MongoDB query operators without validation. Check if req.body or parsed JSON is spread directly into .find(), .findOne(), etc. The key pattern is user-controlled objects being used as query selectors.
**False Positive Signals**: Schema validation (Mongoose schemas with strict types), input validated/cast to specific types before query, explicit field selection (not spreading entire objects), ODM methods that sanitize input.
**Remediation**: Always validate and sanitize query inputs. Use Mongoose schemas with strict typing. Cast expected types explicitly: `{ _id: ObjectId(req.params.id) }`. Never pass req.body directly as a query filter. Use mongo-sanitize or strip keys starting with $.

### LDAP Injection (CWE-90)
**Severity**: CRITICAL
**Grep Candidates**: `ldap.search(`, `ldap_search(`, `(&(`, `(|(`, `LdapTemplate`, `.search(`, `searchFilter`, `cn=`, `uid=`, `DirectorySearcher(`
**Validation**: Confirm user input is concatenated into LDAP filter strings without escaping. Look for patterns like "(&(uid=" + username + ")" or f-string equivalents.
**False Positive Signals**: LDAP filter escaping functions applied (ldap.filter.escape_filter_chars(), LdapEncoder.filterEncode()), parameterized LDAP queries, hardcoded filter values.
**Remediation**: Use LDAP-specific escaping functions for all user input in filter strings. In Python: ldap.filter.escape_filter_chars(user_input). In Java: LdapEncoder.filterEncode(userInput). Use parameterized LDAP queries where available.

### XPath Injection (CWE-643)
**Severity**: HIGH
**Grep Candidates**: `xpath(`, `evaluate(`, `XPathExpression`, `selectNodes(`, `selectSingleNode(`, `XPathFactory`, `//` near string concat
**Validation**: Confirm user input is concatenated into XPath expressions. Look for "/users/user[@name='" + username + "']" patterns.
**False Positive Signals**: Parameterized XPath (XPathVariableResolver), hardcoded XPath expressions, input validated against strict schema.
**Remediation**: Use parameterized XPath queries (XPathVariableResolver in Java). If unavailable, validate input against strict allowlist of expected characters. Never concatenate user input into XPath strings.

### Server-Side Template Injection (CWE-1336)
**Severity**: CRITICAL
**Grep Candidates**: `render_template_string(`, `Template(`, `from_string(`, `Jinja2`, `Environment(`, `nunjucks.renderString(`, `pug.render(`, `ejs.render(`, `Velocity.evaluate(`, `Freemarker`, `Thymeleaf` with `th:utext`
**Validation**: Confirm user-controlled data is used as the template itself (not just as a variable passed to a template). The critical distinction: render_template_string(user_input) is vulnerable; render_template('page.html', name=user_input) is safe. Check if the template string is constructed from user input.
**False Positive Signals**: User input passed as template variables (not as template source), templates loaded from filesystem only, sandboxed template engines (Jinja2 SandboxedEnvironment), static template strings.
**Remediation**: Never use user input as a template. Always pass user data as template variables. If dynamic templates are needed, use a sandboxed environment (Jinja2 SandboxedEnvironment) and strict allowlisting. Prefer render_template() over render_template_string().

---

## Category: Broken Access Control (HIGH-CRITICAL)

### BOLA / IDOR (CWE-639)
**Severity**: CRITICAL
**Grep Candidates**: `req.params.id`, `req.params.userId`, `request.args.get('id')`, `@PathVariable`, `params[:id]`, `/api/users/:id`, `/api/orders/:id`, `.findById(`, `.findByPk(`, `.get(pk=`, `Object.get(id=`
**Validation**: Check if the endpoint retrieves a resource by ID from the URL/query parameter AND does not verify that the authenticated user owns or has permission to access that resource. Look for patterns like User.findById(req.params.id) without a subsequent ownership check (e.g., where user_id = req.user.id). API endpoints that accept resource IDs are prime targets.
**False Positive Signals**: Ownership check present (.where({ userId: req.user.id })), admin-only endpoints with proper role checking, public resources that are intended to be accessible by ID, middleware that scopes queries to the authenticated user.
**Remediation**: Always scope resource queries to the authenticated user. Instead of Order.findById(req.params.id), use Order.findOne({ _id: req.params.id, userId: req.user.id }). Implement ownership middleware. For admin endpoints, verify admin role before allowing cross-user access.

### Broken Function-Level Authorization / BFLA (CWE-285)
**Severity**: HIGH
**Grep Candidates**: `/admin`, `/api/admin`, `isAdmin`, `role`, `@PreAuthorize`, `@Secured`, `authorize`, `policy`, `canAccess`, `ability`, `permission`, `@RequiresRole`, `[Authorize]`
**Validation**: Identify admin or privileged endpoints and check if they have proper authorization middleware/decorators. Look for routes that perform sensitive operations (delete, create user, change roles, view all records) without role/permission checks. Compare authorization patterns across regular vs. admin endpoints.
**False Positive Signals**: Authorization middleware applied at router level (covers all routes in group), role-based decorators present (@PreAuthorize, @Secured), policy-based authorization (Pundit, CanCanCan, CASL), gateway-level authorization.
**Remediation**: Apply authorization checks to every privileged endpoint. Use role-based or policy-based access control middleware. Apply authorization at the router group level for admin routes. Never rely on client-side role checks alone.

### Missing Authentication (CWE-306)
**Severity**: CRITICAL
**Grep Candidates**: `app.get(`, `app.post(`, `app.put(`, `app.delete(`, `@app.route(`, `router.get(`, `router.post(`, `@GetMapping`, `@PostMapping`, `@RequestMapping`
**Validation**: Identify endpoints that handle sensitive data or operations and check if authentication middleware is applied. Look for routes that return user data, modify state, or access internal functionality without any auth middleware (passport, jwt, session check). Compare against the authentication pattern used by other routes in the same application.
**False Positive Signals**: Public endpoints (login, registration, health check, docs), authentication middleware applied at app/router level (covers all child routes), API gateway handles authentication before the app.
**Remediation**: Apply authentication middleware to all non-public endpoints. Use a default-deny approach: require authentication globally and explicitly mark public endpoints as exceptions. Audit all routes for authentication coverage.

### Privilege Escalation (CWE-269)
**Severity**: CRITICAL
**Grep Candidates**: `role`, `isAdmin`, `user.role`, `req.body.role`, `req.body.isAdmin`, `update(`, `findByIdAndUpdate(`, `assign(`, `merge(`, `user.update(`, `set_role`, `promote`
**Validation**: Check if users can modify their own role or privilege level through API requests. Look for update endpoints where req.body properties like role, isAdmin, permissions are accepted and applied to the user model without filtering. Mass assignment that includes privilege fields is a key indicator.
**False Positive Signals**: Role field filtered from user input before update, admin-only role modification endpoints with proper auth, immutable role fields in ORM schema (e.g., Mongoose immutable: true), separate admin API for role management.
**Remediation**: Never allow users to set their own roles through regular update endpoints. Whitelist allowed fields for user self-update operations. Use separate admin-only endpoints for role changes. Make role fields immutable in the ORM schema for regular operations.

### Path Traversal (CWE-22)
**Severity**: HIGH
**Grep Candidates**: `../`, `..\\`, `path.join(`, `path.resolve(`, `os.path.join(`, `readFile(`, `readFileSync(`, `open(`, `send_file(`, `sendFile(`, `fs.read`, `createReadStream(`, `Paths.get(`, `file_get_contents(`
**Validation**: Confirm user input (filename, path parameter) flows into file system operations without normalization and containment checks. Check if ../ sequences can escape the intended directory. Look for path.join(baseDir, userInput) without subsequent validation that the resolved path is still within baseDir.
**False Positive Signals**: path.resolve() followed by startsWith(baseDir) check, path.normalize() with containment verification, static file serving middleware with built-in protection (express.static), chroot or jail environments, input validated to reject .. sequences.
**Remediation**: Always normalize the path and verify it starts with the expected base directory. Use path.basename() if only the filename is needed. Never use user input directly in file paths.

---

## Category: Server-Side Attacks (HIGH-CRITICAL)

### SSRF - Server-Side Request Forgery (CWE-918)
**Severity**: HIGH
**Grep Candidates**: `fetch(`, `axios(`, `axios.get(`, `axios.post(`, `http.get(`, `http.request(`, `requests.get(`, `requests.post(`, `urllib.request.urlopen(`, `HttpClient`, `WebClient`, `curl_exec(`, `file_get_contents(`, `url` in req.body/query, `URI.parse(`
**Validation**: Confirm user-controlled input (URL, hostname, IP address) is used as the target of a server-side HTTP request. Check if the application fetches a URL provided by the user without validating the destination. Internal network access (169.254.169.254, 10.x, 172.16-31.x, 192.168.x, localhost, 127.0.0.1) is especially dangerous.
**False Positive Signals**: URL validated against strict allowlist of domains, URL scheme restricted to https only, DNS resolution check blocking internal IPs, internal-only services not exposed to user input, request target is hardcoded or from config (not user input).
**Remediation**: Validate URLs against a strict allowlist of allowed domains and schemes. Block internal IP ranges (RFC 1918, link-local, loopback). Resolve DNS and validate the IP before making the request. Use a dedicated HTTP proxy with egress filtering. Never pass raw user URLs to HTTP clients.

### Insecure Deserialization (CWE-502)
**Severity**: CRITICAL
**Grep Candidates**: `pickle.loads(`, `pickle.load(`, `yaml.load(`, `yaml.unsafe_load(`, `ObjectInputStream(`, `readObject(`, `unserialize(`, `Marshal.load(`, `jsonpickle.decode(`, `shelve.open(`, `dill.loads(`, `torch.load(`
**Validation**: Confirm that untrusted data (network input, file uploads, cookies, message queues) is deserialized using unsafe functions. pickle.loads(user_data) is always critical. yaml.load() without Loader=SafeLoader is vulnerable. Java ObjectInputStream with untrusted data is critical.
**False Positive Signals**: yaml.safe_load() or yaml.load(data, Loader=SafeLoader), deserialization of trusted internal data only, signed/encrypted serialized data with integrity verification, JSON.parse() alone (JSON is safe, unless followed by prototype pollution vectors).
**Remediation**: Never deserialize untrusted data with unsafe functions. Use yaml.safe_load(), avoid pickle for untrusted data (use JSON instead), implement Java serialization filters (JEP 290). If deserialization is required, sign the payload and verify before deserializing.

### XXE - XML External Entity (CWE-611)
**Severity**: HIGH
**Grep Candidates**: `XMLParser(`, `etree.parse(`, `etree.fromstring(`, `SAXParser`, `DocumentBuilder`, `XMLReader`, `xml.sax`, `xml.dom`, `lxml.etree`, `DOMParser(`, `parseString(`, `simplexml_load_string(`, `LIBXML_NOENT`, `DOCTYPE`, `ENTITY`, `SYSTEM`
**Validation**: Check if XML parsing is configured to process external entities. Look for XML parsers that accept user-uploaded XML without disabling DTD processing and external entity resolution. Default configurations of many parsers are vulnerable.
**False Positive Signals**: External entities explicitly disabled (factory.setFeature with FEATURE_SECURE_PROCESSING, disallow-doctype-decl), defusedxml library in Python, lxml with resolve_entities=False, LIBXML_NOENT NOT set in PHP.
**Remediation**: Disable DTD processing and external entity resolution in all XML parsers. In Java: set FEATURE_SECURE_PROCESSING and disallow-doctype-decl. In Python: use defusedxml instead of xml.etree. In PHP: use libxml_disable_entity_loader(true). In .NET: use XmlReaderSettings with DtdProcessing.Prohibit.

### Race Conditions - TOCTOU (CWE-362)
**Severity**: HIGH
**Grep Candidates**: `balance`, `quantity`, `stock`, `count`, `credits`, `transfer`, `withdraw`, `purchase`, `redeem`, `increment`, `decrement`, `UPDATE ... SET`, `findOneAndUpdate(`, `save()` after `find()`, `if` ... `then update`
**Validation**: Look for check-then-act patterns where a value is read, a condition is checked, and then updated in separate non-atomic operations. Classic pattern: read balance, check if sufficient, deduct. If these are not in a database transaction with proper isolation or using atomic operations, a race condition exists. Concurrent requests can exploit the gap between check and update.
**False Positive Signals**: Atomic database operations (UPDATE SET balance = balance - amount WHERE balance >= amount), database transactions with serializable isolation, distributed locks (Redis SETNX, database advisory locks), optimistic concurrency control (version columns), mutex/semaphore protection.
**Remediation**: Use atomic database operations that combine the check and update. Use database transactions with appropriate isolation levels. For distributed systems, use distributed locks. For financial operations: UPDATE accounts SET balance = balance - :amount WHERE id = :id AND balance >= :amount and check affected rows.

---

## Category: Authentication & Session (HIGH)

### JWT Vulnerabilities (CWE-347)
**Severity**: HIGH
**Grep Candidates**: `jsonwebtoken`, `jwt.sign(`, `jwt.verify(`, `jwt.decode(`, `PyJWT`, `jose`, `algorithms`, `"none"`, `HS256`, `secret`, `JWT_SECRET`, `expiresIn`, `exp`, `verify=False`, `verify_signature`
**Validation**: Check for: (1) jwt.decode() without signature verification, (2) JWT secret that is weak/short/default (e.g., "secret", "key", "password"), (3) Missing expiration (exp claim), (4) Algorithm confusion - accepting none or allowing HS256 when RS256 is expected, (5) Secret stored in source code rather than environment variable.
**False Positive Signals**: Strong secret from environment variable (process.env.JWT_SECRET), algorithm explicitly restricted (algorithms: ['RS256']), proper verification with jwt.verify(), expiration set and enforced, jwt.decode() used only for non-security purposes (reading claims after verification).
**Remediation**: Always verify JWT signatures. Use strong secrets (256+ bits) from environment variables. Set and enforce expiration. Explicitly specify allowed algorithms. Never use the none algorithm. Prefer RS256 with key pairs over HS256 with shared secrets.

### Session Fixation (CWE-384)
**Severity**: HIGH
**Grep Candidates**: `session`, `sessionID`, `session_id`, `JSESSIONID`, `PHPSESSID`, `connect.sid`, `req.session`, `session_regenerate_id(`, `req.session.regenerate(`
**Validation**: Check if the session ID is regenerated after successful authentication. Look for login handlers that authenticate the user and set session data without calling session regeneration. If the session ID remains the same before and after login, session fixation is possible.
**False Positive Signals**: req.session.regenerate() called after authentication, session_regenerate_id(true) in PHP, session framework auto-regenerates on login (Spring Security default), token-based auth (JWT) that does not use server-side sessions.
**Remediation**: Regenerate the session ID immediately after successful authentication. In Express: req.session.regenerate(). In PHP: session_regenerate_id(true). In Java/Spring: configure SessionFixationProtectionStrategy. Invalidate old session data.

### Weak Password Storage (CWE-916)
**Severity**: HIGH
**Grep Candidates**: `md5(`, `sha1(`, `sha256(`, `hashlib.md5(`, `hashlib.sha1(`, `MessageDigest.getInstance("MD5")`, `MessageDigest.getInstance("SHA-1")`, `crypto.createHash('md5')`, `crypto.createHash('sha1')`, `password`, `hash(`, `digest(`, `bcrypt`, `argon2`, `scrypt`, `pbkdf2`
**Validation**: Check if passwords are hashed using weak/fast algorithms (MD5, SHA1, SHA256 without key stretching) or stored in plaintext. Look for password fields being hashed with generic hash functions instead of password-specific KDFs. Also check for missing salt.
**False Positive Signals**: bcrypt.hash(), argon2.hash(), scrypt, pbkdf2 with sufficient iterations, MD5/SHA used for non-password purposes (checksums, cache keys, content hashing), password field handled by auth framework that uses proper hashing internally.
**Remediation**: Use password-specific KDFs: bcrypt (cost >= 12), Argon2id (preferred), scrypt, or PBKDF2 (iterations >= 100,000). Never use MD5, SHA1, or SHA256 alone for passwords. These are designed to be fast - the opposite of what password hashing needs.

### Insecure Password Reset (CWE-640)
**Severity**: HIGH
**Grep Candidates**: `resetToken`, `reset_token`, `passwordReset`, `forgot`, `Math.random(`, `uuid`, `crypto.randomBytes(`, `token`, `resetPassword`, `reset_password`, `expir`
**Validation**: Check the password reset flow for: (1) Predictable reset tokens (sequential IDs, timestamps, Math.random()), (2) Tokens that do not expire or have long expiration, (3) Tokens not invalidated after use, (4) Token sent in URL query parameter (logged in server logs/browser history), (5) No rate limiting on reset requests, (6) User enumeration via different responses for valid/invalid emails.
**False Positive Signals**: Cryptographically random tokens (crypto.randomBytes(32)), short expiration (< 1 hour), single-use tokens (deleted after use), rate limiting applied, consistent responses regardless of email validity.
**Remediation**: Generate tokens with crypto.randomBytes(32) or equivalent CSPRNG. Set short expiration (15-60 minutes). Invalidate after single use. Hash tokens before storing in database. Rate limit reset requests. Return identical responses for valid and invalid emails.

---

## Category: Data Exposure (MEDIUM-HIGH)

### Mass Assignment (CWE-915)
**Severity**: HIGH
**Grep Candidates**: `req.body`, `request.json`, `request.form`, `params.permit`, `Object.assign(`, `...req.body`, `.create(req.body)`, `.update(req.body)`, `Model.create(`, `Model.update(`, `fillable`, `guarded`, `attr_accessible`, `$request->all()`, `request.data`
**Validation**: Check if user request body is passed directly to model create/update operations without filtering fields. Look for User.create(req.body) or user.update(req.body) where the model has sensitive fields (role, isAdmin, verified, balance) that should not be user-modifiable.
**False Positive Signals**: Explicit field selection ({ name: req.body.name, email: req.body.email }), DTO/schema validation (Joi, Zod, class-validator), Rails params.permit(:name, :email), Laravel $request->only(['name', 'email']), Mongoose select or schema-level field restrictions.
**Remediation**: Never pass raw request bodies to model operations. Whitelist allowed fields explicitly. Use DTOs or validation schemas to define accepted fields. In Rails: use strong_parameters. In Laravel: use $request->only(). In Node.js: destructure only needed fields from req.body.

### Verbose Error Messages (CWE-209)
**Severity**: MEDIUM
**Grep Candidates**: `stack`, `stackTrace`, `traceback`, `DEBUG = True`, `debug: true`, `NODE_ENV`, `err.message`, `err.stack`, `e.getMessage()`, `e.printStackTrace()`, `res.json(err)`, `res.send(err)`, `return err`
**Validation**: Check if error handlers send stack traces, internal paths, database queries, or detailed error messages to clients. Look for catch blocks that return the full error object to the response. Check if debug mode is enabled in production configuration.
**False Positive Signals**: Custom error handler that returns generic messages, error details logged server-side only, environment-conditional error detail (if NODE_ENV === 'development'), error serialization that strips sensitive fields.
**Remediation**: Implement a global error handler that returns generic messages to clients and logs details server-side. Never send stack traces, file paths, or SQL queries in API responses. Ensure DEBUG = False and NODE_ENV = production in production.

### GraphQL Introspection in Production
**Severity**: MEDIUM
**Grep Candidates**: `introspection`, `__schema`, `graphqlHTTP(`, `ApolloServer(`, `graphqlExpress(`, `yoga(`, `mercurius`, `graphql-playground`, `graphiql`, `GraphiQLHandler`
**Validation**: Check if GraphQL introspection is enabled in production configuration. Look for Apollo Server, Express GraphQL, or similar setups where introspection: true or where introspection is not explicitly disabled (many frameworks enable it by default). Also check for GraphiQL/Playground enabled in production.
**False Positive Signals**: introspection: process.env.NODE_ENV !== 'production', introspection: false in production config, introspection disabled at gateway/proxy level, non-production environment only.
**Remediation**: Disable introspection in production: new ApolloServer({ introspection: false }). Disable GraphiQL/Playground in production. If introspection is needed for tooling, restrict it to internal networks via network policies.

### Missing Rate Limiting
**Severity**: MEDIUM
**Grep Candidates**: `/login`, `/auth`, `/register`, `/signup`, `/reset`, `/forgot`, `/verify`, `/otp`, `/2fa`, `/token`, `rateLimit`, `rate-limit`, `throttle`, `express-rate-limit`, `express-brute`, `slowDown`, `@Throttle`
**Validation**: Identify sensitive endpoints (authentication, registration, password reset, OTP verification, API keys) and check if rate limiting middleware is applied. Look for login/auth routes without rate limiting protection. Compare against other routes that may have rate limiting.
**False Positive Signals**: Rate limiting middleware applied globally or at router level, API gateway rate limiting (Kong, AWS API Gateway), WAF rate limiting (Cloudflare, AWS WAF), application-level rate limiter, CAPTCHA protection.
**Remediation**: Apply rate limiting to all sensitive endpoints. Use express-rate-limit for Express, django-ratelimit for Django, @Throttle() for NestJS. Set limits appropriate to the endpoint: login (5-10/min), registration (3-5/hour), password reset (3-5/hour).

### Unvalidated Redirects (CWE-601)
**Severity**: MEDIUM
**Grep Candidates**: `redirect(`, `res.redirect(`, `redirect_to(`, `sendRedirect(`, `Location:`, `next=`, `return_url=`, `redirect_uri=`, `returnTo`, `url=`, `goto=`, `dest=`, `continue=`
**Validation**: Check if redirect destination comes from user input (query parameter like ?next=, ?returnTo=) without validation. Confirm the application does not verify the redirect URL is within the same domain or an allowlisted domain before redirecting.
**False Positive Signals**: Redirect URL validated against allowlist, URL parsed and domain checked, relative-path-only redirects enforced, hardcoded redirect destinations, OAuth redirect_uri validated against registered URIs.
**Remediation**: Validate redirect URLs against an allowlist of allowed domains. Only allow relative paths for redirects. Parse the URL and verify the hostname matches expected domains. For OAuth flows, strictly validate redirect_uri against pre-registered values.

### Unrestricted File Upload (CWE-434)
**Severity**: HIGH
**Grep Candidates**: `multer(`, `upload(`, `multipart`, `formidable`, `busboy`, `FileUpload`, `MultipartFile`, `move_uploaded_file(`, `file.save(`, `file.mv(`, `writeFile(`, `Content-Type`, `mimetype`, `originalname`, `extension`
**Validation**: Check if file uploads validate: (1) File type (extension AND MIME type), (2) File size, (3) File content (magic bytes), (4) Storage location (outside web root), (5) Filename sanitization (prevent path traversal). Look for uploads that save files to publicly accessible directories with user-controlled filenames.
**False Positive Signals**: File type validation (both extension and MIME), file size limits, content-type verification against magic bytes, files stored outside web root or in cloud storage (S3), filename generated by system (UUID), virus scanning integration.
**Remediation**: Validate file type using both extension and magic bytes (not just Content-Type header - it is user-controlled). Enforce size limits. Generate random filenames (UUID). Store files outside the web root or in cloud storage. Serve files through a download handler, not direct URL access.

### Sensitive Data in Response Headers
**Severity**: LOW
**Grep Candidates**: `X-Powered-By`, `Server:`, `X-AspNet-Version`, `X-AspNetMvc-Version`, `helmet`, `removeHeader`, `app.disable('x-powered-by')`
**Validation**: Check if the application exposes technology stack details through response headers. Look for default headers that reveal framework versions.
**False Positive Signals**: Helmet middleware configured, app.disable('x-powered-by'), reverse proxy strips headers, custom Server header set.
**Remediation**: Use helmet() middleware in Express. Call app.disable('x-powered-by'). Configure reverse proxy to strip or override Server header. Remove all version-revealing headers.

### Insecure Cookie Configuration
**Severity**: MEDIUM
**Grep Candidates**: `cookie`, `Set-Cookie`, `httpOnly`, `secure`, `sameSite`, `session`, `cookie-session`, `express-session`, `domain`, `path`, `maxAge`, `expires`
**Validation**: Check session/authentication cookies for missing security flags: (1) httpOnly - prevents JavaScript access, (2) secure - HTTPS only, (3) sameSite - CSRF protection, (4) appropriate domain scope, (5) reasonable expiration. Check if cookies containing tokens or session IDs lack these flags.
**False Positive Signals**: All security flags present (httpOnly: true, secure: true, sameSite: 'strict'), non-sensitive cookies (preferences, analytics), cookie set by security-aware framework with safe defaults.
**Remediation**: Set all authentication/session cookies with: httpOnly: true, secure: true, sameSite: 'lax' or 'strict', appropriate domain and path scope, reasonable maxAge.

### Logging Sensitive Data
**Severity**: MEDIUM
**Grep Candidates**: `console.log(`, `logger.info(`, `logger.debug(`, `logging.info(`, `log.info(`, `System.out.println(`, `Log.d(`, `NSLog(`, `password`, `token`, `secret`, `apiKey`, `credit_card`, `ssn`
**Validation**: Check if logging statements include sensitive data: passwords, tokens, API keys, credit card numbers, SSNs, or full request bodies that may contain secrets. Search for console.log(req.body) or logger.info(user) where user objects contain password hashes or tokens.
**False Positive Signals**: Logging middleware that redacts sensitive fields, structured logging with field exclusion, log level set to warn/error in production (debug logs not emitted), sensitive fields explicitly excluded from logging.
**Remediation**: Never log passwords, tokens, API keys, or PII. Implement structured logging with field-level redaction. Use a logging middleware that automatically strips sensitive fields. Set appropriate log levels for production (warn/error, not debug).

### CORS Misconfiguration
**Severity**: MEDIUM
**Grep Candidates**: `Access-Control-Allow-Origin`, `cors(`, `CORS(`, `AllowOrigin`, `*`, `credentials`, `Access-Control-Allow-Credentials`, `req.headers.origin`, `origin: true`
**Validation**: Check for: (1) Access-Control-Allow-Origin: * with Access-Control-Allow-Credentials: true, (2) Origin reflected from request header without validation, (3) Overly broad origin patterns (regex that matches unintended domains).
**False Positive Signals**: Strict origin allowlist, cors({ origin: ['https://app.example.com'] }), public API intentionally allowing all origins without credentials, no credentials mode.
**Remediation**: Set specific allowed origins, never reflect the request origin without validation. Never combine * with credentials: true. Use a strict allowlist.

### HTTP Security Headers Missing
**Severity**: LOW
**Grep Candidates**: `helmet`, `Content-Security-Policy`, `X-Content-Type-Options`, `X-Frame-Options`, `Strict-Transport-Security`, `X-XSS-Protection`, `Referrer-Policy`, `Permissions-Policy`
**Validation**: Check if the application sets security headers. Key headers: Content-Security-Policy, X-Content-Type-Options: nosniff, X-Frame-Options: DENY, Strict-Transport-Security, Referrer-Policy. Check both application code and reverse proxy configuration.
**False Positive Signals**: Helmet middleware configured, reverse proxy or CDN adds headers (Cloudflare, AWS CloudFront), headers set in web server config (nginx, Apache), meta tags for CSP in HTML.
**Remediation**: Use helmet() in Express or equivalent middleware. Configure headers at the reverse proxy level. Minimum: X-Content-Type-Options: nosniff, X-Frame-Options: DENY, Strict-Transport-Security, Content-Security-Policy with restrictive policy.

### Server-Side Request Smuggling (CWE-444)
**Severity**: HIGH
**Grep Candidates**: `Transfer-Encoding`, `Content-Length`, `chunked`, `proxy_pass`, `ProxyPass`, `upstream`, `reverse_proxy`, `LoadBalancer`
**Validation**: Check for reverse proxy configurations where the backend and proxy may disagree on request boundaries. Look for configurations that allow both Transfer-Encoding and Content-Length headers, or custom header manipulation that could lead to desync. This is primarily a configuration issue rather than application code.
**False Positive Signals**: Modern proxy/server combinations with HTTP/2 end-to-end, proxy configured to normalize requests, proxy_http_version 1.1 with proxy_set_header Connection "" in nginx, AWS ALB/CloudFront (handles automatically).
**Remediation**: Use HTTP/2 between proxy and backend where possible. Configure proxy to normalize ambiguous requests. In nginx: set proxy_http_version 1.1 and proxy_set_header Connection "". Reject requests with both Transfer-Encoding and Content-Length. Keep proxy and backend software updated.
