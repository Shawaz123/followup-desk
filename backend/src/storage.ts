import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { FollowUp } from './model.js';

const dataDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'data');
const filePath = join(dataDir, 'followups.json');
let writeQueue: Promise<void> = Promise.resolve();

async function ensureFile() {
  await mkdir(dataDir, { recursive: true });
  try { await readFile(filePath, 'utf8'); }
  catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
    try { await writeFile(filePath, '[]\n', { flag: 'wx' }); }
    catch (createError) { if ((createError as NodeJS.ErrnoException).code !== 'EEXIST') throw createError; }
  }
}
export async function readAll(): Promise<FollowUp[]> {
  await ensureFile();
  const text = await readFile(filePath, 'utf8');
  try {
    const data: unknown = JSON.parse(text);
    if (!Array.isArray(data)) throw new Error('Expected a JSON array');
    return data as FollowUp[];
  } catch { throw new Error('Follow-up storage contains malformed JSON. Data was not changed.'); }
}
async function atomicWrite(records: FollowUp[]) {
  const temp = join(dataDir, `.followups-${process.pid}-${Date.now()}-${Math.random().toString(16).slice(2)}.tmp`);
  try { await writeFile(temp, `${JSON.stringify(records, null, 2)}\n`, 'utf8'); await rename(temp, filePath); }
  catch (error) { throw new Error(`Could not save follow-ups: ${(error as Error).message}`); }
}
export async function updateAll<T>(mutate: (records: FollowUp[]) => { records: FollowUp[]; result: T }): Promise<T> {
  const operation = writeQueue.then(async () => {
    const current = await readAll(); const { records, result } = mutate(current); await atomicWrite(records); return result;
  });
  writeQueue = operation.then(() => undefined, () => undefined);
  return operation;
}
export { filePath };
