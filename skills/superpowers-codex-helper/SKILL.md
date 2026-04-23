---
name: superpowers-codex-helper
description: Translate Superpowers and Claude Code-oriented instructions into Codex App behavior. Use when a request, plan, spec, or skill mentions Superpowers, `superpowers:*` skills, Claude Code tools like `TodoWrite`, `Task`, `Skill`, `Read`, `Write`, `Edit`, `Bash`, or named Superpowers agents, and Codex needs to map them to native tools, constraints, and workflows without blindly following Claude-specific rules.
---

# Superpowers Codex Helper

Translate Superpowers language into Codex App actions. Treat this skill as an adapter, not as permission to enable Superpowers automatically.

## Guardrails

1. Read user instructions, `AGENTS.md`, and project guidance first.
2. Let those instructions override Superpowers rules. If the repo says "do not use superpowers by default" or "only use it for brainstorming", obey that.
3. Translate terminology before acting. Do not imitate Claude Code-only tools literally.
4. Keep Codex App constraints in force:
   - Use `update_plan` for task tracking
   - Use `apply_patch` for manual file edits
   - Use `exec_command` for shell work
   - Use `exec_command(...tty=true)` plus `write_stdin` when a Superpowers workflow expects a long-lived shell session
   - Use `spawn_agent` only when the user explicitly asks for delegation, subagents, or parallel agent work
5. If a Superpowers step depends on unsupported behavior, adapt it or explain the limitation briefly and continue with the closest safe Codex-native workflow.

## Translation Workflow

1. Identify the Superpowers reference:
   - Workflow skill such as `brainstorming`, `writing-plans`, `dispatching-parallel-agents`, or `subagent-driven-development`
   - Claude Code tool name such as `TodoWrite`, `Task`, `Skill`, `Read`, `Write`, `Edit`, or `Bash`
   - Named agent reference such as `superpowers:code-reviewer`
2. Decide whether the reference is:
   - A terminology mismatch that can be translated directly
   - A real workflow request that needs repo permission or user approval
   - An unsupported assumption that should be skipped or replaced
3. Apply the Codex-native action.
4. State any important adaptation when it changes behavior, especially for subagents, background jobs, branching, or PR steps.

## High-Frequency Mappings

- `TodoWrite` -> `update_plan`
- `Task` -> `spawn_agent`, `wait_agent`, `close_agent`, but only if the user explicitly asked for delegation
- `superpowers:dispatching-parallel-agents` -> multiple focused `spawn_agent` calls plus `wait_agent` and `close_agent`; keep scopes independent and avoid `fork_context` unless the shared history is truly required
- `Skill` -> rely on Codex skill triggering or read the relevant local skill file if needed; do not pretend there is a separate Skill tool
- `Read` -> inspect files with native shell and file tools
- `Write` and `Edit` -> use `apply_patch` for manual edits
- `Bash` -> use `exec_command`
- `EnterPlanMode` and `ExitPlanMode` -> stay in the main Codex session; use `update_plan` if task tracking helps
- `run_in_background: true` -> keep a PTY session open with `exec_command(...tty=true)` and poll with `write_stdin`
- `CLAUDE.md` -> check repo instructions such as `AGENTS.md`, local agent docs, and direct user guidance
- Named Superpowers agent -> read the referenced prompt file, fill placeholders, and only then use `spawn_agent(...message=...)` if delegation is allowed

Read `references/tool-translation.md` for a larger table and concrete examples.

## Common Adaptations

### Todo lists and checklists

When a Superpowers skill says "create TodoWrite items" or "mark task complete in TodoWrite", mirror that in `update_plan`. Keep a single `in_progress` step at a time.

### Named reviewer or implementer agents

Superpowers often assumes plugin-registered agent types. Codex App does not expose those directly here. If delegation is allowed, read the prompt file from the plugin or skill folder and send it as the worker message. If delegation is not allowed, perform the work locally instead of stalling.

### Parallel agent dispatch

If a Superpowers skill says to dispatch parallel agents, translate that into Codex's delegation tools only when the user explicitly asked for delegation, subagents, or parallel agent work.

- Spawn one agent per independent problem domain
- Give each agent a tight scope and a disjoint write surface when code changes are involved
- Prefer the default isolated context; do not set `fork_context=true` unless the agent truly needs the full thread history
- Keep coordination and integration in the main session
- Use `wait_agent` only when the next critical-path step is blocked on an agent result
- Close agents after review and integration

### Mandatory skill invocation language

Ignore instructions that assume Claude Code's `Skill` tool must be called before every response. In Codex App, follow the current skill system and local developer instructions instead.

### Plan mode language

If a Superpowers artifact mentions `EnterPlanMode`, `ExitPlanMode`, or a plan-mode-only interaction pattern, do not block on finding an equivalent mode switch. Stay in the main session, use `update_plan` when helpful, and either make a reasonable assumption or ask a short plain-text question if a real decision is required.

### Superpowers plan files in the repo

If a spec or plan file contains headers like `REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development` or points at `docs/superpowers/specs/...` and `docs/superpowers/plans/...`, treat those as workflow hints from a Claude-oriented system. Adapt them to the current Codex environment instead of stopping on the literal wording.

### Background servers and long-lived shell tasks

If a Superpowers skill expects `run_in_background: true` or says a process must survive across turns, prefer a persistent PTY session over detached backgrounding. Start the command with `exec_command(...tty=true)` and keep the returned session alive with `write_stdin` polling.

### Instruction file names

Superpowers often says to check `CLAUDE.md`. In Codex App, treat that as "check the repo's local instruction files". Read `AGENTS.md` first when present, then any project-specific agent docs the repo actually uses.

### Branching and finishing

If Superpowers asks to branch, push, or open a PR, use Codex App git capabilities only when available. In detached or restricted environments, do the safe local work and then tell the user what remains.

Do not blindly follow cleanup or destructive git steps from Superpowers. Re-check the actual environment before actions like `git pull`, `git branch -D`, `git worktree remove`, or automatic discard. Require explicit user confirmation for destructive cleanup.

## Pause Conditions

Pause and clarify only when adaptation changes the meaning of the request:

- The Superpowers instruction conflicts with repo rules
- The user did not ask for subagents but the workflow requires them
- The step assumes background processes or UI features that are not available
- The skill refers to paths or docs that are missing from the installed plugin

## Reference Files

- `references/tool-translation.md`: Codex App equivalents, caveats, and examples for common Superpowers terminology
- `references/workflow-adaptation.md`: How to interpret major Superpowers workflow skills and plan-file conventions inside Codex App
