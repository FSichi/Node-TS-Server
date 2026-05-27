import '../setup.js';
import { describe, expect, it, beforeAll, afterAll, beforeEach } from 'vitest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import type { Express } from 'express';

let mongo: MongoMemoryServer;
let app: Express;

beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    process.env.DATABASE_URL = mongo.getUri();
    await mongoose.connect(mongo.getUri());
    const { createApp } = await import('../../src/app.js');
    app = createApp();
}, 60_000);

afterAll(async () => {
    await mongoose.disconnect();
    await mongo.stop();
});

beforeEach(async () => {
    const { UsuarioModel } = await import('../../src/database/models/Usuario.js');
    await UsuarioModel.deleteMany({});
});

describe('POST /api/users', () => {
    const validPayload = {
        nombre: 'Facu',
        password: '123456',
        correo: 'facu@example.com',
        rol: 'USER_ROLE',
    };

    it('creates a user and returns { data } envelope', async () => {
        const res = await request(app).post('/api/users').send(validPayload);
        expect(res.status).toBe(201);
        expect(res.body.data).toBeDefined();
        expect(res.body.data.correo).toBe('facu@example.com');
        expect(res.body.data.password).toBeUndefined();
    });

    it('rejects invalid body with 400', async () => {
        const res = await request(app)
            .post('/api/users')
            .send({ ...validPayload, correo: 'not-an-email' });
        expect(res.status).toBe(400);
        expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('rejects duplicate email with 409', async () => {
        await request(app).post('/api/users').send(validPayload);
        const res = await request(app).post('/api/users').send(validPayload);
        expect(res.status).toBe(409);
    });
});
