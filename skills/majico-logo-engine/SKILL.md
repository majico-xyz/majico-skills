---
name: majico-logo-engine
description: Generate and iterate brand logos with majico-logo-4b on the engine Ollama host via Majico MCP (staging). Use when making logos, reseeding logo batches, judging logo candidates visually, or adapting logo skill prompts after bad batches. Includes skill-adapt → generate → judge loop until ≥80% brand-usable.
---

# Majico logo engine (`majico-logo-4b`)

Requires connected **staging** MCP (`user-majico-staging`) — ping first.

## Model truth

- Preferred generator: **`majico-logo-4b`** on engine Ollama (`OPENAI_BASE_URL` → `192.168.10.40:11434`).
- Bad logos are usually **bad skill/prompt input**, not a broken model.
- Target **decent brand marks** (distinctive identity, memorable metaphor) — not elite agency work, **not UI icons / system glyphs**.
- `quiver_generate_svg` ≠ 4b. Cleanup ≠ quality — always visual-judge.

## Prompt contract

| Constraint | Rule |
| --- | --- |
| Metaphor lock | One brand idea; fused silhouette preferred over container+glyph |
| viewBox | `0 0 48 48`, 80% safe zone |
| Path budget | ≤8 drawables |
| Stroke | ~2.5–3.5; round caps/joins |
| Color | `currentColor` only |
| Cohesion | ONE connected silhouette |
| Brand creativity | Asymmetry / negative-space interest OK; must work beside a wordmark |
| Negatives | Fragments, letter-noise, crypto clichés, **UI icons** (check-in-circle, reticle, signal bars, upload arrow-in-circle, gauge widget, sparkline/chart polyline, window-layout squares, app-icon chrome) |

## Brand-usable bar (pass/fail)

Pass if: cohesive silhouette, product metaphor with personality, would look odd as a Material/SF symbol, wordmark-companion ready.

Fail if: fragments/letter-noise **or** reads as tab-bar / settings / dashboard chrome.

## Workflow

1. `ping` + `projectId`.
2. Generate via adapt-loop scripts with updated disk prompts.
3. Visually judge for **brand-usable** (not just non-fragmented).
4. If brand-usable rate **< 80%**: tighten anti-UI-icon prompts → regenerate. Long loops: **≥10 iterations** before presenting.
5. Sync into `project_generated_logos` so MCP picker matches what you call good.
6. Select only with `userConfirmed` / `userDelegatedPick`.

## Related

Harness: `logo-generation`. Prompt: `brand-profile-craft` → `generate-logo-svg`.
