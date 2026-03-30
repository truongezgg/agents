---
name: git-commit-writer
description: write concise english git commit messages from diffs, staged changes, git status output, changed file lists, or user summaries. use when chatgpt needs to turn code changes into a conventional-style commit message with a lowercase type prefix, optional scope, imperative summary, optional short body, and no extra commentary. trigger on requests such as writing a commit message, summarizing a diff, naming staged changes, or producing a conventional commit.
---

# Git Commit Writer

Write one strong Git commit message that captures the most important change.

## Follow this output contract

Return only the commit message.

Do not add explanation, labels, bullets, quotes, markdown fences, or meta
commentary.

Use this subject format:

`<type>(<scope>): <summary>`

Make `(<scope>)` optional. Omit it when it does not add useful context.

## Write the subject line well

Use a lowercase type from this set when possible:

- `feat`
- `fix`
- `update`
- `refactor`
- `chore`
- `docs`
- `style`
- `test`
- `build`
- `ci`

Keep the summary short, clear, and imperative.

Do not end the subject with punctuation.

Aim to keep the subject at 50 characters or fewer.

Prefer the smallest accurate scope, such as `auth`, `api`, `ui`, `cli`,
`db`, `config`, `deps`, or `docs`. Avoid noisy scopes derived from single
filenames unless the file represents the real feature area.

## Choose the right type

Use `feat` for new user-facing functionality.

Use `fix` for bug fixes, regressions, error handling, or broken behavior.

Use `update` for meaningful improvements that are not clearly a feature,
a fix, or a refactor.

Use `refactor` for internal restructuring that preserves behavior.

Use `chore` for maintenance, cleanup, dependency housekeeping, or other
non-feature work.

Use `docs`, `style`, `test`, `build`, and `ci` for those specific cases.

## Decide whether to add a body

If the change is clear from the subject alone, do not add a body.

Add a body only when it provides useful extra context, tradeoffs, or
follow-up detail.

When adding a body:

- separate it from the subject with one blank line
- keep it short and non-redundant
- wrap lines to about 72 characters

## Handle mixed or messy changes

Infer the primary change from the diff or summary instead of listing every
edit.

Prefer the highest-impact change over low-level implementation detail.

If several edits support one outcome, summarize that shared outcome in one
message.

If the change is truly mixed and no single feature or fix dominates, choose
a broader type such as `update`, `refactor`, or `chore`.

If the scope is unclear or unhelpful, omit it.

## Use available inputs intelligently

Accept any of these as sufficient context when they clearly describe the
change:

- raw `git diff` or `git diff --staged`
- `git status` or changed-file lists
- a natural-language summary
- a patch, PR summary, or code review note

Base the message on the actual change, not on filenames alone.

If the request does not include enough information to infer a commit
message, ask for the smallest missing input, preferably the staged diff or
a one-sentence change summary.

## Examples

Input: added login and signup endpoints with JWT token validation

Output:
`feat(auth): add JWT login and signup`

Input: fixed crash when API returns null profile data

Output:
`fix(profile): handle null API response`

Input: simplified cache invalidation without changing behavior

Output:
`refactor(cache): simplify invalidation flow`

Input: updated GitHub Actions to run tests on pull requests

Output:
`ci: run tests on pull requests`

Input: reformatted CSS and removed unused spacing rules

Output:
`style(ui): clean up spacing rules`
