---
name: majico-logo-engine
description: Generate and iterate brand logos with majico-logo-4b on the engine Ollama host via Majico MCP (staging). Use when making logos, reseeding logo batches, judging logo candidates visually, or when the user asks for a feature-killer mark with the SVG 4b model.
---

# Majico logo engine (`majico-logo-4b`)

Requires connected **staging** MCP (`user-majico-staging`) — ping first.

## Model truth

- Preferred mark generator: **`majico-logo-4b`** on **engine** Ollama (`OPENAI_BASE_URL` → `192.168.10.40:11434`).
- Set `LOGO_LLM_MODEL=majico-logo-4b` on app + worker. With `LLM_PROVIDER=auto`, logo ops route to Ollama **before** Quiver.
- `quiver_generate_svg` is Quiver (`arrow-1.1`) — not the 4b engine path. Do not conflate them.

## Workflow

1. `ping` → confirm project (e.g. YieldScope). Pass `projectId` on every call.
2. Reseed brand if asked: `submit_brief` (productName + oneLiner).
3. Generate: `generate_asset` `{ skillId: "logo-generation" }` → poll `get_asset_status`.
4. `list_logo_candidates` — judge each PNG preview with your eyes.
5. If user delegated picking: `select_logo` with `userDelegatedPick: true`.
6. **Render the selected mark in chat** every iteration.
7. If not feature-killer, enqueue another batch and repeat.

## Killer bar

Distinct, product-specific silhouette (checkpoint / ledger / scope / clarity for YieldScope), simple at small sizes, clean geometry, `currentColor`-friendly. Reject generic crypto orbs, empty/black tiles, and template-only sets when a 4b batch was requested.

## Related

Harness skill: `logo-generation`. Palette UX: `majico-palette-logo`.
