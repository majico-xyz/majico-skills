import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const PKG_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SKILLS_DIR = join(PKG_ROOT, "skills");

const EXPECTED_SKILLS = [
  "majico-mcp-connect",
  "majico-sdk",
  "majico-branding-sync",
  "majico-submit-brief",
  "majico-palette-logo",
  "majico-export",
] as const;

/** Parse YAML frontmatter name and description from SKILL.md */
function parseFrontmatter(content: string): {
  name: string;
  description: string;
} {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) throw new Error("Missing frontmatter");
  const block = match[1];
  const name = block.match(/^name:\s*(.+)$/m)?.[1]?.trim();
  const description = block.match(/^description:\s*(.+)$/m)?.[1]?.trim();
  if (!name || !description)
    throw new Error("Missing name or description in frontmatter");
  return { name, description };
}

describe("@majico/skills package", () => {
  it("has valid publishable package.json", () => {
    const pkg = JSON.parse(
      readFileSync(join(PKG_ROOT, "package.json"), "utf8")
    );
    expect(pkg.name).toBe("@majico/skills");
    expect(pkg.version).toMatch(/^\d+\.\d+\.\d+$/);
    expect(pkg.private).toBeUndefined();
    expect(pkg.publishConfig?.access).toBe("public");
    expect(pkg.files).toEqual(
      expect.arrayContaining(["bin", "skills", "README.md"])
    );
    expect(pkg.bin?.["majico-skills"]).toBe("bin/majico-skills.mjs");
  });

  it("includes all expected skill directories with SKILL.md", () => {
    const slugs = readdirSync(SKILLS_DIR);
    for (const slug of EXPECTED_SKILLS) {
      expect(slugs).toContain(slug);
      expect(existsSync(join(SKILLS_DIR, slug, "SKILL.md"))).toBe(true);
    }
  });

  it("matches skill frontmatter snapshot", () => {
    const frontmatter: Record<string, { name: string; description: string }> =
      {};
    for (const slug of EXPECTED_SKILLS) {
      const content = readFileSync(join(SKILLS_DIR, slug, "SKILL.md"), "utf8");
      frontmatter[slug] = parseFrontmatter(content);
      expect(frontmatter[slug].name).toBe(slug);
    }
    expect(frontmatter).toMatchInlineSnapshot(`
      {
        "majico-branding-sync": {
          "description": "Sync Majico brand guidelines, design tokens, and logos into a consumer repo via MCP. Use when applying Majico branding in Cursor, syncing DESIGN.md/BRAND.md, or loading project UI/UX skills.",
          "name": "majico-branding-sync",
        },
        "majico-export": {
          "description": "Export Majico brand bundle via MCP get_export_manifest and download_export_zip, or @majico/sdk client.export. Use when downloading BRAND.md, DESIGN.md, tokens ZIP, or shipping brand assets to a repo.",
          "name": "majico-export",
        },
        "majico-mcp-connect": {
          "description": "Connect Majico MCP in Cursor via OAuth, handle authRequired and project selection. Use when setting up Majico MCP, ping fails, mcp_auth is needed, or before any Majico branding tool call.",
          "name": "majico-mcp-connect",
        },
        "majico-palette-logo": {
          "description": "Guide user through Majico palette and logo selection via MCP list/select tools and browser pickers. Use when choosing brand colors, logo candidates, or previewPickerUrl handoff.",
          "name": "majico-palette-logo",
        },
        "majico-sdk": {
          "description": "Use @majico/sdk TypeScript client for Majico REST API in scripts, CI, and backends. Use when automating brand export, guidelines fetch, or studio reads without MCP.",
          "name": "majico-sdk",
        },
        "majico-submit-brief": {
          "description": "Submit a product brief to Majico and start niche research via MCP submit_brief. Use when creating a new brand project, onboarding a product idea, or kicking off the Majico brand pipeline.",
          "name": "majico-submit-brief",
        },
      }
    `);
  });

  it("ships init CLI entry", () => {
    expect(existsSync(join(PKG_ROOT, "bin", "majico-skills.mjs"))).toBe(true);
  });
});
