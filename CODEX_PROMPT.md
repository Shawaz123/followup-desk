# Codex Task: Build FollowUp Desk (Volopay Product & Tech Assignment)

You are the coding agent. Build a small, working MVP called **FollowUp
Desk**. Prioritize a complete end-to-end workflow over extra features.

## 1. Product

FollowUp Desk helps freelancers and small agencies track customer
follow-ups.

A user should be able to ask Claude to create or update a follow-up
through MCP, then open the web dashboard to view and edit that same
record.

Example Claude request:

> Add a follow-up for Rahul Sharma at Acme Technologies. We discussed a
> software development project worth ₹200,000. Follow up on 2026-11-14.
> Set the status to pending.

The record must be saved persistently and visible in the dashboard.

## 2. Hard assignment constraints

-   The application itself must contain **no AI integration** and no
    OpenAI, Anthropic, Gemini, or other model API keys.
-   Claude is the AI client. Our app exposes ordinary tools through MCP.
-   Do not build a website builder or online shop.
-   The dashboard must let a person inspect and edit records created
    through Claude.
-   Keep the MVP deliberately small.
-   Do not claim a feature works unless it has been implemented and
    tested.
-   Use the current official Model Context Protocol TypeScript SDK and
    its official documentation/examples. Verify the correct package
    names and APIs before coding; do not guess SDK APIs or use
    deprecated transport patterns.
-   The assignment ultimately requires a public app URL, a reachable MCP
    URL, simple Claude connection instructions, and a demo video of five
    minutes or less.

## 3. Tech choices

Use: - Frontend: React + TypeScript + Vite. - Backend: Node.js +
TypeScript + Express. - MCP: official TypeScript MCP SDK, using
Streamable HTTP for a remotely reachable MCP endpoint. - Persistence: a
JSON file at `backend/data/followups.json` for this time-boxed MVP. Do
not add SQLite, PostgreSQL, MongoDB, or any other database. - Styling:
use the UI library already installed in the project if present.
Otherwise use clean, responsive CSS; do not spend time installing a
large component library. - Validation: Zod or equivalent server-side
validation.

If the repository is empty, create the project structure. If code
already exists, inspect it first and preserve useful work.

## 4. Core data model

A follow-up record should contain:

``` ts
type FollowUp = {
  id: string;
  customerName: string;
  company: string;
  description: string;
  amount: number;
  currency: string;
  followUpDate: string; // YYYY-MM-DD
  status: "pending" | "completed";
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
};
```

Use sensible defaults for optional fields. Validate required fields and
reject invalid dates, invalid amounts, and unsupported status values.

## 5. JSON file storage requirements

Implement a small storage module shared by the REST API and MCP tools.

-   Ensure `backend/data/` is created automatically.
-   If `followups.json` does not exist, initialize it to `[]`.
-   Read and parse the JSON file safely.
-   Write updates atomically: write to a temporary file in the same
    directory, then rename it over the target file.
-   Serialize writes so two requests cannot overwrite each other's
    changes. A simple in-process promise queue/mutex is sufficient for
    this single-instance demo.
-   Return clear errors for malformed JSON or failed writes; do not
    silently erase user data.
-   Keep all file paths relative to the backend project/data directory,
    not the shell's current working directory.
-   Never store secrets in the JSON file.
-   Add a few optional seed records only if the file is empty, and make
    this easy to disable. Prefer an empty initial state for the demo.

Important limitation: JSON-file storage is acceptable only for this
small, single-instance demo. It is not suitable for multi-instance
production hosting or concurrent multi-user workloads. Explain this in
the README. For deployment, use a host with persistent disk/volume
storage; do not assume a serverless or ephemeral filesystem will retain
changes.

## 6. Required REST API

Implement and test:

-   `GET /api/health` → health response.
-   `GET /api/followups` → list records; optionally filter by `status`.
-   `GET /api/followups/:id` → one record.
-   `POST /api/followups` → create record.
-   `PATCH /api/followups/:id` → update allowed fields.
-   `DELETE /api/followups/:id` → delete record.

Use consistent JSON responses and suitable HTTP status codes. Validate
all inputs. Do not duplicate storage logic in route handlers.

## 7. Required MCP tools

Expose an MCP endpoint at `/mcp` using Streamable HTTP and the current
official SDK APIs. Implement these tools:

### `create_followup`

Inputs: - `customerName` (required string) - `company` (optional
string) - `description` (optional string) - `amount` (optional
non-negative number; default 0) - `currency` (optional string; default
"INR") - `followUpDate` (required YYYY-MM-DD date) - `status` (optional
enum: pending/completed; default pending)

Creates a real record using the shared storage module and returns the
created record.

### `list_followups`

Inputs: - `status` (optional enum: pending/completed) - `search`
(optional string matching customer/company/description)

Returns matching records and a count.

### `update_followup`

Inputs: - `id` (required string) - Any supported editable fields:
customerName, company, description, amount, currency, followUpDate,
status.

Reject an empty update and return a clear not-found error when the ID
does not exist.

MCP tools must call the same service/storage functions as REST routes.
Do not create a second data store.

Add tool descriptions that help Claude understand when and how to use
each tool. Do not add an LLM call anywhere in the application.

## 8. Frontend requirements

Build a clean, responsive dashboard with: - Product name: FollowUp
Desk. - Small summary cards: Total, Pending, Completed. - Follow-up
table with customer, company, description, amount, follow-up date,
status, and actions. - Search/filter by status. - Create follow-up
form. - Edit follow-up form/modal or inline editor. - Mark pending
records completed. - Delete action with confirmation. - Loading, empty,
and error states. - Refresh after successful mutations so Claude-created
records appear without manually editing the JSON file.

Keep the design professional and simple. Do not spend time on charts,
authentication, roles, email, notifications, or integrations.

## 9. Security and reliability basics

-   Bind to `0.0.0.0` in deployment and use the hosting platform's
    `PORT`.
-   Configure CORS for the frontend origin; allow localhost in
    development.
-   Do not expose arbitrary file operations through REST or MCP.
-   Do not expose stack traces or filesystem paths to clients.
-   Add basic request-body size limits.
-   Do not commit `.env`, credentials, or local secrets.
-   If MCP requires an origin/host validation setting, configure it
    correctly for the deployment and document it. Do not disable
    security blindly.

## 10. Development workflow

Work in small stages:

1.  Inspect the repository and report what exists.
2.  Create the project structure and install only necessary
    dependencies.
3.  Implement JSON storage and shared service functions.
4.  Implement REST API and verify it.
5.  Implement MCP Streamable HTTP endpoint using verified official SDK
    APIs.
6.  Implement React dashboard.
7.  Run type checks, lint/build if configured, and tests or direct API
    smoke tests.
8.  Fix all errors you can reproduce.
9.  Write README with setup, run, test, deploy, and Claude MCP
    connection instructions.
10. Provide a final summary: files created, commands to run, test
    results, URLs/paths to configure, and anything still incomplete.

Do not stop after generating code. Run the project and verify the core
workflow.

## 11. Acceptance criteria

The MVP is complete only when all of these work:

-   [ ] Backend starts without errors.
-   [ ] JSON file is created automatically.
-   [ ] REST API can create, list, update, and delete follow-ups.
-   [ ] MCP endpoint is reachable using Streamable HTTP.
-   [ ] Claude can call `create_followup` and the record is saved in the
    JSON file.
-   [ ] Claude can call `list_followups` and see the saved record.
-   [ ] Claude can call `update_followup` and the change persists.
-   [ ] React dashboard displays the same record.
-   [ ] User can edit the record in the dashboard and the change
    persists.
-   [ ] No AI API keys or AI model calls exist in the application.
-   [ ] README explains how to run locally and connect Claude.
-   [ ] Deployment instructions explain persistent storage requirements.

## 12. Time-boxing

Target a working local end-to-end flow first. If time is running out,
prioritize in this order:

1.  JSON storage + REST API.
2.  MCP create/list/update tools.
3.  Minimal dashboard with edit.
4.  Remote deployment and Claude connection.
5.  Visual polish.

Do not add features outside this scope unless every acceptance criterion
is already met.

Start by inspecting the repository, then implement the project. Ask me
only if a decision genuinely blocks progress; otherwise choose the
simplest reasonable option and document it.
