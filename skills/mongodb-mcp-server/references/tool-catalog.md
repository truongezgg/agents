# MongoDB MCP Server Tool Catalog

This catalog is intentionally narrowed to direct MongoDB server usage.
Treat the running server's enabled tool set as the source of truth because read-only mode, disabled tools, version drift, or client-specific exposure can suppress tools.

## Relevant tool family

For this skill, prefer the `mongodb` tool family exported by the server.
Ignore `atlas`, `atlasLocal`, and `assistant` unless the user explicitly asks for them.

## Direct MongoDB database tools

### Connection

- `switch-connection`
- `connect` on servers that expose runtime connection setup

### Discovery and metadata

- `list-databases`
- `list-collections`
- `collection-schema`
- `collection-indexes`
- `collection-storage-size`
- `db-stats`

### Reads and analysis

- `find`
- `aggregate`
- `count`
- `explain`
- `mongodb-logs`

### Export

- `export`

### Knowledge and documentation helpers

- `list-knowledge-sources`
- `search-knowledge`

### Writes

These may be absent in read-only or restricted environments.

- `create-collection`
- `create-index`
- `insert-many`
- `update-one`
- `update-many`
- `delete-many`
- `rename-collection`
- `drop-index`
- `drop-collection`
- `drop-database`

## Useful resources

- `config://config` when exposed
- `debug://mongodb` when exposed
- `exported-data://{exportName}` may be returned by `export`; some clients also provide a local filesystem export path

## Current workspace reality check

At the time of this review, the active workspace exposes:

- `switch-connection`
- discovery and metadata tools
- query and analysis tools
- `export`
- `mongodb-logs`
- knowledge search tools

It does not expose runtime `connect`, config/debug resources as callable resources here, or write tools. `export` does return an `exported-data://...` URI and a local path. Skill guidance should reflect that and avoid promising unavailable operations.

## Practical selection hints

- Need to confirm a connection: `list-databases`.
- Need to change targets: `switch-connection` when moving environments.
- Need to establish a brand new runtime connection: `connect` only if exposed.
- Need to understand the shape of data: `list-databases`, `list-collections`, `collection-schema`.
- Need counts or examples: `count`, then `find`.
- Need grouped insights: `aggregate`.
- Need performance evidence: `collection-indexes`, then `explain`.
- Need a saved result: `export`, then use the returned `exported-data://{exportName}` URI or local export path when available.
- Need MongoDB product documentation help: `list-knowledge-sources`, then `search-knowledge`.
- Need to debug connection problems: `mongodb-logs`, plus `debug://mongodb` if exposed.
