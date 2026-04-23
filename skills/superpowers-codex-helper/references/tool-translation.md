# Superpowers to Codex App Translation

Use this table when a Superpowers skill or plan was written for Claude Code and needs adaptation for this Codex App harness.

## Tool Mapping

| Superpowers or Claude Code term | Codex App equivalent | Notes |
| --- | --- | --- |
| `TodoWrite` | `update_plan` | Keep one `in_progress` step at a time. |
| `Task` | `spawn_agent` | Only when the user explicitly asks for subagents, delegation, or parallel agent work. |
| Wait for task result | `wait_agent` | Upstream references sometimes say `wait`; use `wait_agent` here. |
| Clean up finished task | `close_agent` | Close agents when no longer needed. |
| `Skill` tool | Native skill triggering | Do not simulate a separate tool call. |
| `Read` | Native shell or file inspection | Prefer `rg`, `sed`, `cat`, or direct file reads as appropriate. |
| `Write` or `Edit` | `apply_patch` | Use `apply_patch` for manual edits; use formatter commands separately if needed. |
| `Bash` | `exec_command` | Use shell commands directly. |
| `run_in_background: true` | `exec_command(...tty=true)` plus `write_stdin` | Prefer a persistent session to detached backgrounding. |
| Parallel shell reads | `multi_tool_use.parallel` | Use only for independent developer-tool calls. |
| `EnterPlanMode` / `ExitPlanMode` | No separate mode switch | Stay in the main session; use `update_plan` if helpful. |
| `CLAUDE.md` | `AGENTS.md` or repo instruction files | Read the actual instruction files used by the repo. |
| Named agent such as `superpowers:code-reviewer` | `spawn_agent(agent_type=\"worker\", message=...)` | Read the referenced prompt file first and fill any placeholders. |

## Workflow Translation

### `TodoWrite`

Superpowers example:

```text
Create TodoWrite with all tasks
Mark task complete in TodoWrite
```

Codex App adaptation:

- Extract the tasks
- Call `update_plan`
- Mark items `completed` as work finishes

### `Task tool (superpowers:code-reviewer)`

Superpowers example:

```text
Use Task tool with superpowers:code-reviewer
```

Codex App adaptation:

1. Find the referenced prompt file such as `agents/code-reviewer.md`
2. Fill placeholders like `{BASE_SHA}` or `{WHAT_WAS_IMPLEMENTED}`
3. If the user explicitly requested delegation, call `spawn_agent`
4. Otherwise perform the review locally

## Important Differences From Upstream Mapping

- Use `wait_agent`, not `wait`
- Use `apply_patch` for manual edits rather than a generic write tool
- Do not spawn subagents unless the user explicitly asked for them
- Prefer persistent PTY sessions instead of detached background processes
- Translate `CLAUDE.md` references to the repo's real instruction files
- Treat `EnterPlanMode` as descriptive, not as a required tool or mode switch
- Treat repo instructions such as `AGENTS.md` as higher priority than Superpowers workflow rules

## Git and Worktree Safety

Some Superpowers skills include aggressive git instructions like automatic `.gitignore` edits, `git pull`, force branch deletion, or worktree cleanup.

In Codex App:

- Re-check the real git state before following branch or worktree instructions
- Do not force-delete branches or remove worktrees without explicit user confirmation
- Do not make extra repo changes, such as creating a `.gitignore` commit, unless the user actually wants that outcome
- Prefer non-interactive commands and App-native git controls when available

## Safety Rule

This skill translates Superpowers terminology. It does not authorize automatic use of Superpowers when user or repo rules forbid it.
