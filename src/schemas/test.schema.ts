import { z } from 'zod';
import { Color } from '../database/enums/index.js';

export const createTestSchema = z.object({
    nombreCompleto: z.string().min(6),
    color: z.nativeEnum(Color),
    estado: z.boolean(),
});

export type CreateTestInput = z.infer<typeof createTestSchema>;
