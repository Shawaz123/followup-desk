import * as z from 'zod/v4';

export const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(value => {
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}, 'followUpDate must be a real date in YYYY-MM-DD format');
export const editableSchema = z.object({
  customerName: z.string().trim().min(1).max(160), company: z.string().trim().max(160).default(''),
  description: z.string().trim().max(2000).default(''), amount: z.number().finite().nonnegative().default(0),
  currency: z.string().trim().min(3).max(3).default('INR'), followUpDate: dateSchema,
  status: z.enum(['pending', 'completed']).default('pending')
});
export const patchSchema = editableSchema.partial().refine(value => Object.keys(value).length > 0, 'At least one editable field is required');
export type FollowUp = z.infer<typeof editableSchema> & { id: string; createdAt: string; updatedAt: string };
