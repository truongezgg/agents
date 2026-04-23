# Superpowers Workflow Adaptation for Codex App

Use this guide when Codex encounters a Superpowers skill name, a plan header such as `REQUIRED SUB-SKILL`, or repository docs under `docs/superpowers/`.

## Core Rule

Treat Superpowers workflow names as intent labels first, not mandatory literal commands. Translate them into the closest safe Codex App workflow after checking repo instructions and the user's request.

## Skill-by-Skill Adaptation

### `using-superpowers`

Interpretation:

- Introductory workflow guidance from the Superpowers ecosystem
- Not a mandatory root skill in Codex App

Codex App adaptation:

- Do not force a separate "Skill tool before every response" behavior
- Let repo instructions, user instructions, and Codex's native skill system control behavior

### `brainstorming`

Interpretation:

- Design-first workflow before implementation

Codex App adaptation:

- Use only when the repo or user actually wants a brainstorming/design phase
- If the repo restricts Superpowers usage, obey that restriction
- The spec path convention `docs/superpowers/specs/...` is optional unless the project already uses it

### `writing-plans`

Interpretation:

- Produce a highly detailed implementation plan with small, verifiable steps

Codex App adaptation:

- Use as a planning pattern when a plan is requested or clearly valuable
- Do not treat it as mandatory before every code change unless repo or user instructions require that
- If a generated plan says `REQUIRED SUB-SKILL`, adapt the header rather than blocking on the exact skill

### `executing-plans`

Interpretation:

- Execute a written plan in one session with checkpoints

Codex App adaptation:

- This is the safest default interpretation when Codex is given a Superpowers plan but subagents are not explicitly requested
- Read the plan, review it critically, track progress with `update_plan`, execute locally, and stop when blocked

### `subagent-driven-development`

Interpretation:

- One fresh subagent per task with reviewer passes in between

Codex App adaptation:

- Use only when the user explicitly requested delegation, subagents, or parallel agent work
- Otherwise downgrade to `executing-plans` or direct local execution
- When adaptation is needed, explain briefly that the plan was written for delegated execution but is being executed locally

### `dispatching-parallel-agents`

Interpretation:

- Parallel delegation across multiple independent problem domains
- Strong preference for isolated agent context and narrow scope

Codex App adaptation:

- Use only when the user explicitly requested delegation, subagents, or parallel agent work
- Translate it into multiple `spawn_agent` calls, usually with the default isolated context rather than `fork_context=true`
- Give each agent a focused goal and disjoint ownership when edits are involved
- Keep orchestration, conflict checking, and integration in the main session
- If the work is not truly independent, downgrade to `subagent-driven-development`, `executing-plans`, or direct local execution

### `requesting-code-review`

Interpretation:

- Run a structured review before continuing

Codex App adaptation:

- Local review is acceptable and often preferred
- If the user explicitly requested delegation, a reviewer agent can be spawned from the referenced prompt
- Review findings should still be prioritized by severity

### `test-driven-development`

Interpretation:

- Strong preference for RED-GREEN-REFACTOR

Codex App adaptation:

- Treat it as a workflow discipline, not an unbreakable system law
- Repo instructions, existing codebase patterns, and direct user guidance can override it

### `using-git-worktrees`

Interpretation:

- Set up an isolated workspace for feature work

Codex App adaptation:

- Use only when isolation is actually needed and the user wants that workflow
- Check real repo instruction files, not only `CLAUDE.md`
- Verify ignore rules before using a project-local worktree directory
- Do not auto-create a `.gitignore` commit unless the user wants that extra change

### `finishing-a-development-branch`

Interpretation:

- Verify, then merge, push, keep, or discard the branch

Codex App adaptation:

- Use as a completion checklist, not a verbatim command script
- Re-check actual git state before merge, push, delete, or worktree cleanup
- Prefer App-native git controls when environment restrictions prevent full branch or PR operations
- Require explicit confirmation for destructive options

## Plan Header Adaptation

Superpowers plans often start with text like this:

```text
REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans
```

Interpret that as:

- "This plan expects task-by-task execution"
- "Delegated execution is preferred if the current environment and user allow it"
- "Single-session execution is acceptable when delegation is not explicitly requested"

Do not stop just because the named Superpowers skill cannot be invoked literally.

## Path Conventions

Common Superpowers repo paths:

- `docs/superpowers/specs/...`
- `docs/superpowers/plans/...`

Interpret these as project conventions, not special platform features. If the repo already uses them, keep using them. If not, do not invent them just because Superpowers mentions them.
