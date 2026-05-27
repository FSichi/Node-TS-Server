import './setup.js';
import { describe, expect, it } from 'vitest';
import { AppError } from '../src/errors/AppError.js';

describe('AppError', () => {
    it('captures statusCode and message', () => {
        const err = new AppError(404, 'Not found');
        expect(err.statusCode).toBe(404);
        expect(err.message).toBe('Not found');
        expect(err.isOperational).toBe(true);
    });

    it('stores optional code', () => {
        const err = new AppError(400, 'Bad', 'BAD_INPUT');
        expect(err.code).toBe('BAD_INPUT');
    });

    it('is an instance of Error', () => {
        const err = new AppError(500, 'oops');
        expect(err).toBeInstanceOf(Error);
        expect(err).toBeInstanceOf(AppError);
    });
});
