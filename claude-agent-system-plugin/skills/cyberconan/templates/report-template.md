# CyberConan Security Audit Report

## Project: {PROJECT_NAME}
## Scan Date: {SCAN_DATE}
## Mode: {SCAN_MODE} (LITE: single verifier | FULL: two-skeptic adversarial for CRITICALs)
## Scan Depth: {SCAN_DEPTH}

---

## Security Score: {SECURITY_SCORE}/100

**Formula**: `100 - (CRITICAL * 25) - (HIGH * 10) - (MEDIUM * 3) - (LOW * 1)` (clamped to [0, 100])

| Score Range | Rating | Meaning |
|-------------|--------|---------|
| 90-100 | Excellent | Strong security posture, minor improvements possible |
| 70-89 | Good | Solid foundation, some issues to address |
| 50-69 | Needs Improvement | Significant issues found, prioritize remediation |
| 30-49 | Poor | Major vulnerabilities present, immediate action needed |
| 0-29 | Critical | Severe security gaps, application may be actively exploitable |

**This project's rating**: {SCORE_RATING}

---

## Executive Summary

{EXECUTIVE_SUMMARY}

> One paragraph summarizing: total findings, severity breakdown, most critical issues, overall security posture assessment, and top 3 recommended actions.

---

## Scanner Verdicts

| Scanner | Status | Findings | CRIT | HIGH | MED | LOW |
|---------|--------|----------|------|------|-----|-----|
| SAST (Static Analysis) | {SAST_STATUS} | {SAST_TOTAL} | {SAST_CRIT} | {SAST_HIGH} | {SAST_MED} | {SAST_LOW} |
| SCA (Dependencies) | {SCA_STATUS} | {SCA_TOTAL} | {SCA_CRIT} | {SCA_HIGH} | {SCA_MED} | {SCA_LOW} |
| Secrets Detection | {SECRETS_STATUS} | {SECRETS_TOTAL} | {SECRETS_CRIT} | {SECRETS_HIGH} | {SECRETS_MED} | {SECRETS_LOW} |
| Config Audit | {CONFIG_STATUS} | {CONFIG_TOTAL} | {CONFIG_CRIT} | {CONFIG_HIGH} | {CONFIG_MED} | {CONFIG_LOW} |
| **Total** | — | **{TOTAL_FINDINGS}** | **{TOTAL_CRIT}** | **{TOTAL_HIGH}** | **{TOTAL_MED}** | **{TOTAL_LOW}** |

Status: PASS (0 CRIT, 0 HIGH) | WARN (0 CRIT, has HIGH) | FAIL (has CRIT)

---

## Findings by Severity

### CRITICAL Findings

> These require immediate attention. Each represents a confirmed path to significant compromise.

{CRITICAL_FINDINGS}

<!-- For each CRITICAL finding: -->
<!--
#### [FINDING-ID]: [Title]

- **File**: `path/to/file.ext:line`
- **Category**: [SAST/SCA/SECRET/CONFIG]
- **CWE**: CWE-XXX
- **Verified**: [CONFIRMED by both skeptics / CONFIRMED by verifier / ESCALATED — skeptics disagreed]
- **Confidence**: N%

**Description**: [What the vulnerability is and why it's critical]

**Evidence**:
```
[Code snippet]
```

**Impact**: [What an attacker could achieve]

**Remediation**:
```
[Fixed code]
```

**Verification Notes**: [Skeptic analysis summary, if FULL mode]

---
-->

### HIGH Findings

> Significant issues that should be fixed in the next sprint. Exploitable but with more limited impact or requiring specific conditions.

{HIGH_FINDINGS}

<!-- Same structure as CRITICAL, minus skeptic analysis -->

### MEDIUM Findings

> Issues that should be addressed but are not immediately exploitable. Often defense-in-depth improvements.

{MEDIUM_FINDINGS}

### LOW Findings

> Best practice improvements. Low risk but worth addressing for a stronger security posture.

{LOW_FINDINGS}

---

## Verification Summary

| Metric | Count |
|--------|-------|
| Total findings from scanners (pre-verification) | {PRE_VERIFY_TOTAL} |
| CONFIRMED (real vulnerabilities) | {CONFIRMED_COUNT} |
| LIKELY (probable, some uncertainty) | {LIKELY_COUNT} |
| DISPUTED (mitigations exist, unclear completeness) | {DISPUTED_COUNT} |
| FALSE_POSITIVE (removed) | {FALSE_POSITIVE_COUNT} |
| **Final findings (post-verification)** | **{POST_VERIFY_TOTAL}** |
| **False positive rate** | **{FP_RATE}%** |

{VERIFICATION_MODE_NOTE}

<!-- If FULL mode: "CRITICAL findings verified by two-skeptic adversarial debate. HIGH findings verified by single verifier." -->
<!-- If LITE mode: "All findings verified by single verifier." -->

---

## Coverage Summary

### Scan Scope

| Metric | Value |
|--------|-------|
| Total files analyzed | {TOTAL_FILES} |
| Languages detected | {LANGUAGES} |
| Frameworks detected | {FRAMEWORKS} |
| Project types | {PROJECT_TYPES} |
| Dependency manifests found | {MANIFEST_COUNT} |
| Config files audited | {CONFIG_FILES_COUNT} |

### Per-Scanner Coverage

| Scanner | Files Scanned | Patterns Checked | Clean Checks |
|---------|--------------|------------------|--------------|
| SAST | {SAST_FILES} | {SAST_PATTERNS} | {SAST_CLEAN} |
| SCA | {SCA_FILES} | {SCA_PATTERNS} | {SCA_CLEAN} |
| Secrets | {SECRETS_FILES} | {SECRETS_PATTERNS} | {SECRETS_CLEAN} |
| Config | {CONFIG_FILES} | {CONFIG_PATTERNS} | {CONFIG_CLEAN} |

---

## Scan Limitations

This security audit has inherent limitations that users should be aware of:

### What This Scan Does
- Static analysis of source code for common vulnerability patterns
- Dependency analysis using training data knowledge of CVEs
- Secret pattern detection in current codebase state
- Configuration review against security best practices

### What This Scan Does NOT Do
- **No runtime analysis**: Cannot detect vulnerabilities that only manifest at runtime
- **No dynamic testing**: Does not send HTTP requests, fuzz inputs, or test endpoints
- **No penetration testing**: Does not attempt actual exploitation
- **No git history scanning**: Secrets previously committed and deleted are NOT detected (use gitleaks/trufflehog for this)
- **No network scanning**: Does not check deployed infrastructure
- **No authentication testing**: Does not test actual auth flows

### CVE Knowledge Cutoff
- Dependency CVE information is based on training data with a knowledge cutoff
- **CVEs disclosed after the training date will be missed**
- Always complement with live vulnerability databases: `npm audit`, `pip-audit`, `cargo-audit`, Snyk, etc.

### Confidence Disclaimers
- Findings are based on pattern matching and code analysis, not proof-of-concept exploitation
- False positives are possible despite verification — always review findings with project context
- False negatives are possible — this scan is not exhaustive

---

## Recommendations

### Immediate Actions (address within 24-48 hours)

{IMMEDIATE_ACTIONS}

<!-- Ordered list based on CRITICAL findings -->

### Short-Term Actions (address within 1-2 sprints)

{SHORT_TERM_ACTIONS}

<!-- Ordered list based on HIGH findings -->

### Long-Term Improvements (add to backlog)

{LONG_TERM_ACTIONS}

<!-- Based on MEDIUM/LOW findings and systemic patterns -->

### Complementary Tools

Run these tools for deeper analysis beyond what this static scan provides:

| Tool | Purpose | Install |
|------|---------|---------|
| `gitleaks` | Scan git history for leaked secrets | `brew install gitleaks` |
| `trufflehog` | Deep secret scanning with entropy analysis | `brew install trufflehog` |
| `npm audit` / `yarn audit` | Live CVE database for JS dependencies | Built-in |
| `pip-audit` | Live CVE database for Python dependencies | `pip install pip-audit` |
| `cargo-audit` | Live CVE database for Rust dependencies | `cargo install cargo-audit` |
| `govulncheck` | Go vulnerability scanner | `go install golang.org/x/vuln/cmd/govulncheck@latest` |
| `semgrep` | Advanced SAST with custom rules | `brew install semgrep` |
| `trivy` | Container and filesystem vulnerability scanner | `brew install trivy` |
| `checkov` | IaC security scanner (Terraform, K8s, Docker) | `pip install checkov` |
| `OWASP ZAP` | Dynamic application security testing | `brew install --cask owasp-zap` |

---

## Remediation Status

<!-- This section is populated if Phase 5 (auto-fix) runs -->

{REMEDIATION_STATUS}

<!-- Template for remediation entries:
| Finding ID | Title | Status | Fix Applied | Verification |
|------------|-------|--------|-------------|--------------|
| SAST-001 | SQL Injection in user query | FIXED | Parameterized query | Tests pass |
| CONFIG-001 | DEBUG=True in production | FIXED | Set to False | Config verified |
| SECRET-001 | AWS key in source | SKIPPED | Requires manual rotation | N/A |
-->

<!-- If Phase 5 did not run: -->
<!-- "Automated remediation was not requested for this scan. Run with `--fix` to enable auto-fix for applicable findings." -->

---

*Generated by CyberConan Security Audit — CAS Plugin*
*Scan completed: {SCAN_DATE}*
