# Universal Vulnerability Criteria

15 vulnerability vectors that apply to ALL project types. These are loaded alongside every type-specific criteria file. Each vector includes grep patterns for initial detection, validation logic to confirm real findings, and false positive signals to avoid noise.

---

## Category: Secrets (CRITICAL)

### AWS Access Keys
**Severity**: CRITICAL
**Grep Candidates**: `AKIA`, `ASIA`, `aws_access_key_id`, `aws_secret_access_key`, `AWS_ACCESS_KEY`, `AWS_SECRET_KEY`, `credentials`, `~/.aws`
**Validation**: Search for AWS access key patterns: `AKIA[0-9A-Z]{16}` (long-term keys) or `ASIA[0-9A-Z]{16}` (temporary STS keys). Check for corresponding secret access keys (40-character base64 strings). Validate the key is in source code, configuration files, or environment files that may be committed — not in .gitignore'd files or CI secret references.
**False Positive Signals**: References to environment variables ($AWS_ACCESS_KEY_ID), CI secret references (${{ secrets.AWS_KEY }}), placeholder/example keys in documentation, .gitignore'd credential files, AWS SDK default credential chain configuration (no explicit keys).
**Remediation**: Remove the key from source code immediately. Rotate the compromised key in AWS IAM console. Use environment variables, AWS IAM roles (for EC2/ECS/Lambda), or AWS Secrets Manager. For CI/CD: use OIDC federation with GitHub/GitLab Actions. Run git filter-branch or BFG to remove from history. Add credential patterns to .gitignore and pre-commit hooks.

### Private Keys
**Severity**: CRITICAL
**Grep Candidates**: `-----BEGIN RSA PRIVATE`, `-----BEGIN EC PRIVATE`, `-----BEGIN OPENSSH PRIVATE`, `-----BEGIN PRIVATE KEY`, `-----BEGIN DSA PRIVATE`, `-----BEGIN ENCRYPTED PRIVATE`, `.pem`, `.key`, `id_rsa`, `id_ed25519`, `id_ecdsa`
**Validation**: Search for PEM-encoded private key headers in all source files. Check for private key files (.pem, .key) that are tracked by git. Also check for base64-encoded key material in configuration files or environment variables. Any private key in source code is a critical finding regardless of whether it appears to be a test key.
**False Positive Signals**: Public keys only (BEGIN PUBLIC KEY, BEGIN CERTIFICATE), .gitignore'd key files, key file references pointing to external paths (/etc/ssl/private/), placeholder text mentioning key format in documentation, test fixtures with explicitly marked dummy keys that are not used in any configuration.
**Remediation**: Remove the private key from source code immediately. Rotate/regenerate the key. Store keys in secret management systems (HashiCorp Vault, AWS Secrets Manager, GCP Secret Manager). Use environment variables or mounted secrets for runtime access. Add *.pem, *.key, id_rsa* to .gitignore. Run BFG to remove from git history.

### API Keys and Tokens
**Severity**: CRITICAL
**Grep Candidates**: `sk-`, `sk_live_`, `sk_test_`, `pk_live_`, `pk_test_`, `ghp_`, `ghr_`, `gho_`, `ghu_`, `ghs_`, `glpat-`, `xoxb-`, `xoxp-`, `xoxa-`, `xoxr-`, `SG.`, `SENDGRID`, `TWILIO`, `STRIPE`, `api_key`, `apiKey`, `API_KEY`, `apiSecret`, `client_secret`, `access_token`
**Validation**: Search for common API key patterns: Stripe keys (sk_live_, sk_test_), GitHub tokens (ghp_, ghr_), GitLab tokens (glpat-), Slack tokens (xoxb-, xoxp-), SendGrid (SG.), OpenAI (sk-), Twilio. Also search for generic patterns: api_key, apiKey, client_secret with actual values (not references to env vars). Check if the value is a real key (sufficient length, correct character set) vs. a placeholder.
**False Positive Signals**: Environment variable references (process.env.API_KEY, os.getenv("API_KEY")), configuration templates with placeholder values ("YOUR_API_KEY_HERE"), test/mock API keys clearly marked, keys in .env.example with dummy values, secret store references.
**Remediation**: Remove the key from source code. Rotate the compromised key with the service provider. Use environment variables or secret management systems. Create .env.example with placeholder values, .gitignore the actual .env. Add pre-commit hooks (git-secrets, detect-secrets) to prevent future leaks.

### Database Connection Strings with Credentials
**Severity**: CRITICAL
**Grep Candidates**: `mongodb://`, `postgres://`, `postgresql://`, `mysql://`, `redis://`, `amqp://`, `mssql://`, `jdbc:`, `connection_string`, `DATABASE_URL`, `DB_PASSWORD`, `DB_USER`, `Data Source=`, `Server=`
**Validation**: Search for database connection strings that embed username and password: `mongodb://user:password@host:port/db`, `postgres://user:password@host/db`. Check if the connection string is hardcoded (not from environment variable). Also check for separate DB_USER/DB_PASSWORD values hardcoded in configuration files.
**False Positive Signals**: Connection string from environment variable (process.env.DATABASE_URL), configuration template with placeholder credentials, local development connection (localhost with default credentials in .env.local), docker-compose internal network connections with documented defaults, connection string assembled from separate env vars.
**Remediation**: Store database credentials in environment variables or secret management. Use connection string from environment: `process.env.DATABASE_URL`. For cloud databases: use IAM authentication instead of passwords. Remove credentials from source code and rotate passwords. Add database credential patterns to pre-commit hooks.

### JWT Signing Secrets in Source Code
**Severity**: CRITICAL
**Grep Candidates**: `JWT_SECRET`, `jwt_secret`, `JWT_KEY`, `jwtSecret`, `signing_key`, `SIGNING_SECRET`, `TOKEN_SECRET`, `secret:`, `secretOrKey`, `secretKey`, `HMAC_SECRET`
**Validation**: Check if JWT signing secrets/keys are hardcoded in source code rather than loaded from environment variables. Look for: (1) String literal assigned to JWT secret variable, (2) Short or weak secrets ("secret", "key", "password", "changeme"), (3) Same secret used across environments, (4) Secret committed in config files. A leaked JWT secret allows forging valid tokens.
**False Positive Signals**: Secret loaded from environment variable (process.env.JWT_SECRET), secret loaded from secret manager (Vault, AWS Secrets Manager), RS256 with key pair from file/env (not embedded), test configuration with documented test-only secrets.
**Remediation**: Load JWT secrets from environment variables or secret managers. Use strong secrets (minimum 256 bits of entropy). Use different secrets per environment. Prefer RS256 (asymmetric) over HS256 (symmetric) for easier key management. Rotate secrets periodically. Add JWT secret patterns to pre-commit hooks.

### Committed .env Files
**Severity**: HIGH
**Grep Candidates**: `.env`, `.env.local`, `.env.production`, `.env.staging`, `.env.development`, `dotenv`, `load_dotenv`, `config()`, `DB_PASSWORD=`, `API_KEY=`, `SECRET=`
**Validation**: Check if .env files containing real secrets are tracked by git. Look for: (1) .env files in git status/git ls-files output, (2) .env files with real credentials (not .env.example), (3) .gitignore missing .env patterns, (4) .env files in Docker build context (included in image). Even if .env is currently gitignored, check git history for previously committed versions.
**False Positive Signals**: .env.example with placeholder values (committed intentionally), .env.test with non-sensitive test values, .env in .gitignore, .env.vault (encrypted env files), documentation referencing .env format.
**Remediation**: Add .env* (except .env.example) to .gitignore. Remove .env from git tracking: `git rm --cached .env`. Create .env.example with placeholder values. If .env was previously committed, rotate all secrets and use BFG to remove from history. Use environment-specific secret management for production.

---

## Category: Cryptography (HIGH)

### Weak Hash Functions (CWE-328)
**Severity**: HIGH
**Grep Candidates**: `md5`, `MD5`, `sha1`, `SHA1`, `SHA-1`, `hashlib.md5`, `hashlib.sha1`, `createHash('md5')`, `createHash('sha1')`, `MessageDigest.getInstance("MD5")`, `MessageDigest.getInstance("SHA-1")`, `Digest::MD5`, `Digest::SHA1`
**Validation**: Check if MD5 or SHA1 is used for security-sensitive purposes: password hashing, digital signatures, certificate validation, HMAC (SHA1-HMAC is still acceptable but not recommended), token generation, or integrity verification where collision resistance matters. MD5 and SHA1 have known collision attacks.
**False Positive Signals**: MD5/SHA1 used for non-security purposes (checksums, cache keys, content deduplication, etag generation), HMAC-SHA1 (still considered acceptable but should migrate to SHA-256), hash comparison for performance (not security), legacy compatibility layer with documented risk acceptance.
**Remediation**: Replace MD5/SHA1 with SHA-256 or SHA-3 for all security purposes. For password hashing: use bcrypt, Argon2id, or scrypt (not any SHA variant alone). For HMAC: upgrade to HMAC-SHA256. For checksums where collision resistance does not matter (cache keys, non-security dedup), MD5/SHA1 may remain acceptable.

### Hardcoded Encryption Keys
**Severity**: CRITICAL
**Grep Candidates**: `encryptionKey`, `encryption_key`, `ENCRYPTION_KEY`, `AES_KEY`, `aesKey`, `secretKey`, `masterKey`, `crypto_key`, `cipher_key`, `key =`, `iv =`, `nonce =`, `key:`, `Buffer.from('`, `base64`
**Validation**: Check if encryption keys, initialization vectors (IVs), or nonces are hardcoded in source code. Look for: (1) String/byte literals assigned to key variables, (2) Base64-encoded keys in configuration files, (3) Same key used for all encryption operations (no key derivation), (4) IV/nonce that is static (not randomly generated per operation). A hardcoded key means anyone with source access can decrypt all data.
**False Positive Signals**: Key loaded from environment variable or secret manager, key derived from KDF (PBKDF2, HKDF) with unique salt, key generated at runtime (crypto.randomBytes), key in test fixtures with documented test-only scope, key management system integration (AWS KMS, HashiCorp Vault).
**Remediation**: Load encryption keys from environment variables or KMS. Generate keys at deployment time, not compile time. Use key derivation functions (HKDF) for per-context keys. Rotate keys periodically. Store keys in hardware security modules (HSM) or cloud KMS for high-security applications. Never commit keys to source control.

### ECB Mode Usage (CWE-327)
**Severity**: HIGH
**Grep Candidates**: `ECB`, `AES/ECB`, `MODE_ECB`, `CipherMode.ECB`, `'ecb'`, `ecb`, `createCipheriv`, `createCipher`, `Cipher.getInstance(`, `AES-128-ECB`, `AES-256-ECB`
**Validation**: Check if AES or other block ciphers use ECB (Electronic Codebook) mode. ECB encrypts identical plaintext blocks to identical ciphertext blocks, leaking patterns in the data (the "ECB penguin" problem). Look for explicit ECB mode selection or cipher creation functions that default to ECB.
**False Positive Signals**: ECB mentioned in comments/documentation explaining why NOT to use it, test code explicitly testing ECB for compatibility, single-block encryption where ECB is equivalent to other modes, cipher configured with CBC, GCM, or CTR mode.
**Remediation**: Use authenticated encryption modes: AES-GCM (preferred) or AES-CBC with HMAC. Never use ECB mode. Use `createCipheriv` (not `createCipher`) with a random IV. For new applications, always use AES-256-GCM with a random nonce per message.

### Insecure Random Number Generation (CWE-330)
**Severity**: HIGH
**Grep Candidates**: `Math.random(`, `random.random(`, `random.randint(`, `rand(`, `srand(`, `mt_rand(`, `Random(`, `java.util.Random`, `ThreadLocalRandom`, `SecureRandom`, `crypto.randomBytes(`, `os.urandom(`
**Validation**: Check if non-cryptographic random number generators are used for security-sensitive purposes: token generation, session IDs, password reset tokens, encryption keys/IVs, CSRF tokens, OTP codes, salt generation. Math.random(), Python random module, java.util.Random, and PHP rand()/mt_rand() are NOT cryptographically secure.
**False Positive Signals**: crypto.randomBytes() or crypto.getRandomValues() used (Node.js), secrets module used (Python), SecureRandom used (Java), random_bytes() used (PHP), Math.random() used only for non-security purposes (UI animations, shuffling display order, test data).
**Remediation**: Use cryptographically secure random generators for all security purposes: crypto.randomBytes() or crypto.getRandomValues() in Node.js, secrets.token_hex() or secrets.token_urlsafe() in Python, SecureRandom in Java, random_bytes() in PHP. Never use Math.random() for tokens, keys, or security-sensitive values.

---

## Category: Logging & Data (MEDIUM-HIGH)

### PII in Logs
**Severity**: MEDIUM
**Grep Candidates**: `console.log(`, `logger.`, `logging.`, `log.`, `System.out`, `NSLog(`, `Log.d(`, `print(`, `puts`, `password`, `token`, `ssn`, `social_security`, `credit_card`, `card_number`, `cvv`, `email`, `phone`, `address`, `date_of_birth`, `dob`
**Validation**: Check if logging statements include Personally Identifiable Information or sensitive data. Search for log calls that: (1) Log entire request objects (may contain passwords, tokens), (2) Log user objects (may contain PII), (3) Explicitly log specific sensitive fields (email, SSN, credit card), (4) Log authentication tokens or session IDs, (5) Log stack traces that include sensitive variable values. Check both application code and middleware/interceptor logging.
**False Positive Signals**: Structured logging with automatic PII redaction, log fields explicitly filtered to exclude sensitive data, hashed/masked values in logs (last 4 digits only), log level set to error/warn in production (debug logs not emitted), logging only IDs/references (not actual PII values).
**Remediation**: Implement structured logging with PII redaction middleware. Create a deny-list of fields to never log (password, token, ssn, credit_card). Log references/IDs instead of actual values. Use request logging middleware that automatically strips sensitive headers (Authorization, Cookie). Set appropriate log levels for production.

### Sensitive Data in Error Messages (CWE-209)
**Severity**: MEDIUM
**Grep Candidates**: `stack`, `stackTrace`, `traceback`, `err.message`, `err.stack`, `e.getMessage()`, `e.printStackTrace()`, `traceback.format_exc()`, `res.json(err)`, `res.send(err)`, `rescue => e`, `DEBUG`, `VERBOSE`
**Validation**: Check if error responses or error handlers expose: (1) Full stack traces with file paths and line numbers, (2) Database query details or schema information, (3) Internal IP addresses or hostnames, (4) Configuration values, (5) Other service URLs or credentials in connection error messages. Check both API error responses and HTML error pages.
**False Positive Signals**: Custom error handler that strips sensitive details, error response only includes error code and generic message, error details logged server-side only, environment-conditional detail level, error serializer that excludes stack traces.
**Remediation**: Create a global error handler that: (1) Logs full error details server-side, (2) Returns only error code and generic message to client, (3) Never includes stack traces in responses, (4) Maps internal errors to safe user-facing messages. Use error codes for client-side error handling instead of message parsing.

### Missing Audit Trail
**Severity**: MEDIUM
**Grep Candidates**: `login`, `logout`, `authenticate`, `authorize`, `permission`, `role`, `delete`, `admin`, `password`, `changePassword`, `resetPassword`, `createUser`, `deleteUser`, `updateRole`, `grant`, `revoke`, `transfer`, `payment`, `audit`, `audit_log`
**Validation**: Check if security-relevant events are logged for audit purposes. Key events that should be audited: (1) Authentication events (login, logout, failed login), (2) Authorization events (access denied, privilege changes), (3) Data modification (create, update, delete of sensitive records), (4) Admin operations (user management, configuration changes), (5) Security events (password changes, MFA changes, API key operations). Check if there is a dedicated audit log separate from application logs.
**False Positive Signals**: Dedicated audit logging system in place (audit trail table, separate log stream), security events logged with structured format, SIEM integration, compliance framework audit logging (SOC 2, HIPAA), middleware that automatically audits security events.
**Remediation**: Implement a dedicated audit log system for security events. Log at minimum: WHO (user ID), WHAT (action), WHEN (timestamp), WHERE (IP, device), OUTCOME (success/failure). Use append-only storage for audit logs. Integrate with SIEM for alerting. Implement audit log retention policies per compliance requirements.

---

## Category: Authentication Universal (HIGH)

### Default Credentials
**Severity**: HIGH
**Grep Candidates**: `admin`, `password`, `admin:admin`, `root:root`, `test:test`, `user:user`, `default`, `changeme`, `admin123`, `password123`, `12345`, `qwerty`, `guest`, `demo`
**Validation**: Check for hardcoded default credentials in: (1) Database seed/migration files, (2) Configuration files (default admin accounts), (3) Docker/docker-compose files (default database passwords), (4) Test fixtures used in production code paths, (5) Documentation-referenced defaults that users may not change. Also check for credential checks against hardcoded values (backdoor accounts).
**False Positive Signals**: Test fixtures in test directories only, seed data clearly marked as development-only, default credentials documented with forced-change-on-first-login, placeholder values in configuration templates (.env.example), CI/CD test credentials for ephemeral environments.
**Remediation**: Never ship default credentials. Force credential setup during first-run/installation. Generate random initial credentials during deployment. For databases in docker-compose: use environment variables from .env (not hardcoded). Remove all hardcoded credential checks (backdoor accounts). Add setup wizard that requires password creation.

### Hardcoded Passwords/Tokens
**Severity**: CRITICAL
**Grep Candidates**: `password = "`, `password = '`, `PASSWORD = "`, `token = "`, `token = '`, `TOKEN = "`, `secret = "`, `SECRET = "`, `apiKey = "`, `api_key = "`, `passphrase`, `credentials`
**Validation**: Search for string literals assigned to variables named password, token, secret, apiKey, or similar. Check if these are: (1) Used in authentication/authorization flows, (2) Used to connect to external services, (3) Used for encryption or signing, (4) Accessible in production builds. Distinguish between actual secrets and variable names that reference environment variables.
**False Positive Signals**: Variable declaration that reads from environment (const password = process.env.PASSWORD), test constants in test files only, TypeScript/Flow type definitions, configuration schema definitions, placeholder strings ("REPLACE_ME", "TODO"), password validation logic (checking requirements, not actual passwords).
**Remediation**: Move all secrets to environment variables or secret management systems. Replace hardcoded values with environment variable references. Use different credentials per environment. Add secret scanning to pre-commit hooks and CI pipeline. Rotate any credentials that were previously hardcoded.

---

## Category: General Security (MEDIUM)

### Missing Input Validation at Boundaries
**Severity**: MEDIUM
**Grep Candidates**: `req.body`, `req.query`, `req.params`, `request.json`, `request.form`, `request.args`, `@RequestBody`, `@RequestParam`, `params[`, `$_GET`, `$_POST`, `$_REQUEST`, `argv`, `stdin`
**Validation**: Check application entry points (API endpoints, CLI arguments, file parsers, message queue consumers) for input validation. Look for: (1) Request body used without schema validation (Joi, Zod, Pydantic, class-validator), (2) Query parameters used without type checking, (3) No input length limits, (4) No type coercion/validation, (5) File input processed without validation. Focus on the boundary between trusted and untrusted data.
**False Positive Signals**: Schema validation middleware (express-validator, Joi, Zod, Pydantic, Marshmallow, class-validator), TypeScript with runtime validation, API gateway input validation, strong typing with serialization framework.
**Remediation**: Validate all input at application boundaries. Use schema validation libraries: Joi/Zod (Node.js), Pydantic/Marshmallow (Python), class-validator (NestJS), Bean Validation (Java). Define schemas for all request bodies, query parameters, and path parameters. Set maximum lengths for string inputs. Validate types, ranges, and formats.

### Insecure File Uploads (CWE-434)
**Severity**: HIGH
**Grep Candidates**: `upload`, `multipart`, `multer`, `formidable`, `busboy`, `FileUpload`, `MultipartFile`, `move_uploaded_file`, `file.save(`, `file.mv(`, `writeFile`, `Content-Type`, `mimetype`, `originalname`
**Validation**: Check file upload handlers for: (1) No file type validation (or only checking Content-Type header, which is user-controlled), (2) No file size limits, (3) User-controlled filename used for storage, (4) Files stored in publicly accessible directory, (5) No malware/content scanning, (6) Executable file types allowed (.php, .jsp, .asp, .exe). File upload without proper validation is one of the most exploited web vulnerabilities.
**False Positive Signals**: File type validation using magic bytes (file-type library), size limits enforced, UUID-generated filenames, cloud storage (S3, GCS) with proper ACLs, content-disposition: attachment for downloads, virus scanning integration, allow-list of file extensions.
**Remediation**: Validate file type using magic bytes (not just extension or Content-Type). Enforce size limits. Generate random filenames (UUID). Store outside web root or in cloud storage. Serve via download handler with Content-Disposition: attachment. Block executable extensions. Scan for malware. Set restrictive permissions on upload directory.

### Information Disclosure (CWE-200)
**Severity**: LOW
**Grep Candidates**: `X-Powered-By`, `Server:`, `version`, `x-aspnet-version`, `x-aspnetmvc-version`, `generator`, `meta name="generator"`, `powered-by`, `framework`, `technology`
**Validation**: Check if the application exposes technology stack information: (1) Server/framework version headers (X-Powered-By, Server), (2) HTML meta generator tags, (3) Default error pages that reveal framework, (4) Detailed version information in API responses, (5) Technology-specific default files (web.config, server-status, elmah.axd). This information helps attackers select targeted exploits.
**False Positive Signals**: Version headers removed/overwritten, custom error pages, reverse proxy strips technology headers, intentional version exposure in health check endpoints (internal use only).
**Remediation**: Remove or override technology-identifying headers (X-Powered-By, Server). Use custom error pages. Remove default framework files from production. Set `app.disable('x-powered-by')` in Express. Configure reverse proxy to strip version headers. Remove HTML meta generator tags.
