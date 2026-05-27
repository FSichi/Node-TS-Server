import { z } from 'zod';

export const paginationQuerySchema = z.object({
    page: z.coerce.number().int().min(0).default(0),
    pageSize: z.coerce.number().int().min(1).max(100).default(10),
    orderField: z.string().optional(),
    orderDescending: z
        .enum(['true', 'false'])
        .default('false')
        .transform(v => v === 'true'),
});

export type PaginationQuery = z.infer<typeof paginationQuerySchema>;
