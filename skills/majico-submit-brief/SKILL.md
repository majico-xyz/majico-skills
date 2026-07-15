---
name: majico-submit-brief
description: Submit a product brief to Majico and start niche research via MCP submit_brief. Use when creating a new brand project, onboarding a product idea, or kicking off the Majico brand pipeline.
---

# Submit brief (MCP)

Requires connected MCP and resolved **`projectId`** — see **majico-mcp-connect**.

## When to use

- New brand project with no palette/logo/guidelines yet
- User describes product, audience, or positioning and wants Majico to research niche + archetype

## Tool: `submit_brief`

Pass structured brief fields the user provides (product name, description, audience, competitors, etc.). The server enqueues niche research and updates the project canvas.

Example shape (fields vary by server version — follow tool schema from `tools/list`):

```json
{
  "projectId": "<uuid>",
  "productName": "Acme Analytics",
  "description": "Self-serve dashboards for indie SaaS founders",
  "targetAudience": "Solo founders shipping v1"
}
```

## After submit

1. Poll or wait for brand chain progress (palette options, logo candidates may appear on canvas).
2. Use **majico-palette-logo** for color and mark selection.
3. Use **majico-branding-sync** to pull DESIGN.md/tokens into the consumer repo once populated.

## SDK alternative

For automation without MCP, use project creation + brief APIs via `@majico/sdk` agent client if your integration has agent credentials — normal Cursor users should use MCP `submit_brief` only.
