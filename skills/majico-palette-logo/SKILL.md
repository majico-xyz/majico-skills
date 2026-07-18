---
name: majico-palette-logo
description: Guide user through Majico palette and logo selection via MCP list/select tools and browser pickers. Use when choosing brand colors, logo candidates, or previewPickerUrl handoff.
---

# Palette and logo picks (user-in-the-loop)

Requires connected MCP — see **majico-mcp-connect**.

## Default rule

**Do not auto-pick.** `list_palette_options` and `list_logo_candidates` set `requiresUserSelection: true` and `autoPickForbidden: true`.

## Palette workflow

1. Call **`list_palette_options`** with `projectId`.
2. Present the **browser palette picker** link first (`previewPickerUrl` or `/mcp/preview/palette-picker?project=…&cursor=1`).
3. Show numbered options from the tool response (MCP may include PNG previews in Agent mode).
4. **Stop** — wait for user reply ("1", "2", "3") or browser pick.
5. On a **later turn**, call **`select_palette`** with `optionId` and **`userConfirmed: true`**.

## Logo workflow

1. Call **`list_logo_candidates`** with `projectId`.
2. Present options and **`/mcp/preview/logo-picker`** link when provided.
3. Prefer the **inline PNG image blocks** from the tool result — do not rely on markdown-image URLs alone.
4. Reject picker / preview links whose host is `0.0.0.0` or `::` (not browser-reachable); use the session public origin (`majico.d3bu7.com` / `majico.xyz`) instead.
5. Wait for user choice.
6. Call **`select_logo`** with `userConfirmed: true` (or `userDelegatedPick: true` only when user explicitly asked you to choose).

### SVG model reminder

Preferred engine path: **`majico-logo-4b`** via `LOGO_LLM_MODEL` on Ollama (`generate_asset` → `logo-generation`). Quiver `arrow-1.1` is the cloud fallback when the engine logo route is unavailable. Template IDs like `book-open` are valid shortlist candidates when no generated batch exists.

## Explicit delegation exception

If the user says "pick option 2 for me" or "choose the best dark scheme":

- May select in the same turn as list
- Pass **`userDelegatedPick: true`** — not from fit hints alone
- `userConfirmed: true` is for numbered chat replies or confirmed browser picks

## Rejections

`select_palette` / `select_logo` reject when neither `userConfirmed` nor `userDelegatedPick` is true.

## Handoff to repo

After selection, use **majico-branding-sync** to sync tokens and logo SVG into the consumer codebase.
