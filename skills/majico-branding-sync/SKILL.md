---
name: majico-branding-sync
description: Sync Majico brand guidelines, design tokens, and logos into a consumer repo via MCP. Use when applying Majico branding in Cursor, syncing DESIGN.md/BRAND.md, or loading project UI/UX skills.
---

# Majico branding sync

Requires connected MCP — see **majico-mcp-connect** first.

## Typical workflow

1. **`ping`** with `consumerRepo` and/or `requestContext` when working in a consumer repo.
2. Resolve **`projectId`** (ask user or use `relevantProjects` from ping).
3. Pull brand context:
   - `get_design_md`, `get_brand_md`, `get_design_tokens`, `get_guidelines`
   - `get_logo_svg` when implementing mark assets
   - `get_ui_ux_skills` for project-specific Cursor skill bodies
4. **Apply in repo:** write tokens to CSS, drop DESIGN.md/BRAND.md, align components to palette/fonts.
5. Optional: `sync_cursor_skills` → write `.cursor/skills/<slug>/SKILL.md` from server manifest → `update_cursor_skill` for edits.

## Empty project handling

Tools return explicit empty states (`status: "empty"`, `canvasUrl`) — not silent placeholders. If empty, guide the user through brief → palette → logo before expecting full guidelines.

## Studio surfaces (not `/flow/*`)

- Full Studio editing: `/canvas?project=…`
- MCP palette preview: `/mcp/preview/palette-picker?project=…`
- Logo picker handoff: `/mcp/preview/logo-picker`

## Do not

- Commit project API keys to the consumer repo for Cursor workflows (OAuth only).
- Auto-pick palette or logo without user confirmation — see **majico-palette-logo**.
