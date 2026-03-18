# agents

Reusable AI agent skills.

This repo currently contains skills under `skills/`.

## Install

If you use the `skills` CLI, install this repo's skills with:

```bash
npx skills add https://github.com/truongezgg/agents
```

If the CLI supports pointing directly at the skills directory in a GitHub repo, this may also work:

```bash
npx skills add https://github.com/truongezgg/agents/tree/main/skills
```

Recommended default: use the repo root URL first.

## What Is In This Repo

Skills live in `skills/<skill-name>/SKILL.md`.

Current skills:

- `docker-sandbox` - guidance for running AI agents inside Docker Sandboxes with isolated microVMs, private Docker daemons, templates, and network policies

## Repo Layout

```text
skills/
  docker-sandbox/
    SKILL.md
```

## Usage Notes

- This repo is meant to be consumed as a skills source
- new skills should be added under `skills/`
- each skill should have its own directory and a `SKILL.md` entrypoint

## Development

After editing a skill, verify the rendered content and installation flow with your preferred agent tooling.
