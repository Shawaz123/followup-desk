import { randomUUID } from 'node:crypto';
import { editableSchema, patchSchema, type FollowUp } from './model.js';
import { readAll, updateAll } from './storage.js';

export async function listFollowUps(filters: { status?: string; search?: string } = {}) {
  const records = await readAll(); const search = filters.search?.trim().toLocaleLowerCase();
  return records.filter(item => (!filters.status || item.status === filters.status) && (!search || [item.customerName, item.company, item.description].some(v => v.toLocaleLowerCase().includes(search))));
}
export async function getFollowUp(id: string) { return (await readAll()).find(item => item.id === id) ?? null; }
export async function createFollowUp(input: unknown): Promise<FollowUp> {
  const values = editableSchema.parse(input); const now = new Date().toISOString();
  const item: FollowUp = { ...values, id: randomUUID(), createdAt: now, updatedAt: now };
  return updateAll(records => ({ records: [item, ...records], result: item }));
}
export async function updateFollowUp(id: string, input: unknown): Promise<FollowUp | null> {
  const changes = patchSchema.parse(input);
  return updateAll(records => {
    const index = records.findIndex(item => item.id === id);
    if (index < 0) return { records, result: null };
    const updated = { ...records[index]!, ...changes, updatedAt: new Date().toISOString() };
    records[index] = updated; return { records, result: updated };
  });
}
export async function deleteFollowUp(id: string): Promise<boolean> {
  return updateAll(records => { const next = records.filter(item => item.id !== id); return { records: next, result: next.length !== records.length }; });
}
