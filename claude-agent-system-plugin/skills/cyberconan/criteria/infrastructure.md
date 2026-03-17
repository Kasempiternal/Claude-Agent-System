# Infrastructure Vulnerability Criteria

10 vulnerability vectors for infrastructure configurations (Docker, Kubernetes, Terraform, CloudFormation, CI/CD). Each vector includes grep patterns for initial detection, validation logic to confirm real findings, and false positive signals to avoid noise.

---

## Category: Container Security (HIGH)

### Docker Root User
**Severity**: HIGH
**Grep Candidates**: `FROM`, `USER`, `Dockerfile`, `docker-compose`, `user:`, `--user`, `gosu`, `su-exec`, `adduser`, `useradd`, `addgroup`, `groupadd`
**Validation**: Check Dockerfiles for containers that run as root (the default). A Dockerfile without a `USER` directive runs everything as root. Look for: (1) No USER directive after the final FROM, (2) USER root set explicitly, (3) USER set to non-root but then switched back to root, (4) docker-compose.yml without `user:` override. Root in a container can escape to host in certain misconfigurations.
**False Positive Signals**: `USER` directive set to non-root user before CMD/ENTRYPOINT, multi-stage build where root is used only in build stage (final stage has non-root USER), `gosu`/`su-exec` used to drop privileges in entrypoint script, read-only root filesystem configured, rootless container runtime.
**Remediation**: Add a non-root USER directive in Dockerfile: `RUN addgroup -S appgroup && adduser -S appuser -G appgroup` then `USER appuser`. Set this before CMD/ENTRYPOINT. In docker-compose: add `user: "1000:1000"`. Use `--read-only` flag for additional hardening. If root is needed during build, switch to non-root for runtime.

### Docker Socket Exposure
**Severity**: CRITICAL
**Grep Candidates**: `/var/run/docker.sock`, `docker.sock`, `volumes:`, `-v /var/run`, `--mount`, `DOCKER_HOST`, `docker:dind`, `docker-in-docker`
**Validation**: Check docker-compose.yml, Kubernetes manifests, and run scripts for mounting the Docker socket into containers. Mounting `/var/run/docker.sock` gives the container full control over the Docker daemon — equivalent to root access on the host. Look for: (1) Volume mount of docker.sock, (2) DOCKER_HOST environment variable pointing to the socket, (3) docker:dind (Docker-in-Docker) without proper isolation.
**False Positive Signals**: Docker socket proxy with restricted API access (Tecnativa/docker-socket-proxy), CI/CD runner that intentionally needs Docker access with proper isolation, development-only configuration not used in production, rootless Docker socket.
**Remediation**: Never mount the Docker socket into application containers. For CI/CD that needs Docker: use Kaniko (image building without Docker daemon), BuildKit, or Podman. If socket access is required, use a Docker socket proxy that restricts API calls (Tecnativa/docker-socket-proxy). For monitoring: use read-only APIs through the proxy.

### Privileged Containers
**Severity**: CRITICAL
**Grep Candidates**: `privileged`, `--privileged`, `securityContext`, `capabilities`, `SYS_ADMIN`, `NET_ADMIN`, `SYS_PTRACE`, `ALL`, `add:`, `allowPrivilegeEscalation`, `CAP_`, `NET_RAW`, `seccomp`, `apparmor`
**Validation**: Check for: (1) `--privileged` flag in Docker run commands or docker-compose, (2) `privileged: true` in Kubernetes securityContext, (3) Dangerous capabilities added (SYS_ADMIN, NET_ADMIN, SYS_PTRACE, ALL), (4) `allowPrivilegeEscalation: true` in Kubernetes, (5) Disabled seccomp/AppArmor profiles. Privileged containers have nearly full host access and can trivially escape to the host.
**False Positive Signals**: Capabilities added with justification and minimal scope (NET_BIND_SERVICE for port 80/443), development/testing configuration not used in production, init containers that need temporary elevated privileges, DaemonSet pods that legitimately need host access (log collectors, network plugins).
**Remediation**: Never use `--privileged` or `privileged: true`. Drop all capabilities and add only what is needed: `capabilities: { drop: ["ALL"], add: ["NET_BIND_SERVICE"] }`. Set `allowPrivilegeEscalation: false`. Enable seccomp and AppArmor profiles. Use Pod Security Admission (PSA) or OPA/Kyverno to enforce policies cluster-wide.

### Base Image Vulnerabilities
**Severity**: MEDIUM
**Grep Candidates**: `FROM`, `:latest`, `FROM ubuntu`, `FROM node`, `FROM python`, `FROM alpine`, `FROM debian`, `FROM centos`, `FROM amazonlinux`, `@sha256:`, `AS builder`
**Validation**: Check Dockerfile FROM directives for: (1) `:latest` tag (unpinned, unpredictable), (2) Old/EOL base images (Ubuntu 18.04, CentOS 7, Node 14, Python 3.7), (3) Full OS images instead of slim/alpine variants (larger attack surface), (4) No digest pinning (@sha256:) for reproducibility, (5) Excessive number of layers/packages installed.
**False Positive Signals**: Digest-pinned images (FROM node:20-alpine@sha256:abc...), regularly updated base images in CI, distroless images (gcr.io/distroless), multi-stage builds where large images are build-only, Dependabot/Renovate configured for Dockerfile updates.
**Remediation**: Pin base images to specific versions with digest: `FROM node:20-alpine@sha256:...`. Use minimal base images (alpine, slim, distroless). Set up automated base image updates (Dependabot, Renovate). Use multi-stage builds to minimize final image. Scan images with Trivy, Grype, or Snyk Container.

---

## Category: Cloud/Config (HIGH)

### Open Storage Buckets
**Severity**: CRITICAL
**Grep Candidates**: `s3:`, `aws_s3_bucket`, `google_storage_bucket`, `azurerm_storage`, `acl`, `public-read`, `public-read-write`, `allUsers`, `allAuthenticatedUsers`, `BucketPolicy`, `Principal: "*"`, `Effect: Allow`, `block_public`, `PublicAccessBlockConfiguration`
**Validation**: Check for: (1) S3 bucket ACLs set to `public-read` or `public-read-write`, (2) S3 bucket policies with `Principal: "*"`, (3) GCS buckets with `allUsers` or `allAuthenticatedUsers` bindings, (4) Azure storage with public blob access enabled, (5) Missing public access block configuration. Also check Terraform/CloudFormation for storage resources without access restrictions.
**False Positive Signals**: Intentionally public static website hosting (with only static assets), CloudFront/CDN in front of bucket (not directly public), public access block enabled at account level, bucket policy restricts to specific VPC endpoints, read-only public access for package repositories.
**Remediation**: Enable S3 Block Public Access at the account level. Use bucket policies with specific IAM principals, never `"*"`. For GCS: avoid `allUsers` and `allAuthenticatedUsers`. For Azure: disable public blob access. Use CloudFront/CDN for public content instead of direct bucket access. Audit with aws s3api get-bucket-policy and get-bucket-acl.

### Weak TLS Configuration
**Severity**: HIGH
**Grep Candidates**: `TLSv1`, `TLSv1.0`, `TLSv1.1`, `SSLv3`, `ssl_protocols`, `tls_version`, `MinimumTLSVersion`, `min_tls_version`, `ssl_ciphers`, `RC4`, `DES`, `3DES`, `MD5`, `NULL`, `EXPORT`, `cipher_suites`, `ssl_policy`
**Validation**: Check for: (1) TLS 1.0 or 1.1 enabled (deprecated, known vulnerabilities), (2) SSLv3 enabled (POODLE), (3) Weak cipher suites (RC4, DES, 3DES, NULL, EXPORT, MD5-based), (4) Missing HSTS headers, (5) Self-signed certificates in production. Check nginx/Apache configs, load balancer settings, and Terraform/CloudFormation TLS policies.
**False Positive Signals**: TLS 1.2+ only with strong ciphers, AWS ALB/CloudFront with modern TLS policy (TLSv1.2_2021 or later), HSTS configured, certificate from trusted CA, weak TLS only in development/testing configuration.
**Remediation**: Require TLS 1.2 minimum (TLS 1.3 preferred). Use strong cipher suites only (AEAD ciphers: AES-GCM, ChaCha20-Poly1305). Disable RC4, DES, 3DES, NULL, EXPORT ciphers. Enable HSTS with long max-age. Use Mozilla SSL Configuration Generator for recommended settings. In AWS: use TLSv1.2_2021 or later security policy.

### Debug Endpoints Exposed
**Severity**: HIGH
**Grep Candidates**: `/debug`, `/actuator`, `/admin`, `/swagger`, `/api-docs`, `/graphiql`, `/playground`, `/__debug__`, `/phpinfo`, `/server-status`, `/server-info`, `/elmah`, `/trace`, `/env`, `/configprops`, `/metrics`, `/health`, `/dump`, `/heapdump`
**Validation**: Check if debug, monitoring, or admin endpoints are accessible in production. Look for: (1) Spring Boot Actuator endpoints without authentication (/actuator/env, /actuator/heapdump), (2) Swagger/OpenAPI docs exposed in production, (3) Django debug toolbar enabled, (4) PHP info pages, (5) GraphiQL/Playground in production, (6) Debug routes not removed or protected. These endpoints can leak sensitive configuration, environment variables, and internal state.
**False Positive Signals**: Actuator endpoints protected by authentication/authorization, debug endpoints restricted to internal network (VPN, private subnet), endpoints disabled in production configuration, health check endpoint intentionally public (contains no sensitive data), API docs behind authentication.
**Remediation**: Disable all debug endpoints in production. For Spring Boot: restrict Actuator endpoints with `management.endpoints.web.exposure.include=health,info` and secure with authentication. Remove Swagger/API docs from production builds. Use environment-conditional configuration to disable debug features. Restrict debug endpoints to internal networks if needed.

### Missing CORS Restrictions
**Severity**: MEDIUM
**Grep Candidates**: `Access-Control-Allow-Origin`, `cors`, `CORS`, `AllowOrigin`, `allowed_origins`, `allow_origins`, `origin`, `*`, `credentials`
**Validation**: Check server/proxy configurations for overly permissive CORS settings: (1) `Access-Control-Allow-Origin: *` in production, (2) Origin reflected from request without validation, (3) Wildcard origin combined with credentials, (4) CORS configured at reverse proxy level without restriction. Check nginx, Apache, API gateway, and application-level CORS configuration.
**False Positive Signals**: Specific origin allowlist configured, public API intentionally allowing all origins (no credentials), CORS restricted at API gateway level, development-only wildcard CORS, no cross-origin requests needed (same-origin app).
**Remediation**: Configure specific allowed origins instead of wildcards. Never combine wildcard origin with credentials. Use a strict allowlist of trusted domains. Configure CORS at the application level (not just proxy) for defense-in-depth. Restrict allowed methods and headers to only what is needed.

---

## Category: CI/CD (MEDIUM-HIGH)

### Secrets in CI Configuration
**Severity**: CRITICAL
**Grep Candidates**: `AKIA`, `aws_access_key`, `aws_secret_key`, `API_KEY`, `SECRET`, `TOKEN`, `PASSWORD`, `PRIVATE_KEY`, `ghp_`, `ghr_`, `glpat-`, `sk-`, `xoxb-`, `xoxp-`, `-----BEGIN`, `Basic `, `Bearer `, `env:`, `secrets.`, `${{`
**Validation**: Check CI/CD configuration files (.github/workflows/*.yml, .gitlab-ci.yml, Jenkinsfile, .circleci/config.yml, bitbucket-pipelines.yml) for: (1) Hardcoded secrets, API keys, or tokens in workflow files, (2) Secrets echoed or printed in log output, (3) Secrets passed as command-line arguments (visible in process lists), (4) Secrets in environment variables of public workflows. Also check for secrets committed in any file detected by git log.
**False Positive Signals**: References to secret store (${{ secrets.API_KEY }}), environment variable references without values, placeholder/example values clearly marked, encrypted secrets (GitHub encrypted secrets, GitLab CI variables), vault integration for secret retrieval.
**Remediation**: Use the CI platform's secret management (GitHub Secrets, GitLab CI Variables, Jenkins Credentials). Never hardcode secrets in workflow files. Use OIDC for cloud provider authentication (no long-lived keys). Mask secrets in logs. Use tools like git-secrets, truffleHog, or gitleaks to scan for committed secrets.

### Unpinned Actions/Images
**Severity**: MEDIUM
**Grep Candidates**: `uses:`, `@latest`, `@main`, `@master`, `@v1`, `@v2`, `image:`, `:latest`, `docker://`, `container:`, `services:`
**Validation**: Check CI/CD workflows for: (1) GitHub Actions referenced by branch instead of commit SHA (`uses: actions/checkout@main` instead of `uses: actions/checkout@abc123`), (2) Docker images using `:latest` or floating tags in CI, (3) Third-party actions not pinned to specific commit SHA, (4) Custom actions from untrusted repositories. Unpinned actions can be silently modified by maintainers or attackers who compromise the repository.
**False Positive Signals**: Actions pinned to full commit SHA (`uses: actions/checkout@8e5e7e...`), official GitHub-maintained actions with major version pinning and Dependabot configured, private/internal actions from trusted org, Docker images pinned by digest.
**Remediation**: Pin all GitHub Actions to full commit SHA: `uses: actions/checkout@8e5e7e5a7fad1f3b0e9b89c9cf1b82d8d6e7f3a2`. Use Dependabot to keep pinned versions updated. Pin Docker images by digest. For third-party actions, fork to your org and pin. Use StepSecurity harden-runner for monitoring.

### Missing Branch Protection
**Severity**: MEDIUM
**Grep Candidates**: `branch_protection`, `protected_branches`, `required_pull_request_reviews`, `required_status_checks`, `enforce_admins`, `restrict_pushes`, `merge_checks`, `approval`, `codeowners`, `CODEOWNERS`
**Validation**: Check for: (1) No branch protection rules on main/master/production branches, (2) No required pull request reviews before merge, (3) No required status checks (CI must pass), (4) Admins exempt from protection rules (enforce_admins: false), (5) Force push allowed on protected branches, (6) No CODEOWNERS file for critical paths. Check GitHub/GitLab settings or Terraform configurations for branch protection resources.
**False Positive Signals**: Branch protection configured via Terraform/Pulumi (not visible in repo settings UI), protection rules set at org level, trunk-based development with proper CI gates, monorepo with per-directory protection, GitLab merge request approvals configured.
**Remediation**: Enable branch protection on main/production branches. Require at least 1 pull request review. Require status checks to pass before merge. Enable enforce_admins. Disable force push. Add CODEOWNERS for critical paths. Use Terraform github_branch_protection resource for infrastructure-as-code management. Enable signed commits requirement.
