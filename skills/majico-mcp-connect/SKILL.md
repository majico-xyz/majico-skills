---
name: majico-mcp-connect
description: Connect Majico MCP in Cursor via OAuth, handle authRequired and project selection. Use when setting up Majico MCP, ping fails, mcp_auth is needed, or before any Majico branding tool call.
---

# Majico MCP connect

## MCP config (OAuth — preferred)

Add to `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "majico": {
      "url": "https://api.majico.xyz/mcp"
    }
  }
}
```

Local dev: use `http://127.0.0.1:3000/mcp` (not `localhost` — cookie origin must match).

Run `npx @majico/skills mcp-config` to print the snippet. Stdio/API-key automation: `npx @majico/skills mcp-config --stdio` (see `user-majico-mcp` README).

## Before any Majico tool

1. Call **`ping`** (or **`mcp_auth`** if disconnected).
2. If **`authRequired: true`**, stop and show **`message`** verbatim:

> Majico is not connected. Ask the user to open Cursor Settings → MCP → majico → Connect and complete sign-in in the browser.

3. After Connect, call **`ping`** again. Proceed only when `ok: true` and `authRequired` is absent.

## Plan upgrade

When `action` is `upgrade_plan`:

> Majico is connected, but MCP requires a Pro or Creator project. Ask the user to upgrade at https://majico.xyz/account or create/choose a Pro/Creator project via list_projects / create_project.

## Project selection

After auth, **`ping`** may return `projectSelectionRequired: true` and **`relevantProjects`**.

1. Ask the user: existing project (present top 3–5 by name + description) or **`create_project`**.
2. Pass **`projectId`** on subsequent tool calls.
3. Never paste project API keys into `mcp.json` for Cursor humans — OAuth Connect only.

## Related packages

- MCP server: `user-majico-mcp` on npm
- TypeScript client: `@majico/sdk` (scripts/CI; MCP uses it internally)
