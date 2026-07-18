---
name: majico-logo-engine
description: Generate and iterate brand logos with majico-logo-4b on the engine Ollama host via Majico MCP (staging). Use when making logos, reseeding logo batches, judging logo candidates visually, or adapting logo skill prompts after bad batches. Includes skill-adapt → generate → judge loop until ≥80% decent.
---

# Majico logo engine (`majico-logo-4b`)

Requires connected **staging** MCP (`user-majico-staging`) — ping first.

## Model truth

- Preferred generator: **`majico-logo-4b`** on engine Ollama (`OPENAI_BASE_URL` → `192.168.10.40:11434`).
- Bad logos are usually **bad skill/prompt input**, not a broken model. Adapt `generate-logo-svg` + RECIPE variation hints.
- Target **decent** cohesive marks (readable silhouette) — not elite agency quality.
- `quiver_generate_svg` ≠ 4b. Cleanup ≠ quality — always visual-judge.

## Prompt contract

| Constraint | Rule |
| --- | --- |
| Metaphor lock | One idea before drawing; support shape must touch |
| viewBox | `0 0 48 48`, 80% safe zone |
| Path budget | ≤8 drawables; prefer circle/rect primitives |
| Stroke | ~2.5–3.5; round caps/joins |
| Color | `currentColor` only |
| Cohesion | ONE connected silhouette; zero floating fragments |
| Negatives | Fragment soup, letter-noise, stacked gaps, crypto orb/leaf/hex, letter-in-circle |

External patterns folded in: **svg-authoring** (squint / path budget / optical balance), **svg-logo-generator** (metaphor → primitives), **svg-logo-designer** (one mark type).

## Workflow

1. `ping` + `projectId`.
2. If reseeding: `submit_brief`.
3. Generate via worker or `scripts/logo-skill-adapt-loop.ts` / `logo-quality-batch.ts` with updated disk prompts.
4. `list_logo_candidates` — judge MCP PNG blocks. Never `![...](C:\path)`.
5. If decent rate **< 80%**: tighten prompts/extras → regenerate. When user asks for a long loop: **≥10 iterations** before presenting.
6. Present only when MCP gallery matches what you call decent. Sync local batches into `project_generated_logos` (reject old trash with `rejected_at`) before claiming a fix.
7. Select only with `userConfirmed` / `userDelegatedPick`.

## Decent bar

Pass if: single intentional silhouette, ≤3 perceptual shapes, on-brand enough (scope/yield/checkpoint), not fragment/letter noise.

Fail if: floating pieces, accidental letters, random sticks, stacked unrelated shapes.

Do **not** call curated seed folders "100% good" while MCP still shows junk.

## Related

Harness: `logo-generation`. Prompt source: `brand-profile-craft` → `generate-logo-svg`.
