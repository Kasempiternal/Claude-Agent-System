# CyberConan Criteria Index

## Project Type Detection & Criteria Mapping

This file maps detected project types to the criteria files each scanner should load. The orchestrator detects the project type during reconnaissance, then loads the appropriate criteria files into scanner prompts.

---

## Detection Heuristics

### Backend Detection

| Signal | Framework |
|--------|-----------|
| `package.json` with `express`, `fastify`, `koa`, `hapi`, `nestjs` | Node.js backend |
| `requirements.txt` or `Pipfile` with `flask`, `django`, `fastapi`, `tornado`, `sanic` | Python backend |
| `go.mod` or `*.go` files with `net/http`, `gin`, `echo`, `fiber`, `chi` | Go backend |
| `pom.xml` or `build.gradle` with `spring-boot`, `spring-web`, `javax.servlet` | Java Spring |
| `Gemfile` with `rails`, `sinatra`, `grape` | Ruby backend |
| `composer.json` with `laravel/framework`, `symfony/framework-bundle` | PHP backend |
| `*.csproj` with `Microsoft.AspNetCore`, `Microsoft.NET.Sdk.Web` | .NET backend |
| `Cargo.toml` with `actix-web`, `axum`, `rocket`, `warp` | Rust backend |

### Frontend Detection

| Signal | Framework |
|--------|-----------|
| `package.json` with `react`, `react-dom`, `next` | React / Next.js |
| `package.json` with `vue`, `nuxt` | Vue / Nuxt |
| `package.json` with `@angular/core` | Angular |
| `package.json` with `svelte`, `@sveltejs/kit` | Svelte / SvelteKit |
| `*.html` files with `<script>` tags, no framework lockfile | Vanilla JS |
| `package.json` with `vite`, `webpack`, `parcel` (no backend deps) | Frontend build tool |

### Mobile Detection

| Signal | Platform |
|--------|----------|
| `*.xcodeproj`, `*.xcworkspace`, `Podfile`, `*.swift`, `*.m` files | iOS (Swift/ObjC) |
| `build.gradle` with `com.android.application`, `AndroidManifest.xml` | Android (Kotlin/Java) |
| `package.json` with `react-native` | React Native |
| `pubspec.yaml` with `flutter` | Flutter |
| `*.xcodeproj` AND `android/` directory AND (`react-native` or `flutter`) | Cross-platform mobile |

### Library/Package Detection

| Signal | Ecosystem |
|--------|-----------|
| `package.json` with `main` or `exports` field, no `start` script, `files` field | npm package |
| `setup.py`, `setup.cfg`, or `pyproject.toml` with `[project]` or `[tool.setuptools]` | PyPI package |
| `*.gemspec` file | Ruby gem |
| `Cargo.toml` with `[lib]` section, no `[[bin]]` | Rust crate |
| `*.nuspec` or `*.csproj` with `<IsPackable>true</IsPackable>` | NuGet package |

### Infrastructure Detection

| Signal | Type |
|--------|------|
| `Dockerfile`, `docker-compose.yml`, `.dockerignore` | Docker |
| `*.yaml`/`*.yml` with `apiVersion`, `kind: Deployment/Service/Pod` | Kubernetes |
| `*.tf`, `*.tfvars` files | Terraform |
| `template.yaml` with `AWSTemplateFormatVersion` or `AWS::Serverless` | CloudFormation/SAM |
| `.github/workflows/*.yml`, `.gitlab-ci.yml`, `Jenkinsfile`, `.circleci/config.yml` | CI/CD |
| `ansible/`, `playbook.yml`, `inventory.ini` | Ansible |
| `helm/`, `Chart.yaml` | Helm charts |

---

## Criteria Loading Rules

| Detected Type | Load These Criteria Files |
|---------------|--------------------------|
| Backend | `backend.md` + `universal.md` |
| Frontend | `frontend.md` + `universal.md` |
| Mobile | `mobile.md` + `universal.md` |
| Library/Package | `library.md` + `universal.md` |
| Infrastructure | `infrastructure.md` + `universal.md` |
| Full-stack (backend + frontend detected) | `backend.md` + `frontend.md` + `universal.md` |
| Full-stack + Mobile | `backend.md` + `frontend.md` + `mobile.md` + `universal.md` |
| Monorepo (mixed) | Load all relevant per-workspace, always include `universal.md` |

## Scanner Assignment Strategy

When multiple criteria files are loaded, distribute vectors across scanners to avoid duplication:

- **Scanner 1**: First criteria file (e.g., `backend.md` vectors 1-18)
- **Scanner 2**: First criteria file (e.g., `backend.md` vectors 19-35)
- **Scanner 3**: Second criteria file (e.g., `frontend.md` all vectors)
- **Scanner 4**: `universal.md` all vectors
- **Scanner 5**: Cross-cutting concerns (vectors that span categories)

For smaller projects (< 500 files), reduce to 3 scanners and merge criteria assignments.
