# Twenty CRM MCP Integration

A Model Context Protocol (MCP) server exposing Twenty CRM's REST API as tools
usable from Claude Desktop, Claude Code, or any MCP client. Generated from
Twenty's `/open-api/core` spec via
[openapi-mcp-generator](https://github.com/harsha-iiiv/openapi-mcp-generator).

Sibling of [bigcapital-integration](../bigcapital-integration) — same shape,
simpler auth (Twenty uses long-lived workspace API keys with no refresh).

## What's in here

- `openapi.json` — copy of Twenty's `/open-api/core` spec, captured from a
  running instance with a workspace API key. Already includes `servers` and a
  `bearerAuth` security scheme, so no pre-generation patching is needed.
- `server/` — the generated TypeScript MCP server, with one local edit:
  - Fixes a TS type narrowing bug on `response.headers['content-type']`
    (same fix as the Bigcapital integration).
- `.mcp.json` — Claude Code project-scope MCP config pointing at
  `server/run.sh`.

## Setup

Prereqs: Node.js 20+, a running Twenty CRM instance you can reach over HTTP.

```bash
git clone <this-repo>
cd twenty-integration/server
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
      "args": ["/absolute/path/to/twenty-integration/server/build/index.js"],
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

The project-scoped `.mcp.json` is already in this repo. From this dir Claude
Code picks it up automatically. You'll still need `server/.env` populated.

## Regenerating

If Twenty is upgraded and its API shape changes:

```bash
# Fetch fresh spec from running instance (needs a valid API key)
curl -sS -H "Authorization: Bearer $BEARER_TOKEN_BEARERAUTH" \
  http://<host>:3000/open-api/core > openapi.json

# Regenerate (will overwrite local patches in src/index.ts)
npx openapi-mcp-generator@latest -i ./openapi.json -o ./server -n twenty-mcp --force

# Re-apply the content-type narrowing fix (see commit history)
cd server && npm install && npm run build
```

## Differences from the Bigcapital MCP

- **Auth**: Twenty's API key is long-lived (decades). No signin/refresh code
  needed — the generator's default `BEARER_TOKEN_BEARERAUTH` env var handling
  is all that's wired up.
- **Workspace scoping**: Twenty encodes the workspace in the API key JWT, so
  there's no equivalent of Bigcapital's `organization-id` header.
- **Spec patching**: Twenty already publishes `servers` and `securitySchemes`
  in its OpenAPI; Bigcapital did not, so no `jq` patch step is needed here.
