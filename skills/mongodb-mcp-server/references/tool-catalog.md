# MongoDB MCP Server Tool Catalog

This catalog is intentionally narrowed to direct MongoDB server usage.
Treat the running server's enabled tool set as the source of truth because read-only mode, disabled tools, or version drift can suppress tools.

## Relevant tool family

For this skill, prefer the `mongodb` tool family exported by the server.
Ignore `atlas`, `atlasLocal`, and `assistant` unless the user explicitly asks for them.

## Direct MongoDB database tools

### Connection

- `connect`
- `switch-connection`

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

### Writes

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

- `config://config`
- `debug://mongodb`
- `exported-data://{exportName}`

## Practical selection hints

- Need to connect or change targets: `connect`, then `switch-connection` when moving environments.
- Need to understand the shape of data: `list-databases`, `list-collections`, `collection-schema`.
- Need counts or examples: `count`, then `find`.
- Need grouped insights: `aggregate`.
- Need performance evidence: `collection-indexes`, then `explain`.
- Need a saved result: `export`, then `exported-data://{exportName}`.
- Need to debug connection problems: `debug://mongodb` and `mongodb-logs`.
