---
name: majico-sdk
description: Use @majico/sdk TypeScript client for Majico REST API in scripts, CI, and backends. Use when automating brand export, guidelines fetch, or studio reads without MCP.
---

# Majico SDK (@majico/sdk)

Use the SDK for **programmatic** access (CI, scripts, backends). Cursor agents should prefer **MCP tools** for interactive work; use the SDK when MCP is unavailable or for batch jobs.

## Install

```bash
npm install @majico/sdk
```

## Client setup

```typescript
import { MajicoClient, MajicoError } from "@majico/sdk";

const client = new MajicoClient({
  apiKey: process.env.MAJICO_API_KEY!,
  projectId: process.env.MAJICO_PROJECT_ID!,
  baseUrl: "https://api.majico.xyz",
});
```

Get `MAJICO_API_KEY` and project UUID from Majico **Account → Integrations**. Never commit keys.

## Resources

| Namespace           | Method                           | Use                      |
| ------------------- | -------------------------------- | ------------------------ |
| `client.brand`      | `get()`                          | Archetypes, niche intent |
| `client.tokens`     | `get()`                          | Palette and fonts        |
| `client.logo`       | `get()`                          | Selected logo SVG        |
| `client.guidelines` | `get()`                          | Markdown + LLM prompt    |
| `client.designMd`   | `get()`                          | DESIGN.md drop-in        |
| `client.export`     | `getManifest()`, `downloadZip()` | Export bundle            |
| `client.studio`     | `get()`, `patchHtmlFrame()`      | Studio canvas read/write |

## Errors

```typescript
try {
  await client.guidelines.get();
} catch (err) {
  if (err instanceof MajicoError) {
    console.error(err.status, err.code, err.isRetryable);
  }
}
```

## MCP vs SDK

| Need                            | Use                                 |
| ------------------------------- | ----------------------------------- |
| Cursor agent, OAuth, pickers    | MCP tools                           |
| CI export, cron, custom backend | `@majico/sdk`                       |
| Same REST contract              | Both call `/api/mcp/projects/:id/*` |
