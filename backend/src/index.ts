import express from 'express';
import type { Request } from 'express';
import cors from 'cors';
import * as z from 'zod/v4';
import { createMcpExpressApp } from '@modelcontextprotocol/express';
import { createFollowUp, deleteFollowUp, getFollowUp, listFollowUps, updateFollowUp } from './service.js';
import { readAll } from './storage.js';
import { mcpAllowedOrigins, mcpNodeHandler } from './mcp.js';

const port = Number(process.env.PORT) || 3001;
const allowed = (process.env.FRONTEND_ORIGIN ?? 'http://localhost:5173').split(',').map(value => value.trim());
// Keep the SDK's Host and Origin checks active. Add each deployed API hostname.
const allowedHosts = (process.env.MCP_ALLOWED_HOSTS ?? 'localhost,127.0.0.1').split(',').map(value => value.trim()).filter(Boolean);
const frontendHosts = allowed.flatMap(origin => { try { return [new URL(origin).hostname]; } catch { return []; } });
const app = createMcpExpressApp({ host: '0.0.0.0', allowedHosts, allowedOrigins: [...mcpAllowedOrigins, ...allowedHosts, ...frontendHosts] });
app.use(cors({ origin: (origin, callback) => callback(null, !origin || allowed.includes(origin)) }));
const asyncRoute = (fn: express.RequestHandler): express.RequestHandler => (req, res, next) => { Promise.resolve(fn(req, res, next)).catch(next); };
const recordId = (req: Request) => Array.isArray(req.params.id) ? req.params.id[0]! : req.params.id!;
app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'followup-desk' }));
app.get('/api/followups', asyncRoute(async (req, res) => { const status = req.query.status; if (status && status !== 'pending' && status !== 'completed') return res.status(400).json({ error: 'status must be pending or completed' }); res.json({ followUps: await listFollowUps({ status: status as string | undefined, search: typeof req.query.search === 'string' ? req.query.search : undefined }) }); }));
app.get('/api/followups/:id', asyncRoute(async (req, res) => { const item = await getFollowUp(recordId(req)); item ? res.json({ followUp: item }) : res.status(404).json({ error: 'Follow-up not found' }); }));
app.post('/api/followups', asyncRoute(async (req, res) => { const item = await createFollowUp(req.body); res.status(201).json({ followUp: item }); }));
app.patch('/api/followups/:id', asyncRoute(async (req, res) => { const item = await updateFollowUp(recordId(req), req.body); item ? res.json({ followUp: item }) : res.status(404).json({ error: 'Follow-up not found' }); }));
app.delete('/api/followups/:id', asyncRoute(async (req, res) => { const deleted = await deleteFollowUp(recordId(req)); deleted ? res.status(204).end() : res.status(404).json({ error: 'Follow-up not found' }); }));
app.all('/mcp', (req, res) => { void mcpNodeHandler(req, res, req.body); });
app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Request failed:', error instanceof Error ? error.message : error);
  if (error instanceof z.ZodError) return res.status(400).json({ error: 'Validation failed', details: error.issues.map(issue => ({ path: issue.path.join('.'), message: issue.message })) });
  const parserStatus = typeof error === 'object' && error !== null && 'status' in error ? Number((error as { status: unknown }).status) : 0;
  if (parserStatus === 400) return res.status(400).json({ error: 'Malformed JSON request body' });
  if (parserStatus === 413) return res.status(413).json({ error: 'Request body is too large' });
  const message = error instanceof Error ? error.message : 'Unexpected error';
  if (/malformed JSON/i.test(message)) return res.status(500).json({ error: message });
  res.status(500).json({ error: 'Internal server error' });
});
void readAll().then(() => {
  app.listen(port, '0.0.0.0', () => console.log(`FollowUp Desk API listening on 0.0.0.0:${port}`));
}).catch(() => {
  console.error('FollowUp Desk could not read its JSON storage. Check the data file and restart.');
  process.exitCode = 1;
});
