import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.coerce.number().default(4000),
    LOG_LEVEL: z
        .enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'])
        .default('info'),
    SECRETORPRIVATEKEY: z.string().min(1),
    DATABASE_URL: z.string().min(1),
    CORS_ORIGINS: z
        .string()
        .default('*')
        .transform(v => (v === '*' ? '*' : v.split(',').map(s => s.trim()))),
    BODY_LIMIT: z.string().default('100kb'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
    console.error('Invalid environment variables:', parsed.error.flatten().fieldErrors);
    process.exit(1);
}

export const config = parsed.data;
export type Config = typeof config;
