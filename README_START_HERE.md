# FollowUp Desk

A tiny MCP-connected follow-up tracker for freelancers and small
agencies.

## What it does

A user asks Claude to create, list, or update follow-up records. The
application stores those records and displays them in an editable React
dashboard.

The app itself contains no AI model integration. Claude is the MCP
client; FollowUp Desk provides ordinary tools and persistent application
functionality.

## Suggested stack

-   React + TypeScript + Vite
-   Node.js + TypeScript + Express
-   Official Model Context Protocol TypeScript SDK
-   Streamable HTTP transport for the remote MCP endpoint
-   JSON file storage (`backend/data/followups.json`) for the time-boxed
    MVP

## Start with Codex

1.  Open this folder/repository in Codex.
2.  Open `CODEX_PROMPT.md`.
3.  Ask Codex: "Read CODEX_PROMPT.md fully. Inspect the current
    repository, then implement the application according to the prompt.
    Work in stages and run tests/smoke checks. Do not add a database;
    use the JSON file storage specified."
4.  Review the generated changes. Do not assume the app works just
    because code was generated.
5.  Use `BUILD_CHECKLIST.md` to verify the workflow.

## Core MCP tools

-   `create_followup`
-   `list_followups`
-   `update_followup`

## Data storage

The MVP stores data in `backend/data/followups.json`. The file should be
created automatically.

JSON-file persistence is chosen to save setup time for a short
assessment. It is appropriate only for a small, single-instance demo. It
does not provide database transactions, multi-instance coordination, or
robust concurrent access. The backend must serialize writes and use
atomic file replacement.

For deployment, use persistent disk/volume storage. Do not deploy this
file-writing backend to an ephemeral/serverless filesystem and assume
records will survive restarts.

## Assignment reminder

The assignment asks for: 1. A pitch video of five minutes or less. 2. A
live application URL. 3. An MCP URL and simple instructions to connect
it to Claude.

The app must not contain AI API keys or call AI model APIs.
