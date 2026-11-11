# FollowUp Desk

FollowUp Desk is a small client follow-up tracker. The React dashboard and REST API, plus Claude through MCP, use the same JSON-backed service. The application contains no AI model calls or AI API keys.

## Requirements and local run

Use Node.js 20 or newer. From the project root:

```sh
npm install
npm run dev
```

The dashboard is at http://localhost:5173, the backend API is at http://localhost:3001, and the MCP endpoint is http://localhost:3001/mcp. `backend/data/followups.json` is initialized automatically. For a production build run `npm run build`, then start the backend with `npm --workspace backend start`. Serve the built `frontend/dist` from a static web host and configure its `/api` requests to reach the backend (or use a reverse proxy).

Set `PORT` for the backend listener (binds to `0.0.0.0`), `FRONTEND_ORIGIN` to the allowed frontend origin(s), and `MCP_ALLOWED_HOSTS` to the backend hostname(s), comma-separated. In local development the default CORS origin is `http://localhost:5173` and MCP host allowlist is `localhost,127.0.0.1`. The SDK host and origin validation is enabled; the deployed backend hostname and configured frontend hostname are allowed. The MCP Streamable HTTP endpoint is stateless. No separate MCP server process is needed.

## REST API

- `GET /api/health`
- `GET /api/followups?status=pending&search=acme`
- `GET /api/followups/:id`
- `POST /api/followups`
- `PATCH /api/followups/:id`
- `DELETE /api/followups/:id`

Create body example:

```json
{"customerName":"Rahul Sharma","company":"Acme Technologies","description":"Software development project","amount":200000,"currency":"INR","followUpDate":"2026-11-14","status":"pending"}
```

## Connect Claude through MCP

For a locally running server, configure an MCP client that supports remote Streamable HTTP with the endpoint `http://localhost:3001/mcp`. For Claude Desktop, remote MCP connection options depend on the Claude client/version; use its MCP connector UI and add that URL. For a deployed app use `https://YOUR_BACKEND_HOST/mcp`. The host must make that endpoint publicly reachable over HTTPS for remote Claude clients.

Available tools:

- `create_followup`: create a record. `customerName` and a valid `followUpDate` are required; other fields default sensibly.
- `list_followups`: list, optionally filter by status or search terms.
- `update_followup`: update by record `id`; call `list_followups` to find it.

Example prompts: “Create a follow-up for Rahul Sharma at Acme Technologies for INR 200000 on 2026-11-14” and “List my pending Acme follow-ups.” The dashboard refreshes on load and after mutations, and its Refresh control reads changes made through MCP.

## Verification

Run `npm run build`. To smoke-check the REST API start the app, then POST a record to `/api/followups`, GET the list, PATCH the returned ID, and DELETE it. MCP follows the official Streamable HTTP transport at `/mcp`; use an MCP client (or the SDK client) to list tools and call `create_followup`, `list_followups`, and `update_followup`. For a successful end-to-end demo, confirm the updated record appears in the dashboard.

## Storage and deployment

Persistence is a JSON file at `backend/data/followups.json`, resolved relative to the backend project. Writes are serialized in-process and replaced atomically. This is suitable only for a small, single-instance demo; it does not coordinate multiple backend instances or provide database-grade transactional/concurrent multi-user guarantees. Deploy the backend on a host with a persistent disk/volume mounted so this file survives restarts and redeploys, and run one instance. Do not rely on ephemeral or serverless filesystems for persistence. No secrets are stored in the data file.
