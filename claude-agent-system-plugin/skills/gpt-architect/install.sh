#!/usr/bin/env bash
# Install GPT Architect outside the CAS plugin. Safe to run repeatedly.
set -euo pipefail

SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
CLAUDE_DIR="${HOME}/.claude"
HOOK_DIR="${CLAUDE_DIR}/hooks"
SKILL_DIR="${CLAUDE_DIR}/skills/gpt-architect"
BIN_DIR="${HOME}/.local/bin"
SETTINGS="${CLAUDE_DIR}/settings.json"
STAMP=$(date +%Y%m%d-%H%M%S)

backup_path() {
  local candidate="${1}.gpt-architect-backup-${STAMP}" suffix=1
  while [[ -e $candidate || -L $candidate ]]; do
    candidate="${1}.gpt-architect-backup-${STAMP}-${suffix}"
    suffix=$((suffix + 1))
  done
  printf '%s' "$candidate"
}

backup_then_copy() {
  local source=$1 destination=$2 backup
  mkdir -p "$(dirname "$destination")"
  if [[ -e $destination || -L $destination ]]; then
    backup=$(backup_path "$destination")
    cp -p "$destination" "$backup"
    printf 'Backed up %s\n' "$destination"
  fi
  cp -p "$source" "$destination"
}

backup_then_copy "${SCRIPT_DIR}/SKILL.md" "${SKILL_DIR}/SKILL.md"
for hook in enforce-gpt-subagents.js gpt-architect-session-start.sh gpt-worker-announce.js gpt-direct-route.js; do
  backup_then_copy "${SCRIPT_DIR}/hooks/${hook}" "${HOOK_DIR}/${hook}"
done
for cli in gpt-run gpt-fleet gpt-quota gpt-watch; do
  backup_then_copy "${SCRIPT_DIR}/bin/${cli}" "${BIN_DIR}/${cli}"
done
chmod +x "${HOOK_DIR}/enforce-gpt-subagents.js" \
  "${HOOK_DIR}/gpt-architect-session-start.sh" \
  "${HOOK_DIR}/gpt-worker-announce.js" \
  "${HOOK_DIR}/gpt-direct-route.js" \
  "${BIN_DIR}/gpt-run" "${BIN_DIR}/gpt-fleet" \
  "${BIN_DIR}/gpt-quota" "${BIN_DIR}/gpt-watch"

HOOKS_JSON=$(cat <<'JSON'
{
  "hooks": {
    "SessionStart": [{"hooks": [{"type": "command", "command": "/bin/sh $HOME/.claude/hooks/gpt-architect-session-start.sh"}]}],
    "UserPromptSubmit": [{"hooks": [{"type": "command", "command": "node $HOME/.claude/hooks/gpt-direct-route.js"}]}],
    "PreToolUse": [
      {"matcher": "mcp__codex__.*", "hooks": [{"type": "command", "command": "node $HOME/.claude/hooks/gpt-worker-announce.js"}]},
      {"matcher": "Agent", "hooks": [{"type": "command", "command": "node $HOME/.claude/hooks/enforce-gpt-subagents.js"}]}
    ],
    "PostToolUse": [{"matcher": "mcp__codex__.*", "hooks": [{"type": "command", "command": "node $HOME/.claude/hooks/gpt-worker-announce.js"}]}]
  }
}
JSON
)

if command -v jq >/dev/null 2>&1 && [[ -f $SETTINGS ]]; then
  settings_backup=$(backup_path "$SETTINGS")
  cp -p "$SETTINGS" "$settings_backup"
  tmp=$(mktemp "${SETTINGS}.gpt-architect.XXXXXX")
  jq --argjson add "$HOOKS_JSON" '
    def add_unique($event):
      reduce ($add.hooks[$event] // [])[] as $entry
        (.;
          (.hooks[$event] // []) as $existing |
          .hooks[$event] =
            if ($existing | any(. == $entry)) then $existing else $existing + [$entry] end);
    .hooks = (.hooks // {}) |
    add_unique("SessionStart") | add_unique("UserPromptSubmit") |
    add_unique("PreToolUse") | add_unique("PostToolUse")
  ' "$SETTINGS" > "$tmp"
  mv "$tmp" "$SETTINGS"
  printf 'Merged hooks into %s (backup: %s)\n' "$SETTINGS" "$settings_backup"
else
  printf '\nAdd this JSON to ~/.claude/settings.json (jq was unavailable or settings.json does not exist):\n%s\n' "$HOOKS_JSON"
fi

printf '\nInstalled GPT Architect. Ensure %s is on PATH and Codex is logged in with ChatGPT.\n' "$BIN_DIR"
