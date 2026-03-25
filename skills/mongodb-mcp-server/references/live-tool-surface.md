# Live Tool Surface

This file documents the MongoDB MCP capabilities observed in the current client/runtime.
Use the running MCP server as the source of truth over this file if they ever diverge.

## Current observed capabilities

The following MongoDB MCP tools have been exercised successfully in this workspace:

- `list-databases`
- `list-collections`
- `collection-schema`
- `collection-indexes`
- `collection-storage-size`
- `db-stats`
- `find`
- `aggregate`
- `count`
- `explain`
- `export`
- `mongodb-logs`
- `list-knowledge-sources`
- `search-knowledge`
- `switch-connection`

## Current observed limitations

The following capabilities are not currently exposed in this client/runtime:

- runtime `connect`
- write tools such as create, update, delete, rename, or drop operations
- callable `config://config` resource access in this client
- callable `debug://mongodb` resource access in this client

## Behavioral notes

- Treat this client as effectively read-only.
- Confirm an active connection with `list-databases`.
- Use `switch-connection` when the user wants a different deployment and the tool remains exposed.
- `export` returns an `exported-data://...` URI and may also return a local filesystem path.
- `collection-schema` can fail to infer a schema when the target collection exists but is empty.
- Knowledge-base tools are available and useful for MongoDB syntax, explain-plan interpretation, aggregation guidance, and product documentation lookups.

## Maintenance guidance

- Update this file after re-checking the live MCP runtime.
- Keep `SKILL.md` aligned with this file, but keep `SKILL.md` focused on instructions rather than long inventories.
- If the client later exposes write tools or runtime `connect`, update this file first, then relax the guidance in `SKILL.md`.
