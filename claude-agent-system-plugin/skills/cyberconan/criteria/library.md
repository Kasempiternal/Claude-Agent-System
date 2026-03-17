# Library/Package Vulnerability Criteria

15 vulnerability vectors for libraries and packages (npm, PyPI, gem, crate, NuGet). Libraries are especially sensitive because vulnerabilities affect all downstream consumers. Each vector includes grep patterns for initial detection, validation logic to confirm real findings, and false positive signals to avoid noise.

---

## Category: Input Validation (HIGH-CRITICAL)

### Prototype Pollution (CWE-1321)
**Severity**: CRITICAL
**Grep Candidates**: `__proto__`, `constructor`, `prototype`, `Object.assign(`, `merge(`, `deepMerge(`, `extend(`, `defaults(`, `clone(`, `set(`, `has(`, `get(`, `lodash.merge`, `deepClone`, `recursiveMerge`, `for...in`
**Validation**: Check if any exported function performs deep merge, deep clone, deep set, or recursive object traversal on user-supplied objects. The vulnerability occurs when a function iterates over object keys (including __proto__) and copies them to a target, polluting Object.prototype. Key patterns: (1) Recursive merge functions using for...in or Object.keys() without filtering dangerous keys, (2) Functions that accept arbitrary objects and spread/merge them, (3) Property path setters (lodash set, dot-prop) that allow __proto__ as path segment.
**False Positive Signals**: Object.create(null) as merge target, explicit filtering of __proto__/constructor/prototype keys, non-recursive (shallow) merge only, Map/Set used instead of plain objects, input restricted to known schema (not arbitrary objects).
**Remediation**: Filter dangerous keys (__proto__, constructor, prototype) in all recursive operations. Use Object.create(null) as merge targets. Add explicit checks: skip keys matching __proto__, constructor, or prototype. For path-based setters, validate that no segment is a dangerous key. Add regression tests with __proto__ payloads.

### Code Evaluation Injection (CWE-95)
**Severity**: CRITICAL
**Grep Candidates**: `eval`, `Function(`, `setTimeout(` with string arg, `setInterval(` with string arg, `vm.runInContext(`, `vm.runInNewContext(`, `vm.createScript(`, `compile(`, `code_eval`
**Validation**: Check if any exported function passes external/user input to code-evaluation primitives (the eval built-in or the Function constructor, which creates functions from strings). Look for: (1) Template engines that compile user strings into executable code, (2) Configuration parsers that dynamically evaluate config values, (3) Dynamic property access patterns that use evaluation as shortcut, (4) Expression evaluators that compile strings to runnable functions. The function input may arrive indirectly through configuration objects, template strings, or callback arguments.
**False Positive Signals**: Evaluation used only with hardcoded strings (no external input), vm module with proper sandbox, Function constructor with validated/restricted input, evaluation in development tooling only (not exported API).
**Remediation**: Never pass external input to code-evaluation primitives. For template engines: use a safe subset language (not full JS). For configuration: use JSON.parse (safe) instead of dynamic evaluation. For dynamic property access: use bracket notation. For expression evaluation: use a proper parser (jsep, mathjs) instead.

### ReDoS - Regular Expression Denial of Service (CWE-1333)
**Severity**: HIGH
**Grep Candidates**: `RegExp(`, `.match(`, `.test(`, `.replace(`, `.search(`, `.split(`, `re.compile(`, `re.match(`, `re.search(`, `Pattern.compile(`
**Validation**: Check all regular expressions (especially those processing user input) for catastrophic backtracking patterns. Dangerous patterns include: (1) Nested quantifiers: (a+)+, (a*)\*, (a|b)\*b, (2) Overlapping alternations: (a|a)+, (3) Quantified groups with overlap: (\w+\s\*)+, ([a-zA-Z]+)\*, (4) Repetition of patterns that can match empty: (a?)+. Test suspicious regexes with tools like rxxr2, regex-static-analysis, or safe-regex. Even a single vulnerable regex can DoS the entire process.
**False Positive Signals**: Regex is only used with trusted/length-limited input, regex has been verified with safe-regex or equivalent tool, regex uses atomic groups or possessive quantifiers (if supported), regex complexity is bounded by input length limits.
**Remediation**: Rewrite regexes to avoid nested quantifiers. Use atomic groups where available. Set input length limits before regex processing. Use safe-regex or rxxr2 to validate regex safety. Consider using RE2 (linear-time regex engine) for user-input processing. Add timeout protection for regex operations. Test with crafted worst-case inputs.

### Zip Slip (CWE-22)
**Severity**: HIGH
**Grep Candidates**: `unzip`, `extract(`, `extractAll(`, `ZipFile(`, `ZipEntry`, `getEntryName(`, `tar.extract(`, `tarfile.extractall(`, `decompress(`, `archiver`, `adm-zip`, `yauzl`, `node-tar`, `entry.fileName`, `entry.name`
**Validation**: Check archive extraction code for path traversal via crafted entry names. Look for: (1) Entry names containing ../ not being validated, (2) Extracted file paths not checked against the target directory, (3) extractAll() called without a path validation wrapper. A malicious archive can overwrite files outside the extraction directory (e.g., config files, SSH keys, cron jobs).
**False Positive Signals**: Entry name validated to reject ../ before extraction, resolved path checked with startsWith(targetDir), extraction library handles path validation internally (verify version), extraction to temp directory with controlled move afterward.
**Remediation**: Validate each entry name before extraction: resolve the full path and verify it starts with the intended target directory. Strip or reject entries containing ../ or absolute paths. Use libraries with built-in Zip Slip protection (node-tar >= 6.2.1 patches this). Never trust filenames from archives.

---

## Category: Parsing Vulnerabilities (HIGH)

### XXE in XML Parsers (CWE-611)
**Severity**: HIGH
**Grep Candidates**: `XMLParser`, `createParser(`, `parseXML(`, `xml2js`, `fast-xml-parser`, `libxmljs`, `xmldom`, `etree.parse(`, `etree.fromstring(`, `SAXParser`, `DocumentBuilder`, `Nokogiri`, `REXML`
**Validation**: Check if the library provides or uses XML parsing with external entity processing enabled by default. Libraries that wrap XML parsers should disable DTDs and external entities. Look for: (1) XML parser created without security-hardening options, (2) Default configuration that allows DOCTYPE, (3) No option to disable external entity resolution. This is especially critical if the library is a parser itself or processes XML from untrusted sources.
**False Positive Signals**: External entities explicitly disabled in default config, library wraps defusedxml or equivalent, DTD processing disabled by default, library explicitly documented as XXE-safe with secure defaults.
**Remediation**: If your library parses XML: disable external entity processing by default. Provide a secure default configuration. Document the security implications of enabling external entities. If wrapping a parser, enforce secure settings regardless of user config. Test with XXE payloads.

### Unsafe YAML Loading (CWE-502)
**Severity**: HIGH
**Grep Candidates**: `yaml.load(`, `yaml.unsafe_load(`, `YAML.load(`, `yaml.parse(`, `Psych.load(`, `ruamel.yaml`, `pyyaml`, `js-yaml`, `safeLoad`, `safe_load`
**Validation**: Check if the library uses yaml.load() without SafeLoader (Python) or equivalent safe parsing. In Python, yaml.load(data) without Loader argument uses the full loader that can instantiate arbitrary Python objects. In Ruby, YAML.load() can deserialize arbitrary objects. In JS, check js-yaml usage and whether DEFAULT_SCHEMA includes dangerous types.
**False Positive Signals**: yaml.safe_load() or yaml.load(data, Loader=SafeLoader), YAML.safe_load() in Ruby, js-yaml with DEFAULT_SAFE_SCHEMA, library only outputs YAML (does not parse), YAML input comes from trusted internal sources only.
**Remediation**: Always use safe YAML loading: yaml.safe_load() in Python, YAML.safe_load() in Ruby, yaml.load() with schema: SAFE_SCHEMA in js-yaml. If the library parses YAML, use safe loading by default. Document the security implications of unsafe loading.

### JSON Parsing DoS
**Severity**: MEDIUM
**Grep Candidates**: `JSON.parse(`, `json.loads(`, `json.load(`, `JsonParser`, `ObjectMapper`, `Gson`, `maxDepth`, `maxKeys`, `recursion`, `nested`
**Validation**: Check if the library processes JSON input without depth or size limits. Deeply nested JSON objects can cause stack overflow. Very large JSON with many keys can exhaust memory. Look for: (1) No recursion depth limit in JSON processing, (2) No maximum size check before parsing, (3) Recursive operations on parsed JSON without depth guards.
**False Positive Signals**: Input size limited before parsing, recursion depth check in recursive operations, streaming JSON parser with bounded buffer, JSON schema validation that limits nesting depth.
**Remediation**: Limit input size before parsing (reject payloads over a reasonable maximum). Implement depth limits for recursive operations on parsed JSON. Use streaming parsers for large inputs. Set maximum key count limits.

### CSV Injection (CWE-1236)
**Severity**: MEDIUM
**Grep Candidates**: `csv`, `CSV`, `writerow(`, `writerows(`, `to_csv(`, `createCsvWriter`, `papa.unparse`, `csvStringify`, `xlsx`, `exceljs`, `spreadsheet`, `formula`
**Validation**: Check if the library generates CSV/spreadsheet output that includes user-controlled data without sanitizing formula-injection characters. Cells starting with =, +, -, @, \t, \r can be interpreted as formulas when opened in Excel/Google Sheets. Look for: (1) User data written directly to CSV cells, (2) No sanitization of formula-trigger characters, (3) Export functionality that includes user-generated content.
**False Positive Signals**: Output prefixed with single quote or tab (prevents formula interpretation), data validated/sanitized before CSV output, output is JSON/API response (not spreadsheet), CSV consumed programmatically (not opened in spreadsheet software).
**Remediation**: Sanitize cell values: prepend a single quote or tab to values starting with =, +, -, @, \t, \r. Document the CSV injection risk in library documentation. Consider providing a sanitize option that is on by default.

---

## Category: Resource Management (MEDIUM-HIGH)

### Unchecked Resource Consumption (CWE-400)
**Severity**: HIGH
**Grep Candidates**: `Buffer.alloc(`, `Buffer.allocUnsafe(`, `new Array(`, `new ArrayBuffer(`, `malloc(`, `allocate(`, `resize(`, `length`, `size`, `count`, `limit`, `max`, `Infinity`
**Validation**: Check if library functions accept size/count parameters from external input without upper bound validation. Look for: (1) Buffer/array allocation with user-controlled size, (2) Loop count from user input without maximum, (3) Recursive operations without depth limit, (4) String/data operations that grow proportionally to input without bounds.
**False Positive Signals**: Maximum size constants enforced, input size validated before allocation, streaming processing (constant memory), pre-allocated fixed-size buffers, configuration option for maximum limits.
**Remediation**: Validate and cap all size/count parameters. Set sensible defaults for maximum sizes. Reject inputs exceeding limits with clear error messages. Use streaming processing for large inputs. Document resource limits in API documentation.

### Memory Safety Issues (CWE-787)
**Severity**: CRITICAL
**Grep Candidates**: `Buffer.from(`, `Buffer.alloc(`, `readUInt`, `writeUInt`, `copy(`, `slice(`, `subarray(`, `DataView`, `ArrayBuffer`, `offset`, `byteLength`, `Uint8Array`, `memcpy`, `memmove`, `strcpy`, `strncpy`
**Validation**: Check buffer/memory operations for: (1) Out-of-bounds read/write (accessing index beyond buffer length), (2) Integer overflow in offset/length calculations, (3) Off-by-one errors in buffer slicing, (4) Use-after-free in native addons, (5) Buffer operations without bounds checking. This is especially critical for libraries with native (C/C++) addons or N-API modules.
**False Positive Signals**: Bounds checking before all buffer operations, safe buffer APIs used, TypedArray bounds checking (throws RangeError), Rust/memory-safe language implementation, comprehensive test coverage for edge cases.
**Remediation**: Always validate offsets and lengths before buffer operations. Use safe APIs that throw on out-of-bounds access. For native addons: use address sanitizer (ASan) in testing, implement bounds checking in all buffer operations, prefer Rust or memory-safe languages for new native modules. Add fuzzing to CI.

### Integer Overflow (CWE-190)
**Severity**: HIGH
**Grep Candidates**: `parseInt(`, `Number(`, `parseFloat(`, `Math.pow(`, `<<`, `>>`, `>>>`, `*`, `+`, `0x`, `MAX_SAFE_INTEGER`, `MAX_VALUE`, `int32`, `uint32`, `BigInt`
**Validation**: Check arithmetic operations for integer overflow, especially: (1) Size calculations for buffer allocation (width * height * channels for image processing), (2) Length calculations that multiply user inputs, (3) Bit shift operations that can overflow 32-bit integers, (4) Accumulator variables that grow without overflow check. In JavaScript, numbers above Number.MAX_SAFE_INTEGER lose precision, which can cause security issues.
**False Positive Signals**: BigInt used for large number operations, overflow checks before arithmetic, library only handles small bounded values, safe math libraries used (bignumber.js).
**Remediation**: Check for overflow before arithmetic operations: validate that inputs are within safe bounds. Use BigInt for large integer arithmetic. Add overflow checks before buffer size calculations. Use libraries like safe-math or big-integer for security-critical calculations.

### Symlink Following (CWE-59)
**Severity**: HIGH
**Grep Candidates**: `readFile(`, `writeFile(`, `readFileSync(`, `writeFileSync(`, `createReadStream(`, `createWriteStream(`, `lstat(`, `stat(`, `realpath(`, `symlink(`, `link(`, `access(`, `fs.`, `os.path`, `Path`
**Validation**: Check if file operations in the library follow symbolic links without verification. Look for: (1) File read/write that does not check if the target is a symlink, (2) Path traversal via symlink chains, (3) Temp file creation in shared directories without O_NOFOLLOW, (4) Archive extraction that creates symlinks (combined with zip slip).
**False Positive Signals**: lstat() used to check for symlinks before operating, O_NOFOLLOW flag used in file open, operations restricted to known directories, library operates only on its own temporary directory, realpath() verification before operations.
**Remediation**: Use lstat() instead of stat() to detect symlinks. Check if the resolved path matches the expected path after realpath(). Use O_NOFOLLOW flag when available. For temporary files, use mkdtemp() with proper permissions. Never follow symlinks in archive extraction.

### Timing Attacks (CWE-208)
**Severity**: MEDIUM
**Grep Candidates**: `===`, `==`, `!==`, `!=`, `strcmp(`, `equals(`, `compareTo(`, `localeCompare(`, `hmac`, `signature`, `verify`, `token`, `digest`, `hash`, `secret`
**Validation**: Check if the library compares secrets (HMAC signatures, API keys, tokens, password hashes) using standard string comparison. Standard comparison short-circuits on the first differing byte, allowing timing attacks that reveal the secret one byte at a time. Look for authentication/verification functions that compare secrets with non-constant-time operations.
**False Positive Signals**: crypto.timingSafeEqual() or hmac.compare() used, secure_compare() or equivalent constant-time comparison, bcrypt.compare() (internally constant-time), comparison only of non-secret values (IDs, public data), HMAC verification using the crypto library built-in verify function.
**Remediation**: Use constant-time comparison for all secret comparisons: crypto.timingSafeEqual() in Node.js, hmac.compare_digest() in Python, MessageDigest.isEqual() in Java. Never use standard equality operators for secrets, tokens, or signatures.

---

## Category: Supply Chain (MEDIUM)

### Typosquatting Signals
**Severity**: MEDIUM
**Grep Candidates**: `require(`, `import`, `from '`, `from "`, `dependencies`, `devDependencies`, `install`
**Validation**: Check dependency names for potential typosquatting: (1) Names very similar to popular packages (one character difference), (2) Names with common typos of popular packages (e.g., lodassh instead of lodash), (3) Scoped packages that mimic unscoped popular packages, (4) Packages with zero or very few downloads but similar names to popular ones. Cross-reference against known typosquatting databases.
**False Positive Signals**: Well-known packages with intentionally similar names (official forks), scoped packages from verified organizations, private registry packages, packages with established download history and community trust.
**Remediation**: Verify package names carefully. Use lockfiles to pin exact versions. Use npm audit / pip audit / bundler-audit. Enable Dependabot or Snyk for dependency monitoring. Consider using a private registry as a proxy with allowlisted packages.

### Suspicious Lifecycle Scripts
**Severity**: HIGH
**Grep Candidates**: `preinstall`, `postinstall`, `preuninstall`, `postuninstall`, `prepare`, `scripts`, `setup.py`, `setup.cfg`, `install_requires`, `entry_points`, `Rakefile`, `build.rs`
**Validation**: Check package lifecycle scripts (npm preinstall/postinstall, Python setup.py, gem extensions) for suspicious behavior: (1) Network calls (curl, wget, fetch) in install scripts, (2) File system operations outside the package directory, (3) Environment variable exfiltration, (4) Encoded/obfuscated code in install scripts, (5) Binary downloads during installation. These are common vectors for supply chain attacks.
**False Positive Signals**: Native addon compilation (node-gyp, cargo build), known build tools (webpack, babel, tsc) in prepare script, husky git hooks setup, standard postinstall tasks (generating types, building from source), well-established packages with expected lifecycle scripts.
**Remediation**: Audit all lifecycle scripts before installation. Use npm install --ignore-scripts and selectively enable needed scripts. Review setup.py/setup.cfg for suspicious code. Use tools like socket.dev or npm audit signatures. Pin dependencies to exact versions and verify checksums.
