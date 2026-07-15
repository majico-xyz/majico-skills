---
name: majico-export
description: Export Majico brand bundle via MCP get_export_manifest and download_export_zip, or @majico/sdk client.export. Use when downloading BRAND.md, DESIGN.md, tokens ZIP, or shipping brand assets to a repo.
---

# Brand export

## MCP (Cursor agents)

1. Connect MCP and resolve **`projectId`** — see **majico-mcp-connect**.
2. **`get_export_manifest`** — list files in the export bundle.
3. **`download_export_zip`** — full ZIP as base64 in the MCP response; write files into the consumer repo.

Typical bundle: BRAND.md, DESIGN.md, design tokens (CSS/JSON), logo assets, guidelines markdown.

## SDK (CI / scripts)

```typescript
import { MajicoClient } from "@majico/sdk";

const client = new MajicoClient({
  apiKey: process.env.MAJICO_API_KEY!,
  projectId: process.env.MAJICO_PROJECT_ID!,
  baseUrl: "https://api.majico.xyz",
});

const manifest = await client.export.getManifest();
const zipBuffer = await client.export.downloadZip();
// unzip and commit in CI
```

## After export

- Place DESIGN.md / BRAND.md per project conventions
- Import `design-tokens.css` or map tokens to your styling system
- Reference **majico-branding-sync** for ongoing sync vs one-shot export

## Requirements

Pro or Creator project with brand data on canvas. Empty projects return explicit empty states — complete brief → palette → logo first.
