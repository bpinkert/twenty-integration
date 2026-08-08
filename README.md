# Twenty CRM MCP Server

A Model Context Protocol (MCP) server exposing Twenty CRM's REST API as tools
usable from Claude Desktop, Claude Code, or any MCP client. Generated from
Twenty's `/open-api/core` spec via
[openapi-mcp-generator](https://github.com/harsha-iiiv/openapi-mcp-generator).

## About Twenty

[Twenty](https://github.com/twentyhq/twenty) is an open-source CRM
(AGPL-3.0-licensed core) — a modern alternative to Salesforce/HubSpot that
you can self-host. It ships a REST API (documented per-workspace at
`/open-api/core`) and long-lived workspace API keys, which is what this MCP
server is generated from. See [twenty.com](https://twenty.com) for hosted
options and [docs](https://twenty.com/developers) for developer
documentation.

## What's in here

- `openapi.json` — copy of Twenty's `/open-api/core` spec, captured from a
  running instance with a workspace API key. Already includes `servers` and a
  `bearerAuth` security scheme, so no pre-generation patching is needed.
- `server/` — the generated TypeScript MCP server, with one local edit:
  - Fixes a TS type narrowing bug on `response.headers['content-type']`
    in the generated code.
- `.mcp.json.example` — template for the Claude Code project-scope MCP
  config pointing at `server/run.sh`. Copy to `.mcp.json` (gitignored) and
  set the absolute path for your checkout.

## Setup

Prereqs: Node.js 20+, a running Twenty CRM instance you can reach over HTTP.

```bash
git clone <this-repo>
cd twenty-mcp/server
npm install
npm run build
```

Get a long-lived workspace API key from Twenty: Settings → Developers →
API Keys → Create. Then `server/.env`:

```
API_BASE_URL=http://<your-twenty-host>:3000/rest
BEARER_TOKEN_BEARERAUTH=<paste API key>
```

The env-var name `BEARER_TOKEN_BEARERAUTH` is fixed by the generator: it
derives it from the OpenAPI security scheme name (`bearerAuth`). Don't rename
it without also editing `src/index.ts`.

## Wire it into Claude

### Claude Desktop

Edit `claude_desktop_config.json`:
- Linux: `~/.config/Claude/claude_desktop_config.json`
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "twenty": {
      "command": "node",
      "args": ["/absolute/path/to/twenty-mcp/server/build/index.js"],
      "env": {
        "API_BASE_URL": "http://<your-twenty-host>:3000/rest",
        "BEARER_TOKEN_BEARERAUTH": "<your API key>"
      }
    }
  }
}
```

Fully restart Claude Desktop (Cmd-Q on Mac) so the MCP subprocess respawns.

### Claude Code

Copy `.mcp.json.example` to `.mcp.json` and replace the placeholder with the
absolute path to `server/run.sh` in your checkout. From this dir Claude Code
picks it up automatically. You'll still need `server/.env` populated.

## Regenerating

If Twenty is upgraded and its API shape changes:

```bash
# Fetch fresh spec from running instance (needs a valid API key)
curl -sS -H "Authorization: Bearer $BEARER_TOKEN_BEARERAUTH" \
  http://<host>:3000/open-api/core > openapi.json

# Regenerate (will overwrite local patches in src/index.ts)
npx openapi-mcp-generator@latest -i ./openapi.json -o ./server -n twenty-mcp --force

# Re-apply the content-type narrowing fix in server/src/index.ts
cd server && npm install && npm run build
```

## Design notes

- **Auth**: Twenty's API key is long-lived (decades). No signin/refresh code
  needed — the generator's default `BEARER_TOKEN_BEARERAUTH` env var handling
  is all that's wired up.
- **Workspace scoping**: Twenty encodes the workspace in the API key JWT, so
  no extra workspace/organization header is required per request.
- **Spec patching**: Twenty already publishes `servers` and `securitySchemes`
  in its OpenAPI, so the spec works with the generator unmodified.

## License

Licensed under the [Apache License, Version 2.0](LICENSE).

This project is an independent, community-maintained integration. It is not
affiliated with, endorsed by, or supported by Twenty. Twenty is a separate
project licensed under AGPL-3.0; this server communicates with it only over
its public API and contains no Twenty source code.

Copyright 2026 OutcomeAI.Io
