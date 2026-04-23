# Superpowers to Codex App Tool Translation

Use this table when a Superpowers skill or plan was written for Claude Code and needs only tool-name or platform-mechanics translation for this Codex App harness. Preserve the original workflow.

## Tool Mapping

| Superpowers or Claude Code term | Codex App equivalent | Notes |
| --- | --- | --- |
| `TodoWrite` | `update_plan` | Keep one `in_progress` step at a time. |
| `Task` | `spawn_agent` | Use together with `wait_agent` and `close_agent` when delegation is allowed. If not, stop and ask before changing the step. |
| Wait for task result | `wait_agent` | Upstream references sometimes say `wait`; use `wait_agent` here. |
| Clean up finished task | `close_agent` | Close agents when no longer needed. |
| `Skill` tool | Native skill triggering | Do not simulate a separate tool call. |
| `Read` | Native shell or file inspection | Prefer `rg`, `sed`, `cat`, or direct file reads as appropriate. |
| `Write` or `Edit` | `apply_patch` | Use `apply_patch` for manual edits; use formatter commands separately if needed. |
| `Bash` | `exec_command` | Use shell commands directly. |
| `run_in_background: true` | `exec_command(...tty=true)` plus `write_stdin` | Prefer a persistent session to detached backgrounding. |
| Parallel shell reads | `multi_tool_use.parallel` | Use only for independent developer-tool calls. |
| `EnterPlanMode` / `ExitPlanMode` | No separate mode switch | Keep the same step in the current session. |
| Named agent such as `superpowers:code-reviewer` | `spawn_agent(agent_type=\"worker\", message=...)` | Read the referenced prompt file first and fill any placeholders. |

## Examples

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
3. If delegation is allowed by the current instructions, call `spawn_agent`
4. Otherwise stop and ask before changing the step

## Rule

This skill translates tool names and mechanics. It does not choose fallback workflows.
