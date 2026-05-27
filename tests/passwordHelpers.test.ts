import './setup.js';
import { describe, expect, it } from 'vitest';
import { hashPassword, verifyPassword } from '../src/helpers/passwordHelpers.js';

describe('passwordHelpers', () => {
    it('hashPassword returns a non-empty argon2 hash', async () => {
        const hash = await hashPassword('mySecret123');
        expect(hash).toMatch(/^\$argon2/);
        expect(hash.length).toBeGreaterThan(20);
    });

    it('verifyPassword returns true for matching password', async () => {
        const hash = await hashPassword('mySecret123');
        expect(await verifyPassword(hash, 'mySecret123')).toBe(true);
    });

    it('verifyPassword returns false for wrong password', async () => {
        const hash = await hashPassword('mySecret123');
        expect(await verifyPassword(hash, 'wrong')).toBe(false);
    });

    it('two hashes of the same password are different (random salt)', async () => {
        const h1 = await hashPassword('same');
        const h2 = await hashPassword('same');
        expect(h1).not.toBe(h2);
        expect(await verifyPassword(h1, 'same')).toBe(true);
        expect(await verifyPassword(h2, 'same')).toBe(true);
    });
});
