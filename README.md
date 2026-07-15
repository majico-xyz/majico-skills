# @majico/skills

Cursor Agent Skills for [Majico.xyz](https://majico.xyz) — connect MCP (OAuth), use `@majico/sdk`, and run key brand workflows in any repo.

**Companion packages (public npm):**

| Package           | Role                                     |
| ----------------- | ---------------------------------------- |
| `user-majico-mcp` | MCP server (tools, OAuth HTTP, stdio)    |
| `@majico/sdk`     | TypeScript REST client for scripts/CI    |
| `@majico/skills`  | This package — Cursor SKILL.md workflows |

## Install

```bash
npm install @majico/skills
```

Or use without adding to `package.json`:

```bash
npx @majico/skills init
```

### Install skills into your repo

```bash
npx @majico/skills init
```

Writes bundled skills to `.cursor/skills/` (project scope). For all projects:

```bash
npx @majico/skills init --global
```

### MCP config snippet

```bash
npx @majico/skills mcp-config
```

Paste output into `.cursor/mcp.json`, then **Cursor → Settings → MCP → majico → Connect**.

Automation (API key / stdio):

```bash
npx @majico/skills mcp-config --stdio
```

See [user-majico-mcp](https://www.npmjs.com/package/user-majico-mcp) for env vars.

## Bundled skills

| Skill slug             | Purpose                                               |
| ---------------------- | ----------------------------------------------------- |
| `majico-mcp-connect`   | OAuth setup, `ping`, authRequired, project selection  |
| `majico-sdk`           | `@majico/sdk` client for CI and backends              |
| `majico-branding-sync` | Pull DESIGN.md, tokens, guidelines into consumer repo |
| `majico-submit-brief`  | `submit_brief` — start niche research                 |
| `majico-palette-logo`  | Palette/logo pickers, user-in-the-loop selection      |
| `majico-export`        | Export manifest and ZIP via MCP or SDK                |

List slugs: `npx @majico/skills list`

## Quick start (Cursor)

1. `npx @majico/skills init`
2. `npx @majico/skills mcp-config` → `.cursor/mcp.json`
3. Connect Majico in Cursor MCP settings
4. Ask the agent to follow **majico-mcp-connect**, then **majico-branding-sync**

## Publishing

Published from the [majico.xyz](https://github.com/majico-xyz/majico.xyz) monorepo. Tag: `skills-v0.1.0`. See [docs/npm-publish.md](https://github.com/majico-xyz/majico.xyz/blob/main/docs/npm-publish.md).

## License

MIT
