# Claude Agent System Setup Script (PowerShell)
# Installs the /systemcc command system for Claude Code

param(
    [switch]$Global,
    [switch]$Help
)

$ErrorActionPreference = "Stop"

# Colors
function Write-Success { param($msg) Write-Host "[OK] $msg" -ForegroundColor Green }
function Write-Info { param($msg) Write-Host "[INFO] $msg" -ForegroundColor Yellow }
function Write-Err { param($msg) Write-Host "[ERROR] $msg" -ForegroundColor Red }

Write-Host "Claude Agent System Setup" -ForegroundColor Blue
Write-Host "==========================" -ForegroundColor Blue
Write-Host ""

if ($Help) {
    Write-Host "Usage: .\setup-claude-agent-system.ps1 [OPTIONS]"
    Write-Host ""
    Write-Host "Options:"
    Write-Host "  -Global    Install globally to ~/.claude/ (available in all projects)"
    Write-Host "  -Help      Show this help message"
    Write-Host ""
    Write-Host "Without -Global, installs to the current project's .claude/ directory"
    exit 0
}

# Configuration
$REPO_URL = "https://github.com/Kasempiternal/Claude-Agent-System"
$TEMP_DIR = Join-Path $env:TEMP "claude-agent-system-$(Get-Random)"

# Determine installation directory
if ($Global) {
    $CLAUDE_DIR = Join-Path $env:USERPROFILE ".claude"
    Write-Success "Global installation mode: Installing to $CLAUDE_DIR"
    Write-Info "Commands will be available in ALL projects"
} else {
    # Try to find git root
    try {
        $gitRoot = git rev-parse --show-toplevel 2>$null
        if ($LASTEXITCODE -eq 0 -and $gitRoot) {
            $PROJECT_ROOT = $gitRoot
            Write-Success "Detected git repository at: $PROJECT_ROOT"
        } else {
            throw
        }
    } catch {
        $PROJECT_ROOT = Get-Location
        Write-Info "Not in a git repository. Using current directory: $PROJECT_ROOT"
    }
    $CLAUDE_DIR = Join-Path $PROJECT_ROOT ".claude"
}

# Create directory structure
$dirs = @("commands", "middleware", "workflows", "agents")
foreach ($dir in $dirs) {
    $path = Join-Path $CLAUDE_DIR $dir
    if (-not (Test-Path $path)) {
        New-Item -ItemType Directory -Path $path -Force | Out-Null
    }
}
Write-Success "Created .claude directory structure"

# Clone repository
Write-Info "Downloading Claude Agent System..."
try {
    git clone --quiet --depth 1 $REPO_URL $TEMP_DIR 2>$null
    if ($LASTEXITCODE -ne 0) { throw }
    Write-Success "Repository downloaded"
} catch {
    Write-Err "Failed to download repository"
    exit 1
}

# Copy core system files from .claude/ directory (source of truth)
Write-Info "Installing system files..."

$sourceClaude = Join-Path $TEMP_DIR ".claude"

if (Test-Path (Join-Path $sourceClaude "commands")) {
    Copy-Item -Path (Join-Path $sourceClaude "commands\*") -Destination (Join-Path $CLAUDE_DIR "commands") -Recurse -Force -ErrorAction SilentlyContinue
    Write-Success "Commands installed"
}

if (Test-Path (Join-Path $sourceClaude "middleware")) {
    Copy-Item -Path (Join-Path $sourceClaude "middleware\*") -Destination (Join-Path $CLAUDE_DIR "middleware") -Recurse -Force -ErrorAction SilentlyContinue
    Write-Success "Middleware installed"
}

if (Test-Path (Join-Path $sourceClaude "workflows")) {
    Copy-Item -Path (Join-Path $sourceClaude "workflows\*") -Destination (Join-Path $CLAUDE_DIR "workflows") -Recurse -Force -ErrorAction SilentlyContinue
    Write-Success "Workflows installed"
}

if (Test-Path (Join-Path $sourceClaude "agents")) {
    Copy-Item -Path (Join-Path $sourceClaude "agents\*") -Destination (Join-Path $CLAUDE_DIR "agents") -Recurse -Force -ErrorAction SilentlyContinue
    Write-Success "Agents installed"
}

# Copy important files
Copy-Item -Path (Join-Path $sourceClaude "SYSTEMCC-OVERRIDE.md") -Destination $CLAUDE_DIR -Force -ErrorAction SilentlyContinue
Copy-Item -Path (Join-Path $sourceClaude "QUICK_START.md") -Destination $CLAUDE_DIR -Force -ErrorAction SilentlyContinue

# Create directories for caching and temp files
$cacheDir = Join-Path $env:USERPROFILE ".claude\cache"
$checkpointsDir = Join-Path $env:USERPROFILE ".claude\checkpoints"
$tempDir = Join-Path $env:USERPROFILE ".claude\temp"

foreach ($dir in @($cacheDir, $checkpointsDir, $tempDir)) {
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
    }
}
Write-Success "Created cache, checkpoints, and temp directories"

# Clean up
Remove-Item -Path $TEMP_DIR -Recurse -Force -ErrorAction SilentlyContinue
Write-Success "Cleaned up temporary files"

# Final summary
Write-Host ""
Write-Host "Claude Agent System installed!" -ForegroundColor Green
Write-Host ""

if ($Global) {
    Write-Host "Global installation complete" -ForegroundColor Blue
    Write-Host "   /systemcc is now available in ALL projects!"
} else {
    Write-Host "Project installation complete" -ForegroundColor Blue
    Write-Host "   /systemcc is available in this project"
}

Write-Host ""
Write-Host "Usage:" -ForegroundColor Blue
Write-Host '   /systemcc "describe what you want to do"'
Write-Host ""
Write-Host "Installed to:" -ForegroundColor Blue
Write-Host "   $CLAUDE_DIR\commands\"
Write-Host "   $CLAUDE_DIR\middleware\"
Write-Host "   $CLAUDE_DIR\workflows\"
Write-Host ""
Write-Host "Data directories:" -ForegroundColor Blue
Write-Host "   ~/.claude/cache/       (persistent analysis cache)"
Write-Host "   ~/.claude/checkpoints/ (session resumption)"
Write-Host "   ~/.claude/temp/        (auto-deleted after workflow)"
Write-Host ""
Write-Host "Tip: The system caches analysis per-repo for instant startup!" -ForegroundColor Yellow
