#!/usr/bin/env bash
# Install the Step Beyond skill into Claude Code, Codex, and/or Hermes.
# Idempotent: re-running updates the skill in place and never touches memory.
set -euo pipefail

usage() {
  cat <<'USAGE'
Usage: scripts/install.sh [--host claude|codex|hermes|all] [--project] [--always-on] [--dry-run]

  --host        Target host. Default: every host whose home directory exists.
  --project     Install into the current project (.claude/skills, .agents/skills)
                instead of the user's home. Not available for Hermes.
  --always-on   Also write the core instruction block into the host's standing
                instructions (CLAUDE.md, AGENTS.md, SOUL.md) between markers.
  --dry-run     Print what would change without writing anything.
USAGE
}

host="auto"; project=0; always_on=0; dry=0
while [ $# -gt 0 ]; do
  case "$1" in
    --host) host="${2:?--host needs a value}"; shift 2 ;;
    --project) project=1; shift ;;
    --always-on) always_on=1; shift ;;
    --dry-run) dry=1; shift ;;
    -h|--help) usage; exit 0 ;;
    *) echo "Unknown option: $1" >&2; usage >&2; exit 2 ;;
  esac
done

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
source_dir="$root/skills/step-beyond"
core="$source_dir/templates/core-injection.txt"
[ -f "$source_dir/SKILL.md" ] || { echo "Cannot find $source_dir/SKILL.md" >&2; exit 1; }

say() { printf '%s\n' "$*"; }
run() { if [ "$dry" -eq 1 ]; then say "  would: $*"; else "$@"; fi; }

install_skill() { # <target skill dir>
  local target="$1"
  say "  skill  -> $target"
  run mkdir -p "$target"
  # Replace only the shipped files; anything else in the directory is left alone.
  run rm -rf "$target/references" "$target/templates"
  run cp -R "$source_dir/SKILL.md" "$source_dir/references" "$source_dir/templates" "$target/"
}

write_block() { # <instruction file>
  local file="$1" start="<!-- step-beyond:core:start -->" end="<!-- step-beyond:core:end -->"
  say "  always-on block -> $file"
  [ "$dry" -eq 1 ] && return 0
  mkdir -p "$(dirname "$file")"; touch "$file"
  local tmp; tmp="$(mktemp)"
  awk -v s="$start" -v e="$end" '$0==s{skip=1} !skip{print} $0==e{skip=0}' "$file" > "$tmp"
  # Trim trailing blank lines left by a previous block, then append the fresh one.
  printf '%s\n' "$(cat "$tmp")" > "$tmp"
  { [ -s "$tmp" ] && [ "$(cat "$tmp")" != "" ] && { cat "$tmp"; printf '\n'; }
    printf '%s\n' "$start"; cat "$core"; printf '%s\n' "$end"; } > "$file"
  rm -f "$tmp"
}

seed_memory() {
  local file="$HOME/.step-beyond/user-patterns.md"
  if [ -e "$file" ]; then say "  memory -> $file (kept)"; return 0; fi
  say "  memory -> $file (created)"
  run mkdir -p "$(dirname "$file")"
  run cp "$source_dir/templates/user-patterns.md" "$file"
}

do_claude() {
  say "Claude Code"
  if [ "$project" -eq 1 ]; then
    install_skill ".claude/skills/step-beyond"
    if [ "$always_on" -eq 1 ]; then write_block "CLAUDE.md"; fi
  else
    install_skill "$HOME/.claude/skills/step-beyond"
    if [ "$always_on" -eq 1 ]; then write_block "$HOME/.claude/CLAUDE.md"; fi
  fi
}

do_codex() {
  say "Codex"
  if [ "$project" -eq 1 ]; then
    install_skill ".agents/skills/step-beyond"
    if [ "$always_on" -eq 1 ]; then write_block "AGENTS.md"; fi
  else
    install_skill "$HOME/.agents/skills/step-beyond"
    if [ "$always_on" -eq 1 ]; then write_block "$HOME/.codex/AGENTS.md"; fi
  fi
}

do_hermes() {
  say "Hermes"
  if [ "$project" -eq 1 ]; then
    say "  skipped: Hermes skills are installed per user, not per project"
    return 0
  fi
  install_skill "$HOME/.hermes/skills/step-beyond"
  if [ "$always_on" -eq 1 ]; then write_block "$HOME/.hermes/SOUL.md"; fi
}

case "$host" in
  claude) do_claude ;;
  codex) do_codex ;;
  hermes) do_hermes ;;
  all) do_claude; do_codex; do_hermes ;;
  auto)
    found=0
    if [ -d "$HOME/.claude" ]; then do_claude; found=1; fi
    if [ -d "$HOME/.codex" ] || [ -d "$HOME/.agents" ]; then do_codex; found=1; fi
    if [ -d "$HOME/.hermes" ]; then do_hermes; found=1; fi
    if [ "$found" -eq 0 ]; then
      echo "No supported host found in $HOME. Pass --host claude|codex|hermes|all." >&2
      exit 1
    fi ;;
  *) echo "Unknown host: $host" >&2; usage >&2; exit 2 ;;
esac

seed_memory
say "Done. Start a new session in the host to load the skill."
