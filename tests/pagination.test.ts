import './setup.js';
import { describe, expect, it } from 'vitest';
import { paginationQuerySchema } from '../src/schemas/pagination.schema.js';

describe('paginationQuerySchema', () => {
    it('applies defaults when query is empty', () => {
        const result = paginationQuerySchema.parse({});
        expect(result).toEqual({
            page: 0,
            pageSize: 10,
            orderField: undefined,
            orderDescending: false,
        });
    });

    it('coerces numeric strings to numbers', () => {
        const result = paginationQuerySchema.parse({ page: '2', pageSize: '25' });
        expect(result.page).toBe(2);
        expect(result.pageSize).toBe(25);
    });

    it('parses orderDescending as boolean', () => {
        expect(paginationQuerySchema.parse({ orderDescending: 'true' }).orderDescending).toBe(true);
        expect(paginationQuerySchema.parse({ orderDescending: 'false' }).orderDescending).toBe(
            false,
        );
    });

    it('rejects negative page', () => {
        expect(paginationQuerySchema.safeParse({ page: '-1' }).success).toBe(false);
    });

    it('rejects pageSize over 100', () => {
        expect(paginationQuerySchema.safeParse({ pageSize: '500' }).success).toBe(false);
    });

    it('rejects invalid orderDescending value', () => {
        expect(paginationQuerySchema.safeParse({ orderDescending: 'maybe' }).success).toBe(false);
    });

    it('accepts orderField as string', () => {
        const result = paginationQuerySchema.parse({ orderField: 'createdAt' });
        expect(result.orderField).toBe('createdAt');
    });
});
