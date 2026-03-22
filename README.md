# agents

Reusable AI agent skills and MCP packages.

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

MCP packages live in `mcps/<package-name>/`.

Current skills:

- `docker-sandbox` - guidance for running AI agents inside Docker Sandboxes with isolated microVMs, private Docker daemons, templates, and network policies
- `gemini-google-search-mcp` - guidance for using the `gemini-google-search-mcp` MCP server for current web-backed answers via Gemini CLI

Current MCP packages:

- `gemini-google-search-mcp` - MCP stdio server published to npm and intended to run in clients via `npx -y gemini-google-search-mcp`

## Repo Layout

```text
skills/
  docker-sandbox/
    SKILL.md
  gemini-google-search-mcp/
    SKILL.md
mcps/
  gemini-google-search-mcp/
    package.json
    index.mjs
    README.md
```

## Usage Notes

- This repo is meant to be consumed as a skills source
- new skills should be added under `skills/`
- each skill should have its own directory and a `SKILL.md` entrypoint
- MCP packages should live under `mcps/`

## MCP Package Development

From the repo root, you can verify or publish the packaged MCP server with:

```bash
npm run verify:gemini-google-search-mcp
npm run publish:gemini-google-search-mcp
```

## Development

After editing a skill, verify the rendered content and installation flow with your preferred agent tooling.
