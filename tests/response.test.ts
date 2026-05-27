import './setup.js';
import { describe, expect, it, vi } from 'vitest';
import type { Response } from 'express';
import { ok, paginated, created, noContent } from '../src/helpers/response.js';

const mockRes = () => {
    const res = {
        statusCode: 200,
        json: vi.fn().mockReturnThis(),
        status: vi.fn().mockImplementation(function (this: { statusCode: number }, code: number) {
            this.statusCode = code;
            return this;
        }),
        end: vi.fn().mockReturnThis(),
    };
    return res as unknown as Response & typeof res;
};

describe('response helpers', () => {
    it('ok wraps data in envelope', () => {
        const res = mockRes();
        ok(res, { id: 1, name: 'Facu' });
        expect(res.json).toHaveBeenCalledWith({ data: { id: 1, name: 'Facu' } });
    });

    it('paginated includes data and total', () => {
        const res = mockRes();
        paginated(res, [{ id: 1 }, { id: 2 }], 25);
        expect(res.json).toHaveBeenCalledWith({ data: [{ id: 1 }, { id: 2 }], total: 25 });
    });

    it('created sets 201 and wraps data', () => {
        const res = mockRes();
        created(res, { id: 1 });
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ data: { id: 1 } });
    });

    it('noContent sets 204 and ends without body', () => {
        const res = mockRes();
        noContent(res);
        expect(res.status).toHaveBeenCalledWith(204);
        expect(res.end).toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });
});
