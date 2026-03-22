# gemini-google-search-mcp

A local MCP stdio server that delegates Google Search-backed web search to **Gemini CLI** and exposes the result as a tool for Claude Code, Cursor, OpenCode, or any MCP-compatible client.

## What it does

It exposes one tool:

- `gemini_web_search(query, maxSources?, freshness?, model?, timeoutMs?)`

Internally it runs Gemini CLI in headless mode:

```bash
gemini -p "..." --output-format json
```

and asks Gemini to use its built-in **Google Search grounding**.

## Why this approach works

Gemini CLI supports:

- headless mode with `-p` and `--output-format json`
- a built-in `google_web_search` tool for current web information
- MCP integration for local stdio servers

## Prerequisites

- Node.js 20+
- Gemini CLI installed and authenticated
- Gemini CLI working from your shell

Quick sanity check:

```bash
gemini --version
gemini -p "Search the web for the latest TypeScript release and summarize it briefly" --output-format json
```

## Quick start

```bash
npx -y gemini-google-search-mcp --help
```

For MCP clients, use `npx` as the command runner:

- command: `npx`
- args: [`-y`, `gemini-google-search-mcp`]

`npx` downloads this package on demand, but **Gemini CLI still must be installed and authenticated separately**.

## Local development

```bash
npm install
npm start
```

`npm start` runs the stdio server locally from the checked-out repo.

## CLI options

```bash
npx -y gemini-google-search-mcp --help
npx -y gemini-google-search-mcp --version
```

## Environment variables

Optional:

```bash
export GEMINI_CMD=gemini
export GEMINI_EXTRA_ARGS=""
export GEMINI_EXTRA_ARGS_JSON='["--some-flag","value with spaces"]'
```

Use these if Gemini is not on your PATH or if your setup needs extra flags. Prefer `GEMINI_EXTRA_ARGS_JSON` when an argument contains spaces or shell-sensitive characters.

## Claude Code example

```bash
claude mcp add gemini-google-search -- npx -y gemini-google-search-mcp
```

If you prefer project-scoped config, use Claude Code's local MCP config for the same command.

## Cursor example

Add an MCP server entry pointing at:

- command: `npx`
- args: [`-y`, `gemini-google-search-mcp`]

## OpenCode example

Add a stdio MCP server with:

- command: `npx`
- args: [`-y`, `gemini-google-search-mcp`]

## Recommended agent instructions

Tell your coding agent something like:

> For questions that need up-to-date web information, call the `gemini_web_search` MCP tool instead of relying on model memory. Prefer this for package versions, current docs, news, release notes, pricing, and breaking changes.

A reusable version of that guidance lives in `agent-instructions.md`.

## Notes and caveats

1. This package does **not** install Gemini CLI for you. Install and authenticate Gemini CLI separately.
2. This wrapper does **not** call Google Search directly. It asks Gemini CLI to do it.
3. Result quality depends on Gemini deciding to use web grounding, which is why the wrapper prompt strongly asks for current web-backed results.
4. If Gemini CLI prompts for approvals in your environment, use a trusted folder and review Gemini settings around tool execution.
5. If you need deterministic source extraction, a direct search API is more reliable than an LLM wrapper.

## Useful test prompt

Once connected in your MCP client, ask:

> Use `gemini_web_search` to find the latest MCP TypeScript SDK docs and summarize the stdio server pattern.
