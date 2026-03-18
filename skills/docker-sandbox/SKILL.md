---
name: docker-sandbox
description: Use Docker Sandboxes to run AI agents inside isolated microVMs with private Docker daemons, synced workspaces, custom templates, and network policy controls.
metadata: {"clawdbot":{"emoji":"🐳","requires":{"bins":["docker"]},"primaryEnv":"","homepage":"https://docs.docker.com/ai/sandboxes/","os":["darwin","win32"]}}
---

# Docker Sandbox

Use Docker Sandboxes when an agent needs to run code, install tools, build images, or inspect untrusted projects without getting direct access to the host machine.

Each sandbox is an isolated microVM with:

- its own private Docker daemon
- a synced workspace mounted at the same absolute path as the host
- persistent state until the sandbox is removed
- HTTP/HTTPS network filtering through a host-side proxy

Sandboxes are not host containers. They do not appear in host `docker ps`; use `docker sandbox ls` instead.

## When To Use

- Running untrusted code, packages, installers, or agent-generated scripts
- Giving an AI coding agent autonomy without exposing the host Docker daemon
- Testing destructive operations in an isolated environment
- Reusing a persistent dev environment across sessions
- Restricting outbound network access for agents or package installs
- Building reproducible team environments with preinstalled tooling

## Requirements

- Docker Desktop 4.58 or later
- macOS, or Windows with experimental support enabled
- `docker sandbox` CLI plugin available
- Credentials for the selected agent configured on the host

Verify availability:

```bash
docker sandbox version
docker sandbox ls
```

Notes:

- Current official docs describe microVM sandboxes on macOS and Windows.
- Linux support is not the primary microVM path in the current docs.

## Supported Agent Commands

Docker Sandboxes currently supports these agent types:

- `claude`
- `codex`
- `copilot`
- `gemini`
- `kiro`
- `opencode`
- `cagent`
- `shell`

Use `shell` when you want a minimal sandbox and plan to install or launch tools manually.

## Mental Model

- `docker sandbox run AGENT [PATH...]` creates or reuses a sandbox and starts the agent
- `docker sandbox create ...` creates the sandbox without launching the agent
- `docker sandbox run <sandbox-name>` reconnects to an existing sandbox by name
- the sandbox persists until `docker sandbox rm`
- the agent type is fixed when the sandbox is created
- images, containers, packages, and agent state live inside that sandbox only

This is the main reason to use sandboxes instead of containers with a mounted host Docker socket: the agent gets full Docker capability without getting access to the host Docker daemon.

## Fastest Safe Workflow

### 1. Start the sandbox

For the current directory:

```bash
docker sandbox run opencode
```

For an explicit workspace:

```bash
docker sandbox run claude ~/my-project
```

For a stable custom name:

```bash
docker sandbox run --name dev opencode ~/my-project
```

Important behavior:

- `docker sandbox run` is idempotent for the same workspace path
- `docker sandbox run --name dev ...` is idempotent for the same name
- the first run is slower because Docker initializes the microVM and pulls the template image

### 2. Add extra workspaces only when needed

```bash
docker sandbox run opencode ~/my-project ~/docs:ro ~/shared-lib
```

Guidance:

- the first workspace is the primary workspace and is always read-write
- additional workspaces are read-write by default
- append `:ro` or `:readonly` when the agent only needs reference access

### 3. Inspect or debug inside the sandbox

```bash
docker sandbox exec -it <sandbox-name> bash
```

Useful checks from inside:

```bash
docker ps
docker images
pwd
whoami
```

### 4. Remove when done

```bash
docker sandbox rm <sandbox-name>
```

This deletes the VM and all packages, containers, images, and state stored inside it. Workspace file changes remain on the host.

## Core Commands

### Lifecycle

```bash
# Create or reuse and start an agent
docker sandbox run AGENT [PATH...]

# Reconnect to an existing sandbox by name
docker sandbox run <sandbox-name>

# Create without launching the agent
docker sandbox create --name <name> AGENT [PATH...]

# Open a shell or run a command inside the sandbox
docker sandbox exec -it <sandbox-name> bash
docker sandbox exec <sandbox-name> <command> [args...]

# List sandboxes
docker sandbox ls

# Remove one or more sandboxes
docker sandbox rm <sandbox-name> [<sandbox-name>...]

# Reset all sandbox state
docker sandbox reset
```

### Templates

```bash
# Run with a custom template image
docker sandbox run -t my-template:v1 claude ~/my-project

# Save a configured sandbox as a reusable image
docker sandbox save <sandbox-name> my-template:v1

# Save a configured sandbox as a tar archive
docker sandbox save -o template.tar <sandbox-name> my-template:v1
```

### Network Policy

```bash
# Show aggregated network activity
docker sandbox network log

# Apply a restrictive allowlist policy to a running sandbox
docker sandbox network proxy <sandbox-name> \
  --policy deny \
  --allow-host api.anthropic.com \
  --allow-host "*.npmjs.org" \
  --allow-host github.com \
  --allow-host "*.githubusercontent.com"
```

Important:

- the sandbox must be running when policy changes are applied
- changes take effect immediately
- changes persist across sandbox restarts

## Workspace Behavior

Workspaces are synced into the sandbox at the same absolute path as on the host.

Example:

- host: `/Users/alice/projects/myapp`
- sandbox: `/Users/alice/projects/myapp`

This path preservation matters because:

- error messages point to the same paths on host and sandbox
- hard-coded paths are less likely to break
- reviewing agent output is easier

Key rules:

- file changes sync both directions
- the agent can modify files in mounted workspaces
- files outside mounted workspaces are not accessible
- multiple sandboxes can share the same workspace path while keeping separate sandbox state

## Persistence Model

While a sandbox exists, it keeps:

- installed system packages
- pip, npm, and other language packages
- Docker images, containers, volumes, and caches created inside the sandbox
- agent configuration, credentials stored inside the sandbox, and command history

When the sandbox is removed:

- sandbox-local state is deleted
- synced workspace files remain on the host

Use named sandboxes when you want long-lived environments. Use templates when you want to recreate the same environment for multiple projects or teammates.

## Docker Behavior Inside The Sandbox

Each sandbox has its own private Docker daemon.

That means an agent can safely run commands like:

```bash
docker build -t myapp:test .
docker run --rm myapp:test npm test
docker compose up -d
docker compose exec api pytest
docker compose down
```

What this does not affect:

- host containers
- host images
- host volumes
- other sandboxes

This is a core design point of Docker Sandboxes.

## Credential Rules

Prefer host-managed credentials over interactive login inside the sandbox.

Why:

- the host-side proxy can inject credentials for supported providers
- raw credentials stay on the host instead of being readable inside the sandbox
- interactive login stores credentials inside the sandbox, which the agent could read

Important setup detail:

- set credentials in your shell startup file such as `~/.zshrc` or `~/.bashrc`
- restart Docker Desktop after changing them
- do not rely on setting an API key only in the current terminal session before running `docker sandbox run`

The sandbox daemon runs independently from the current shell session, so inline environment assignments are not a reliable way to provide credentials.

For custom templates or manual setups, some agent CLIs may still require environment variable names to exist before startup. If so, a placeholder value such as `proxy-managed` can be sufficient while the proxy injects the real credentials.

## Network Policies

Every sandbox uses a host-side HTTP/HTTPS filtering proxy that appears inside the sandbox as:

```text
host.docker.internal:3128
```

High-value facts:

- HTTP and HTTPS requests go through the proxy
- raw TCP and UDP egress is blocked
- network policies are an extra control layer, not the main isolation boundary
- the microVM boundary is the primary security boundary

### Default Policy Behavior

New sandboxes default to:

- policy mode: `allow`
- broad internet access allowed by default
- private networks, localhost, and similar sensitive CIDRs blocked by default

The default blocked CIDRs include common local and private ranges such as:

- `10.0.0.0/8`
- `127.0.0.0/8`
- `169.254.0.0/16`
- `172.16.0.0/12`
- `192.168.0.0/16`
- `::1/128`
- `fc00::/7`
- `fe80::/10`

### Choosing Policy Mode

Use `--policy allow` when:

- the agent needs broad internet access
- you only need to block a few risky destinations

Use `--policy deny` when:

- the task is high risk or untrusted
- you want an explicit allowlist for every external service
- you are building a compliance-oriented or CI-like environment

### Allowlist Example For Package Installs And GitHub

```bash
docker sandbox network proxy my-sandbox \
  --policy deny \
  --allow-host api.anthropic.com \
  --allow-host "*.npmjs.org" \
  --allow-host "*.pypi.org" \
  --allow-host files.pythonhosted.org \
  --allow-host github.com \
  --allow-host "*.githubusercontent.com"
```

If you use a different provider or a multi-provider agent such as OpenCode or Docker Agent, allow every model API, package registry, and code host the agent actually needs.

### Matching Rules That Matter

- `example.com` matches only the exact root domain
- `*.example.com` matches subdomains, not the root domain
- `example.com:443` matches only that host on that port
- to allow both root and subdomains, specify both `example.com` and `*.example.com`
- the most specific matching rule wins

### Localhost Rule

If a workflow needs access to a localhost service, allow the host and port explicitly:

```bash
docker sandbox network proxy my-sandbox --allow-host localhost:1234
```

Do not rely on `host.docker.internal` in the allowlist for this case. HTTP requests to `host.docker.internal` are rewritten to `localhost`.

### Bypass Mode

Use bypass only when a service breaks under TLS interception, such as certificate pinning:

```bash
docker sandbox network proxy my-sandbox --bypass-host api.service-with-pinning.com
```

Tradeoff:

- bypass keeps the connection working
- bypass removes proxy visibility and some security controls for that traffic

### Inspecting Network Activity

```bash
docker sandbox network log
```

Use this to see:

- which hosts the sandbox tried to reach
- whether requests were allowed or blocked
- which rule matched
- how often a destination was accessed

This is the best feedback loop when tightening a deny-by-default policy.

## Security Guidance For Agents

Sandboxes reduce host risk, but they do not make workspace changes automatically safe.

After an agent works in a workspace, review the changes before running code on the host.

At minimum, check:

```bash
git status
git diff
```

Also inspect:

- untracked files
- scripts the agent added or modified
- `.git/hooks/`
- hidden files and config files

Why this matters:

- committing may execute Git hooks
- IDEs can auto-run extensions or project tasks
- agent-created scripts may execute code when opened or run later

## Custom Templates

Use templates when you need the same setup repeatedly.

Good use cases:

- multiple teammates need the same tools
- sandbox setup is slow or repetitive
- a project needs pinned tool versions
- you want a preconfigured environment for repeated agent sessions

### Best Practice: Build From Docker's Sandbox Template

Example:

```dockerfile
FROM docker/sandbox-templates:claude-code

USER root

RUN apt-get update && apt-get install -y \
    build-essential \
    python3-pip \
    && rm -rf /var/lib/apt/lists/*

RUN pip3 install --no-cache-dir \
    pytest \
    black \
    pylint

USER agent
```

Important pattern:

- switch to `USER root` for system installs
- switch back to `USER agent` before the image ends

The base sandbox templates already include the agent binary and common dev tools. Starting from a plain base image like `python:3.11` or `node:20` is usually the wrong choice because the sandbox may be created but the selected agent binary will not exist inside it.

### Template Pull Policy Facts

Docker Sandboxes supports template pull policies:

- `missing` - use local cached image if present, otherwise pull; this is the default
- `always` - always refresh from the registry
- `never` - do not use host cache; pull inside the VM each time

Use versioned tags instead of `latest` when sharing templates with a team.

### Save A Working Sandbox As A Template

If a sandbox is already configured correctly, save it directly:

```bash
docker sandbox save claude-project my-template:v1
docker sandbox run -t my-template:v1 claude ~/other-project
```

Use this when the environment already exists and you want to reuse it quickly.

## Environment Facts

The official docs describe a shared base environment for agent templates that includes:

- Ubuntu base image
- Docker CLI with Buildx and Compose
- Git and GitHub CLI
- Node.js
- Go
- Python 3
- `uv`
- `make`
- `jq`
- `ripgrep`
- non-root `agent` user with `sudo`

Treat the exact package set as version-dependent. If a workflow depends on a specific tool version, bake it into a template instead of assuming the default image stays unchanged.

## Troubleshooting

### `'sandbox' is not a docker command`

The CLI plugin is missing or not detected.

Check:

```bash
ls -la ~/.docker/cli-plugins/docker-sandbox
```

Then restart Docker Desktop so it re-detects the plugin.

### Experimental features are disabled

On managed Docker Desktop installations, an administrator may have disabled beta or experimental features. The user may need an admin to allow them.

### Authentication failures

Most common causes:

- invalid or expired API key
- key not available to the sandbox daemon
- Docker Desktop was not restarted after adding credentials

### Workspace contains conflicting Claude credentials

If the workspace has `.claude.json` with `primaryApiKey`, sandbox credentials may conflict with workspace credentials. Prefer host-managed credentials and remove or ignore workspace-level raw keys.

### Permission denied on workspace files

Check:

- Docker Desktop file sharing settings include the workspace path or a parent directory
- the workspace path actually exists
- user file permissions allow reading the workspace

Useful checks:

```bash
ls -la <workspace>
cd <workspace> && pwd
chmod -R u+r <workspace>
```

### Windows crash when launching many sandboxes

On Windows, starting too many sandboxes in parallel can crash the OpenVMM processes. Recover by ending `docker.openvmm.exe` processes and restarting Docker Desktop if needed. Prefer launching sandboxes one at a time.

### Persistent or corrupted sandbox state

Use:

```bash
docker sandbox reset
```

This stops running sandboxes and deletes sandbox state, but keeps the daemon running.

## Operational Advice For AI Agents

- Prefer `docker sandbox run AGENT [PATH...]` for normal use; it handles create-or-reuse cleanly
- use `--name` when the workflow needs a stable identifier across sessions
- use additional workspaces sparingly, and default them to read-only when possible
- prefer host-managed credentials, not interactive login
- if the task is risky, switch the network policy to `deny` and add only required hosts
- use `docker sandbox exec -it <sandbox> bash` for debugging or manual verification
- use templates only when environment setup will be repeated enough to justify them
- remove the sandbox to wipe all sandbox-local state once the task is complete

## Decision Guide

Use the default template when:

- this is one project or a short-lived task
- the agent can install missing tools during setup

Use a custom template when:

- setup is repeated across projects or teammates
- specific tool versions matter
- you want predictable, fast startup

Use a deny-by-default network policy when:

- running untrusted code
- installing questionable packages
- working in a compliance-sensitive environment

Use a sandbox at all when:

- the agent needs Docker access
- the code is untrusted
- you do not want the agent touching the host environment directly
