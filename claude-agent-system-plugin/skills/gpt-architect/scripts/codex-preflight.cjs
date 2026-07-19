#!/usr/bin/env node
'use strict';

/*
 * codex-preflight — verify (and optionally auto-set-up) the normal Codex MCP
 * that /gpt-architect delegates to.
 *
 *   node codex-preflight.cjs check   # detect state; exit 0 = READY, 1 = NEEDS_SETUP
 *   node codex-preflight.cjs setup   # auto-install CLI + register MCP, then re-check
 *
 * Cross-platform (macOS / Linux / Windows) — uses only Node built-ins, so it
 * runs anywhere Claude Code runs. It never executes rm / git commit / git push
 * and starts no persistent background process. Its only mutations are the
 * sanctioned setup steps: install the Codex CLI, register the codex MCP at
 * user scope, and (on a real terminal) drive the interactive login.
 *
 * A newly registered MCP only loads at session start, so `setup` cannot make
 * codex usable in the current session — it reports that a restart is required.
 */

const { spawnSync } = require('child_process');

const WIN = process.platform === 'win32';
// `claude mcp add codex -s user -- codex mcp-server` (user scope = all projects)
const MCP_ADD = ['mcp', 'add', 'codex', '-s', 'user', '--', 'codex', 'mcp-server'];

function run(cmd, args = [], opts = {}) {
  const base = { encoding: 'utf8', windowsHide: true, ...opts };
  // On Windows, npm/claude/codex are .cmd shims that spawnSync only resolves
  // through a shell; join to a command string in that case.
  const res = WIN
    ? spawnSync([cmd, ...args].join(' '), { ...base, shell: true })
    : spawnSync(cmd, args, base);
  if (res.error) {
    return { ran: false, ok: false, code: null, out: '', err: String(res.error.message || res.error) };
  }
  return { ran: true, ok: res.status === 0, code: res.status, out: res.stdout || '', err: res.stderr || '' };
}

// A command is "present" if invoking `<cmd> --version` actually launches
// (ENOENT => not on PATH => ran === false).
function present(cmd) {
  return run(cmd, ['--version']).ran;
}

function detect() {
  const codex = present('codex');
  const npm = present('npm');
  const brew = present('brew');
  const claude = present('claude');

  let authed = false;
  if (codex) {
    const r = run('codex', ['login', 'status']);
    const t = (r.out + r.err).toLowerCase();
    authed = r.ok && t.includes('logged in') && !t.includes('not logged in');
  }

  let mcp = 'unknown'; // 'registered' | 'missing' | 'unknown' (claude CLI absent)
  if (claude) {
    mcp = run('claude', ['mcp', 'get', 'codex']).ok ? 'registered' : 'missing';
  }

  return { codex, npm, brew, claude, authed, mcp };
}

function report(s) {
  const missing = [];
  if (!s.codex) missing.push('CLI');
  if (s.codex && !s.authed) missing.push('AUTH');
  if (s.mcp === 'missing') missing.push('MCP');

  console.log('Codex MCP preflight');
  console.log(`  codex CLI:        ${s.codex ? 'installed' : 'MISSING'}`);
  console.log(`  authentication:   ${!s.codex ? 'unknown (CLI missing)' : s.authed ? 'ok' : 'MISSING (run: codex login)'}`);
  console.log(`  MCP registration: ${s.mcp === 'registered' ? 'registered (user scope)' : s.mcp === 'missing' ? 'MISSING' : 'unknown (claude CLI not on PATH)'}`);

  const ready = s.codex && s.authed && s.mcp === 'registered';
  if (ready) {
    console.log('VERDICT: READY');
    return 0;
  }
  console.log(`MISSING: ${missing.length ? missing.join(',') : (s.mcp === 'unknown' ? 'MCP?' : 'unknown')}`);
  console.log('VERDICT: NEEDS_SETUP');
  return 1;
}

function installCli(s) {
  // Homebrew is preferred on macOS/Linux when present; npm is the universal
  // path and the only auto path on Windows.
  if (!WIN && s.brew) {
    console.log('-> installing Codex CLI via Homebrew: brew install codex');
    if (run('brew', ['install', 'codex'], { stdio: 'inherit' }).ok) return true;
    console.log('   Homebrew install did not succeed; falling back to npm.');
  }
  if (s.npm) {
    console.log('-> installing Codex CLI via npm: npm install -g @openai/codex');
    if (run('npm', ['install', '-g', '@openai/codex'], { stdio: 'inherit' }).ok) return true;
    console.log('   npm install did not succeed.');
    return false;
  }
  console.log('! Cannot auto-install: neither Homebrew nor npm is available.');
  console.log('  Install Node.js (which provides npm), then run:');
  console.log('    npm install -g @openai/codex        # any platform with npm');
  if (!WIN) console.log('    brew install codex                  # macOS / Linux with Homebrew');
  return false;
}

function registerMcp(s) {
  if (!s.claude) {
    console.log('! Cannot auto-register the MCP: the `claude` CLI is not on PATH.');
    console.log('  Register it manually, then restart Claude Code:');
    console.log('    claude mcp add codex -s user -- codex mcp-server');
    return false;
  }
  console.log('-> registering codex as a user-scope MCP: claude mcp add codex -s user -- codex mcp-server');
  return run('claude', MCP_ADD, { stdio: 'inherit' }).ok;
}

function setup() {
  console.log('Codex MCP setup (automatic)\n');
  let s = detect();

  if (!s.codex) {
    installCli(s);
    s = detect();
  } else {
    console.log('OK  Codex CLI already installed.');
  }

  if (s.codex) {
    if (s.mcp === 'registered') {
      console.log('OK  codex MCP already registered.');
    } else {
      registerMcp(s);
      s = detect();
    }
  }

  // Login is interactive (browser / API key) and would hang a non-interactive
  // tool call, so drive it only with a real TTY; otherwise hand it to the user.
  if (s.codex && !s.authed) {
    if (process.stdin.isTTY && process.stdout.isTTY) {
      console.log('-> starting interactive login: codex login');
      run('codex', ['login'], { stdio: 'inherit' });
      s = detect();
    } else {
      console.log('! Authentication is required and interactive.');
      console.log('  Run it yourself (in Claude Code, prefix with `!`):');
      console.log('    codex login');
    }
  }

  console.log('');
  const code = report(s);
  console.log('');
  console.log(code === 0
    ? 'Setup complete. Restart Claude Code so the codex MCP loads, then delegate.'
    : 'Setup incomplete — resolve the MISSING items above, then restart Claude Code and re-run the preflight.');
  return code;
}

function main() {
  const cmd = (process.argv[2] || 'check').toLowerCase();
  if (cmd === 'setup') {
    process.exit(setup());
  } else if (cmd === 'check') {
    process.exit(report(detect()));
  } else {
    console.log('usage: codex-preflight.cjs [check|setup]');
    process.exit(2);
  }
}

main();
