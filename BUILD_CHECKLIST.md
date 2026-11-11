# FollowUp Desk --- Build Checklist

## Before coding

-   [ ] Open the project folder in Codex.
-   [ ] Ask Codex to read `CODEX_PROMPT.md`.
-   [ ] Let Codex inspect the repository before changing files.
-   [ ] Confirm the project has no AI API keys or model calls.

## Local MVP

-   [ ] Backend starts.
-   [ ] `backend/data/followups.json` is created automatically.
-   [ ] `GET /api/health` works.
-   [ ] Create a follow-up through REST.
-   [ ] List follow-ups through REST.
-   [ ] Edit and delete through REST.
-   [ ] MCP server starts and exposes `/mcp`.
-   [ ] Claude connects to the MCP server.
-   [ ] Claude creates a follow-up.
-   [ ] The created record appears in the React dashboard.
-   [ ] Claude lists and updates the same record.
-   [ ] Dashboard can edit the record and changes persist.

## Final assignment submission

-   [ ] Deploy frontend.
-   [ ] Deploy backend and MCP endpoint.
-   [ ] Confirm host has persistent disk/volume for the JSON file.
-   [ ] Test MCP against the deployed URL, not just localhost.
-   [ ] Prepare simple Claude connection instructions.
-   [ ] Record a pitch/demo video of 5 minutes or less.
-   [ ] Share live app URL and test credentials if login exists.
-   [ ] Share MCP URL and connection instructions.
-   [ ] Email the submission to the addresses in the assignment.

## Demo script

1.  In Claude: "Create a follow-up for Rahul Sharma at Acme
    Technologies. The project is worth INR 200000. Follow up on
    2026-11-14. Set status to pending."
2.  Show Claude calling `create_followup`.
3.  Open FollowUp Desk and show Rahul's record.
4.  Edit the follow-up date or description in the dashboard and save.
5.  Return to Claude and call `list_followups` to show the same updated
    record.

## Important JSON storage warning

A JSON file is fine for a short, single-instance MVP. It is not a
production database. A deployment platform with an ephemeral filesystem
may erase the file on restart or redeploy. Use a persistent disk/volume,
and run only one backend instance for this demo.
