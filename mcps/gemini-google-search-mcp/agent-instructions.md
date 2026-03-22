# Agent instructions: use Gemini CLI for web search

Use the `gemini_web_search` MCP tool whenever the task needs current web information, including:

- latest package versions
- current documentation
- release notes and changelogs
- breaking changes
- pricing, quotas, and product availability
- current news or recent announcements

Behavior rules:

1. Prefer `gemini_web_search` over model memory when freshness matters.
2. Pass focused search queries, not long essays.
3. After tool use, summarize the answer clearly and include source links from the tool result.
4. If the question is partly current and partly conceptual, use the tool for the current part and reasoning for the conceptual part.
5. If the tool fails, say that live web search was unavailable and answer from local knowledge only when appropriate.

Good queries:

- `latest TypeScript 5.x release notes`
- `Gemini CLI MCP server docs stdio`
- `current pnpm version and installation docs`
- `Next.js 2026 caching docs`

Bad queries:

- very long prompts with multiple unrelated topics
- vague searches like `tell me everything about javascript`
