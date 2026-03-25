---
name: mongodb-mcp-server
description: guidance for using the mongodb mcp server for direct mongodb database connections and database operations. use when chatgpt has access to the mongodb mcp server and needs to connect to a mongodb server with a connection string, switch connections, inspect databases and collections, query data, explain performance, export results, or troubleshoot direct mongo connection issues without relying on atlas-specific workflows.
---

# MongoDB MCP Server

Use this skill for direct MongoDB server work.
Treat Atlas, Atlas Local, and Assistant features as out of scope unless the user explicitly asks for them.

## Core operating stance

- Prefer direct database tools first.
- Prefer environment-configured connections over passing a connection string during the chat session.
- Prefer read and metadata operations before any write operation.
- State the active connection, database, and collection before querying or mutating.
- When a write is requested, inspect the current state first when practical.
- If a tool is unavailable, inspect configuration and adapt instead of assuming the server is broken.

## Connection rules

Use this order:

1. Check whether there is already an active connection.
2. If the server was started with `MDB_MCP_CONNECTION_STRING`, prefer reusing that connection.
3. Use `connect` only when no active connection exists or the user explicitly wants to connect to a different MongoDB server.
4. Use `switch-connection` when the user wants to move from one MongoDB deployment or environment to another.
5. After `connect` or `switch-connection`, reuse that same connection for the rest of the task.

Important guidance:

- Do not ask the user to paste secrets into normal chat unless there is no safer option in their MCP client.
- If the server starts with the `connect` category disabled, direct connection must be provided in server configuration instead of at runtime.
- If connection behavior is confusing, inspect `debug://mongodb` and `config://config`.

## Default workflow for direct MongoDB tasks

### 1) Connect

- `connect`
- `switch-connection`

### 2) Discover the namespace

- `list-databases`
- `list-collections`
- `collection-schema`
- `collection-indexes`
- `collection-storage-size`
- `db-stats`

Use these before writing queries when the collection shape is not already known.

### 3) Read and analyze

- `count` for quick volume checks
- `find` for sample documents or targeted retrieval
- `aggregate` for grouped metrics, reshaping, joins, or multi-stage analysis
- `explain` for query-plan and performance evidence
- `mongodb-logs` for recent server-side events or failures

### 4) Export

- `export` when the user needs a saved result set or handoff
- `exported-data://{exportName}` to inspect a prior export

### 5) Write only after inspection

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

Before running a write, summarize:

- the active connection
- the target database and collection
- the exact filter or selection criteria
- the fields or documents being changed
- the blast radius for destructive operations

## Sample prompts for each tool and resource

Use these as patterns. Rewrite them to fit the user's actual database names, collection names, filters, and limits.

### Connection and switching

- `connect`: `Connect to my MongoDB server using this connection string and then show me the available databases.`
- `switch-connection`: `Switch from the staging MongoDB connection to production and confirm which connection is now active.`

### Discovery and metadata

- `list-databases`: `List all databases on the current MongoDB connection.`
- `list-collections`: `Show me all collections in the sales database.`
- `collection-schema`: `Inspect the schema for sales.orders so I can see the common fields and types.`
- `collection-indexes`: `List the indexes on sales.orders and tell me which ones support order lookup by customerId and createdAt.`
- `collection-storage-size`: `How large is the sales.orders collection? Show the storage size in MB.`
- `db-stats`: `Show database stats for sales so I can understand document counts and storage usage.`

### Reads and analysis

- `count`: `Count how many orders in sales.orders have status \"pending\".`
- `find`: `Find 10 recent orders in sales.orders where status is \"pending\" and show orderId, customerId, total, and createdAt.`
- `aggregate`: `Aggregate sales.orders to show total revenue by month for the last 12 months.`
- `explain`: `Run an explain plan for finding orders by customerId and createdAt in sales.orders.`
- `mongodb-logs`: `Show the most recent MongoDB server log events related to failed queries or connection problems.`

### Export

- `export`: `Export the result of the pending orders query from sales.orders to JSON so I can download or inspect it later.`
- `exported-data://{exportName}`: `Open the exported-data resource for the last orders export so I can inspect the saved JSON.`

### Writes

- `create-collection`: `Create a new collection named order_audit in the sales database.`
- `create-index`: `Create an index on sales.orders for customerId and createdAt descending.`
- `insert-many`: `Insert these three seed documents into sales.order_audit.`
- `update-one`: `Update one order in sales.orders where orderId is 1001 and set status to \"shipped\".`
- `update-many`: `Update many orders in sales.orders where status is \"pending\" and set priority to \"high\".`
- `delete-many`: `Delete test orders from sales.orders where environment is \"dev\".`
- `rename-collection`: `Rename sales.order_audit to sales.order_audit_archive.`
- `drop-index`: `Drop the old customerId_1 index from sales.orders.`
- `drop-collection`: `Drop the temporary sales.tmp_import collection.`
- `drop-database`: `Drop the sandbox_sales database.`

### Diagnostic resources

- `config://config`: `Read the MCP server config resource and tell me whether readOnly mode or disabled tools are preventing writes.`
- `debug://mongodb`: `Read the MongoDB debug resource and explain why the latest connection attempt failed.`

## Query planning rules

- Run `collection-schema` before writing non-trivial filters or projections against an unfamiliar collection.
- Run `collection-indexes` before giving performance advice.
- Use `explain` when recommending index changes or query rewrites.
- Prefer `count` over a full `find` when only totals are needed.
- Prefer `find` for spot checks before `update-many` or `delete-many`.
- Prefer `aggregate` when the user asks for grouped summaries, funnels, or cross-field computations.

## Troubleshooting rules

When tools fail or behavior is unexpected:

1. Read `debug://mongodb` for the latest connection attempt and error details.
2. Read `config://config` to check read-only mode, disabled tools, and other effective settings.
3. If writes are unavailable, assume `readOnly` or disabled tool categories first.
4. If connection switching is unavailable, assume the `connect` category may be disabled and the connection string must come from startup configuration.
5. Distinguish clearly between connection failure, authentication failure, authorization failure, and tool suppression.

## Response pattern

When reporting results after tool use, include:

1. active connection used
2. database and collection, if applicable
3. tool or sequence of tools used
4. key result in plain language
5. caveats such as read-only mode, disabled tools, missing indexes, limits, or skipped writes

## Bundled references

- See `references/tool-catalog.md` for the direct-connection MongoDB tool inventory.
- See `references/setup-and-safety.md` for connection setup and troubleshooting guidance.
