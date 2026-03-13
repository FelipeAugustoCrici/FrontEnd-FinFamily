import { z } from 'zod';

export const categorySchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  type: z.enum(['expense', 'income']),
});

export type CategoryFormData = z.infer<typeof categorySchema>;
