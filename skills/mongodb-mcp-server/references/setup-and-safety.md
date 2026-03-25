# Setup and Safety Notes

## Connection setup for direct MongoDB use

Preferred setup:

- start the MCP server with `MDB_MCP_CONNECTION_STRING` already set
- keep `--readOnly` enabled unless writes are actually needed

Why:

- the environment variable is the recommended way to provide the connection string
- passing the connection string directly at runtime can expose credentials to the language model context

Important: some clients expose only `switch-connection` and not `connect`. In those environments, assume the initial connection must already exist and use harmless metadata calls like `list-databases` to confirm it.

## Configuration behaviors to watch

Inspect `config://config` when behavior is confusing, if that resource is exposed in the client.
Common causes:

- `readOnly` is enabled, so write tools are not registered
- tools are suppressed through disabled-tools configuration
- the `connect` category is disabled, so the server must start with a configured connection string
- index-check mode may reject collection scans
- transport settings may affect remote connectivity and request handling
- the client may expose only a subset of server capabilities

## Practical troubleshooting

### Cannot connect

1. Try `list-databases` first to confirm whether any active connection already exists.
2. Review `debug://mongodb` if exposed.
3. Confirm the server has a valid connection string in configuration, or that the `connect` tool is enabled.
4. Check whether the target host is reachable from the machine running the MCP server.
5. Distinguish bad credentials from network failure from TLS or DNS problems.

### Tool missing

1. Check whether the server is in read-only mode.
2. Check whether the tool or category was disabled by configuration.
3. Check whether the client exposes only a reduced subset of tools.
4. Check whether the running server version is older than the expected tool catalog.

### Before risky writes

Summarize:

- active connection
- database and collection
- exact filter or documents being changed
- whether an export or backup should be taken first

## Good defaults by task

- Need samples: `find`
- Need totals: `count`
- Need grouped metrics: `aggregate`
- Need shape and fields: `collection-schema`
- Need index or performance clues: `collection-indexes`, then `explain`
- Need saved output: `export`
- Need product documentation help: `search-knowledge`
