import { createMcpHandler, McpServer, localhostAllowedOrigins } from '@modelcontextprotocol/server';
import { toNodeHandler } from '@modelcontextprotocol/node';
import { z } from 'zod/v4';
import { createFollowUp, listFollowUps, updateFollowUp } from './service.js';

function createServer() {
  const server = new McpServer({ name: 'followup-desk', version: '1.0.0' });
  server.registerTool('create_followup', { description: 'Create a customer follow-up. Provide customerName and a real followUpDate (YYYY-MM-DD); other fields have sensible defaults.', inputSchema: z.object({ customerName: z.string().min(1), company: z.string().optional(), description: z.string().optional(), amount: z.number().nonnegative().optional(), currency: z.string().optional(), followUpDate: z.string(), status: z.enum(['pending', 'completed']).optional() }) }, async args => {
    try { const record = await createFollowUp(args); return { content: [{ type: 'text', text: JSON.stringify(record) }] }; }
    catch (error) { return { content: [{ type: 'text', text: (error as Error).message }], isError: true }; }
  });
  server.registerTool('list_followups', { description: 'List customer follow-ups. Optionally filter by pending/completed status or search customer, company, and description.', inputSchema: z.object({ status: z.enum(['pending', 'completed']).optional(), search: z.string().optional() }) }, async args => {
    try { const records = await listFollowUps(args); return { content: [{ type: 'text', text: JSON.stringify({ count: records.length, followUps: records }) }] }; }
    catch (error) { return { content: [{ type: 'text', text: (error as Error).message }], isError: true }; }
  });
  server.registerTool('update_followup', { description: 'Update an existing follow-up by id. Include at least one editable field; use list_followups first if you need to find the id.', inputSchema: z.object({ id: z.string().min(1), customerName: z.string().optional(), company: z.string().optional(), description: z.string().optional(), amount: z.number().nonnegative().optional(), currency: z.string().optional(), followUpDate: z.string().optional(), status: z.enum(['pending', 'completed']).optional() }) }, async ({ id, ...changes }) => {
    try { if (!Object.keys(changes).length) throw new Error('At least one editable field is required'); const record = await updateFollowUp(id, changes); if (!record) throw new Error('Follow-up not found'); return { content: [{ type: 'text', text: JSON.stringify(record) }] }; }
    catch (error) { return { content: [{ type: 'text', text: (error as Error).message }], isError: true }; }
  });
  return server;
}

const handler = createMcpHandler(createServer);
export const mcpNodeHandler = toNodeHandler(handler, { onerror: error => console.error('MCP request failed:', error.message) });
export const mcpAllowedOrigins = localhostAllowedOrigins();
