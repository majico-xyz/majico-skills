#!/usr/bin/env node
/**
 * Install Majico Cursor skills into a project or global skills directory.
 *
 * Usage:
 *   npx @majico/skills init
 *   npx @majico/skills init --global
 *   npx @majico/skills list
 *   npx @majico/skills mcp-config
 */
import { cpSync, existsSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SKILLS_SRC = join(__dirname, "..", "skills");

const MCP_CONFIG = {
  mcpServers: {
    majico: {
      url: "https://api.majico.xyz/mcp",
    },
  },
};

const STDIO_MCP_CONFIG = {
  mcpServers: {
    majico: {
      command: "npx",
      args: ["-y", "user-majico-mcp"],
      env: {
        MAJICO_API_URL: "https://api.majico.xyz",
        MAJICO_PROJECT_ID: "<your-project-uuid>",
        MAJICO_API_KEY: "<your-project-api-key>",
      },
    },
  },
};

/** @returns {string[]} */
function listSkillSlugs() {
  return readdirSync(SKILLS_SRC).filter((name) => {
    const skillPath = join(SKILLS_SRC, name, "SKILL.md");
    return existsSync(skillPath);
  });
}

/**
 * @param {string} destRoot
 * @param {{ global?: boolean }} opts
 */
function installSkills(destRoot, opts = {}) {
  const slugs = listSkillSlugs();
  mkdirSync(destRoot, { recursive: true });

  for (const slug of slugs) {
    const src = join(SKILLS_SRC, slug);
    const dest = join(destRoot, slug);
    cpSync(src, dest, { recursive: true, force: true });
  }

  const scope = opts.global
    ? "global (~/.cursor/skills)"
    : "project (.cursor/skills)";
  console.log(`Installed ${slugs.length} Majico skill(s) to ${scope}:`);
  for (const slug of slugs) {
    console.log(`  - ${slug}`);
  }
  console.log("");
  console.log("Next steps:");
  console.log("  1. Add MCP config — run: npx @majico/skills mcp-config");
  console.log("  2. Cursor → Settings → MCP → majico → Connect (OAuth)");
  console.log(
    "  3. Ask the agent to use majico-mcp-connect before branding tools"
  );
}

function printUsage() {
  console.log(`@majico/skills — Cursor Agent Skills for Majico

Usage:
  npx @majico/skills init [--global]   Install skills to .cursor/skills (or ~/.cursor/skills)
  npx @majico/skills list              List bundled skill slugs
  npx @majico/skills mcp-config        Print OAuth MCP JSON for .cursor/mcp.json
  npx @majico/skills mcp-config --stdio  Print stdio MCP JSON (automation / API key)

Docs: https://github.com/majico-xyz/majico.xyz/tree/main/packages/majico-skills
`);
}

/** @param {string[]} argv */
function main(argv) {
  const [cmd, ...rest] = argv;
  const global = rest.includes("--global");
  const stdio = rest.includes("--stdio");

  switch (cmd) {
    case "init": {
      const dest = global
        ? join(homedir(), ".cursor", "skills")
        : resolve(process.cwd(), ".cursor", "skills");
      installSkills(dest, { global });
      break;
    }
    case "list": {
      const slugs = listSkillSlugs();
      console.log("Bundled skills:");
      for (const slug of slugs) {
        console.log(`  ${slug}`);
      }
      break;
    }
    case "mcp-config": {
      const config = stdio ? STDIO_MCP_CONFIG : MCP_CONFIG;
      console.log(JSON.stringify(config, null, 2));
      if (!stdio) {
        console.error(
          "\n# Paste into .cursor/mcp.json, then Connect in Cursor Settings → MCP → majico"
        );
      } else {
        console.error(
          "\n# Automation only — replace env placeholders. Cursor humans should use OAuth (omit --stdio)."
        );
      }
      break;
    }
    case undefined:
    case "help":
    case "--help":
    case "-h":
      printUsage();
      break;
    default:
      console.error(`Unknown command: ${cmd}\n`);
      printUsage();
      process.exit(1);
  }
}

main(process.argv.slice(2));
