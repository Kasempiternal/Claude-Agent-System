# Finding Format

Every finding MUST use this exact format. No deviations allowed — downstream verifiers and report generators parse this structure.

---

## [FINDING-ID]: [Title]

- **Severity**: CRITICAL | HIGH | MEDIUM | LOW
- **Category**: [SAST | SCA | SECRET | CONFIG]
- **CWE**: CWE-XXX (if applicable, use "N/A" if no CWE maps)
- **File**: `path/to/file.ext:line_number`
- **Confidence**: [0-100]%
- **Summary**: One-line description of the vulnerability
- **Evidence**:
  ```
  [Relevant code snippet, 5-10 lines showing the vulnerable pattern]
  ```
- **Data Flow** (SAST only):
  - Source: [Where user input enters — e.g., req.body, request.GET, stdin]
  - Through: [Processing/transformation steps — e.g., assigned to variable, passed to function]
  - Sink: [Where it reaches a dangerous function — e.g., dangerous eval, raw query, innerHTML]
- **Impact**: What an attacker could achieve (be specific: RCE, data exfiltration, privilege escalation, etc.)
- **Remediation**: Specific fix with code example:
  ```
  [Fixed code snippet showing the correct pattern]
  ```
- **False Positive Check**: Why this is NOT a false positive (what mitigations were checked and found absent)

---

## Confidence Guidelines

| Confidence | Meaning | Action |
|------------|---------|--------|
| 90-100% | Clear vulnerability with confirmed data flow from user input to dangerous sink, no mitigations found | Report as-is |
| 70-89% | Likely vulnerability — pattern matches but some context unclear or partial mitigation exists | Report with caveats |
| 50-69% | Possible vulnerability — needs manual verification | Do NOT report |
| Below 50% | Insufficient evidence | Do NOT report |

## Rules

1. **Minimum confidence to report: 70%** — anything below this threshold is noise
2. **ALWAYS include the actual code evidence** — no finding without a code snippet
3. **ALWAYS check for mitigations before reporting** — look for:
   - Framework-level protections (ORM, template engines with auto-escaping)
   - Sanitization/validation functions applied to the input
   - Parameterized queries / prepared statements
   - Content Security Policy headers
   - Middleware protections (helmet, CSRF tokens, rate limiters)
4. **NEVER report theoretical vulnerabilities without code evidence** — "this framework could be vulnerable to X" is not a finding
5. **NEVER report on test files** unless the test contains hardcoded production credentials
6. **NEVER report on documentation examples** unless they ship as actual application code

## Finding ID Convention

- SAST findings: `SAST-001`, `SAST-002`, ... (sequential)
- SCA findings: `SCA-001`, `SCA-002`, ...
- Secrets findings: `SECRET-001`, `SECRET-002`, ...
- Config findings: `CONFIG-001`, `CONFIG-002`, ...

IDs are sequential per category within a single scan. Never reuse IDs.

## Severity Classification

| Severity | Criteria |
|----------|----------|
| **CRITICAL** | Remote Code Execution, SQL Injection with data exfiltration, authentication bypass, hardcoded production secrets, unrestricted file upload leading to code running on server |
| **HIGH** | Stored XSS, SSRF, insecure deserialization, privilege escalation, directory traversal with sensitive file access, exposed admin endpoints without auth |
| **MEDIUM** | Reflected XSS, CSRF, information disclosure (stack traces, version info), missing security headers, overly permissive CORS |
| **LOW** | Missing best practices, verbose error messages, outdated but not vulnerable dependencies, minor config issues |
