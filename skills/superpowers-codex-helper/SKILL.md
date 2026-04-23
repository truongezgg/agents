---
name: superpowers-codex-helper
description: Translate Claude Code and Superpowers tool names into Codex App equivalents without changing the referenced workflow. Use when a Superpowers skill, plan, or prompt contains Claude-oriented tool names such as `TodoWrite`, `Task`, `Skill`, `Read`, `Write`, `Edit`, `Bash`, `run_in_background`, `EnterPlanMode`, `ExitPlanMode`, or named agents like `superpowers:code-reviewer`, and Codex needs only tool-name or platform-mechanics translation.
---

# Superpowers Codex Helper

Translate tool names and platform mechanics only. Do not rewrite the Superpowers process.

## Guardrails

1. Read user instructions, `AGENTS.md`, and project guidance first.
2. Let those instructions override Superpowers rules.
3. Preserve the referenced workflow order, checkpoints, review steps, and artifacts. This skill only translates tool names and platform mechanics.
4. Keep Codex App constraints in force:
   - Use `update_plan` for task tracking
   - Use `apply_patch` for manual file edits
   - Use `exec_command` for shell work
   - Use `exec_command(...tty=true)` plus `write_stdin` for long-lived shell sessions
   - Use `spawn_agent`, `wait_agent`, and `close_agent` only when delegation is allowed by the current instructions
5. If a required tool has no usable equivalent under the current instructions, stop at that step and ask before changing the workflow.

## Translation Workflow

1. Identify the Claude-oriented tool or platform term.
2. Replace only that term with the Codex App equivalent.
3. Leave the surrounding workflow untouched.
4. If there is no exact equivalent, state the mismatch and ask before changing the process.

## High-Frequency Mappings

- `TodoWrite` -> `update_plan`
- `Task` -> `spawn_agent`, `wait_agent`, `close_agent` when delegation is allowed; otherwise stop and ask before replacing the step
- `Skill` -> use Codex's native skill system; do not simulate a separate Skill tool
- `Read` -> inspect files with native shell and file tools
- `Write` and `Edit` -> use `apply_patch` for manual edits
- `Bash` -> use `exec_command`
- `EnterPlanMode` and `ExitPlanMode` -> no separate mode switch here; keep the same step in the current session
- `run_in_background: true` -> keep a PTY session open with `exec_command(...tty=true)` and poll with `write_stdin`
- Named Superpowers agent -> read the referenced prompt file, fill placeholders, and use `spawn_agent(...message=...)` only when delegation is allowed

Read `references/tool-translation.md` for a larger table and concrete examples.

## Communication Rule

Do not say that you translated Superpowers into a different Codex workflow.

Prefer language like:

- "I am following the Superpowers workflow and mapping tool names to Codex App equivalents."
- "I preserved the same review/plan/finish sequence; the only translation was `TodoWrite` to `update_plan`."
- "This step uses the Claude `Task` tool. I can map it to Codex subagents if you want delegation enabled."

## Pause Conditions

Pause and clarify only when adaptation changes the meaning of the request:

- The Superpowers instruction conflicts with repo rules
- The workflow requires a tool that has no usable equivalent under the current instructions
- The step assumes background processes or UI features that are not available

## Reference Files

- `references/tool-translation.md`: Codex App equivalents, caveats, and examples for common Superpowers terminology
