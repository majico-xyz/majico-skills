---
name: majico-logo-engine
description: Generate and iterate brand logos with majico-logo-4b on the engine Ollama host via Majico MCP (staging). Use when making logos, reseeding logo batches, judging logo candidates visually, or when the user asks for a feature-killer mark with the SVG 4b model. Includes batch quality-gate loop until ≥80% of a batch pass.
---

# Majico logo engine (`majico-logo-4b`)

Requires connected **staging** MCP (`user-majico-staging`) — ping first. Discover tools with GetMcpTools before CallMcpTool.

## Model truth

- Preferred mark generator: **`majico-logo-4b`** on **engine** Ollama (`OPENAI_BASE_URL` → `192.168.10.40:11434`).
- Set `LOGO_LLM_MODEL=majico-logo-4b` on app + worker. With `LLM_PROVIDER=auto`, logo ops route to Ollama **before** Quiver.
- `quiver_generate_svg` is Quiver (`arrow-1.1`) — not the 4b engine path. Do not conflate them.
- Server-side `verifyAndCleanupLogoSvg` runs after every generate/refine — still judge visually; cleanup ≠ quality.

## Prompt contract (stolen into `generate-logo-svg`)

Every engine call must honor:

| Constraint | Rule |
| --- | --- |
| Metaphor lock | One visual idea from brand story before drawing |
| viewBox | `0 0 48 48`, 80% safe zone (margin ≥4) |
| Path budget | ≤12 drawable elements |
| Stroke | ~2.5–3.5 viewBox units; round caps/joins |
| Color | `currentColor` only — no hex, gradients, filters, text |
| Negatives | No crypto orb/coin/hex badge/leaf/rocket; no letter-in-circle; no empty tiles |

## Workflow

1. `ping` → confirm project. Pass `projectId` on every call.
2. Reseed brand if asked: `submit_brief` (productName + oneLiner).
3. Generate: `generate_asset` `{ skillId: "logo-generation" }` → poll `get_asset_status` until completed. Confirm `backend: llm` / `majico-logo-4b`.
4. `list_logo_candidates` — **judge each PNG with Read / MCP image blocks**. Never use `![...](C:\path)` markdown for local files.
5. If black tiles (`currentColor` on dark): re-rasterize locally with light pad + `#111` ink, then Read the PNG.
6. Score the batch (see quality gate). If good rate **< 80%**: refine prompts/hints → another batch → repeat.
7. Selection: `userConfirmed` or `userDelegatedPick` only when allowed. Prefer the strongest passing mark.
8. Export selected SVG + shortlist into the consumer repo; ack handoff when applicable.

## Quality gate — batch critique loop (from Cursor `/loop`)

Self-pace like dynamic `/loop`: generate → judge → if fail, refine and regenerate; arm a wake only when waiting on worker jobs.

For each candidate, mark **good** only if ALL pass:

| Check | Pass criteria |
| --- | --- |
| Distinctiveness | Not generic crypto orb, letter-in-circle, stock leaf/sprout, empty tile |
| Brand fit | Silhouette evokes product metaphor (for YieldScope: checkpoint / ledger / scope / pure yield) |
| Small-size | ≤3 perceptual shapes; holds at 16–24px |
| Geometry | Intentional symmetry or deliberate asymmetry; no broken mirrors; inside safe zone |
| SVG hygiene | Valid after cleanup; outline-friendly `currentColor`; no text/gradients |

**Batch stop condition:** `good_count / batch_size > 0.80`.

Hard rejects: black/empty previews, template-only floods when 4b was requested, clip-art, photo fills, accidental letterforms.

### After a failed batch (<80%)

1. Note the top failure modes (e.g. "too many orbs", "house silhouettes", "hairlines").
2. Tighten `variationHint` / refine brief (one metaphor per regen).
3. Optionally `refineLogoSvg` on near-misses with a precise brief.
4. Enqueue a fresh `logo-generation` batch. Do not select mediocre marks to "finish".

## Killer bar (single pick)

Distinct, product-specific silhouette, simple at small sizes, clean geometry, `currentColor`-friendly. Accent `#00efff` is for UI — the mark itself stays monochrome `currentColor`.

## Related

Harness skill: `logo-generation`. Palette UX: `majico-palette-logo`. External patterns borrowed: svg-authoring (path budget / safe zone / squint test), svg-logo-generator (metaphor → primitives), svg-logo-designer (type taxonomy + negatives), Cursor loop (batch until condition).
