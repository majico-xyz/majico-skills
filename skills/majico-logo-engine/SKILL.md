---
name: majico-logo-engine
description: Generate and iterate brand logos with majico-logo-4b on the engine Ollama host via Majico MCP (staging). Use when making logos, reseeding logo batches, judging logo candidates visually, or adapting logo skill prompts after bad batches. Includes skill-adapt → generate → dual-judge loop until majority both-pass brand-usable.
---

# Majico logo engine (`majico-logo-4b`)

Requires connected **staging** MCP (`user-majico-staging`) — ping first.

## Model truth

- Preferred **generator**: **`majico-logo-4b`** (`LOGO_LLM_MODEL`) on engine Ollama (`OPENAI_BASE_URL`, typically `http://192.168.10.40:11434/v1`).
- `majico-logo-4b` is a **finetuned Qwen ~4B SVG generator** — **no vision projector**. Never use it as a pixel/vision judge.
- Bad logos are usually **bad skill/prompt input**, not a broken model.
- Target **landing-page-safe brand marks** — not elite agency, **not UI icons**, **not vague abstract blobs**.

## Dual-judge gate (required before presenting)

| Judge | Model | How |
| --- | --- | --- |
| A — cloud vision | Cursor SDK (if `CURSOR_API_KEY`) else OpenAI `gpt-4o` | PNG raster |
| B — ours | `majico-logo-4b` @ same `OPENAI_BASE_URL` | SVG markup structure only |

**Accept / present only if BOTH grade `brand_usable`.**

When A says trash/weak/ui_icon and B says brand_usable → **trust A**, tighten prompts; B is often over-lenient.

Script: `majico.xyz/scripts/logo-dual-vision-judge.ts`

## Prompt contract

| Constraint | Rule |
| --- | --- |
| Metaphor | One nameable idea; crafted fused silhouette |
| viewBox | `0 0 48 48`, 80% safe zone |
| Path budget | ≤8 drawables |
| Stroke | ~2.5–3.5; round caps/joins |
| Color | `currentColor` only |
| Negatives | Fragments, letter-noise, crypto clichés, UI icons, **weak blobs**, literal flags |

## Workflow

1. `ping` + `projectId`.
2. Generate with `majico-logo-4b` (adapt-loop scripts).
3. Dual-judge every candidate (vision + ours SVG).
4. If bothPass rate low: adapt skill → regenerate. Long loops: **≥10** iters before presenting.
5. Sync MCP only when dual-judge pass is honestly strong.
6. Select only with `userConfirmed` / `userDelegatedPick`.

## Related

Harness: `logo-generation`. Prompt: `brand-profile-craft` → `generate-logo-svg`.
