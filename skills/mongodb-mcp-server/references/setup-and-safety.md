# Setup and Safety Notes

## Connection setup for direct MongoDB use

Preferred setup:

- start the MCP server with `MDB_MCP_CONNECTION_STRING` already set
- keep `--readOnly` enabled unless writes are actually needed

Why:

- the environment variable is the recommended way to provide the connection string
- passing the connection string directly at runtime can expose credentials to the language model context

## Configuration behaviors to watch

Inspect `config://config` when behavior is confusing.
Common causes:

- `readOnly` is enabled, so write tools are not registered
- tools are suppressed through disabled-tools configuration
- the `connect` category is disabled, so the server must start with a configured connection string
- index-check mode may reject collection scans
- transport settings may affect remote connectivity and request handling

## Practical troubleshooting

### Cannot connect

1. Review `debug://mongodb`.
2. Confirm the server has a valid connection string in configuration, or that the `connect` tool is enabled.
3. Check whether the target host is reachable from the machine running the MCP server.
4. Distinguish bad credentials from network failure from TLS or DNS problems.

### Tool missing

1. Check whether the server is in read-only mode.
2. Check whether the tool or category was disabled by configuration.
3. Check whether the running server version is older than the expected tool catalog.

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
