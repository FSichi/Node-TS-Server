# Node-TS-Server

Template base de backend con **Node.js + Express 5 + TypeScript + MongoDB**.

Pensado como punto de partida para nuevos proyectos: validación + tipos + Swagger desde una sola fuente (Zod), arquitectura en capas, logging estructurado, paginación reutilizable, Docker listo, CI configurado.

## Stack

| Capa              | Tecnología                                 |
| ----------------- | ------------------------------------------ |
| Runtime           | Node.js 22 LTS                             |
| Framework         | Express 5                                  |
| Lenguaje          | TypeScript 5.7 (NodeNext)                  |
| Package manager   | pnpm 10                                    |
| DB                | MongoDB + Mongoose 8                       |
| Validación + docs | Zod + `@asteasolutions/zod-to-openapi`     |
| Logging           | Pino + pino-http                           |
| Auth              | JWT + Argon2                               |
| Tests             | Vitest + supertest + mongodb-memory-server |
| Lint/format       | ESLint flat config + Prettier              |
| Pre-commit        | Husky + lint-staged                        |
| CI                | GitHub Actions                             |
| Container         | Dockerfile multi-stage + docker-compose    |

## Quick start

```bash
# 1. Clonar y entrar
git clone <repo> mi-app && cd mi-app

# 2. Instalar deps (pnpm es obligatorio)
pnpm install

# 3. Copiar env
cp .env.example .env
# Editar .env con tus credenciales

# 4. Levantar MongoDB local con Docker (opcional)
docker compose up mongo -d

# 5. Correr en dev
pnpm dev
```

La API queda en `http://localhost:4000`.

- Swagger UI: `http://localhost:4000/docs`
- OpenAPI JSON: `http://localhost:4000/openapi.json`
- Liveness: `http://localhost:4000/live`
- Readiness: `http://localhost:4000/ready`

## Scripts

| Comando                             | Qué hace                                 |
| ----------------------------------- | ---------------------------------------- |
| `pnpm dev`                          | Dev server con hot reload (tsx watch)    |
| `pnpm build`                        | Compila a `dist/`                        |
| `pnpm start`                        | Corre `dist/index.js` (después de build) |
| `pnpm typecheck`                    | tsc sin emitir                           |
| `pnpm lint` / `pnpm lint:fix`       | ESLint                                   |
| `pnpm format` / `pnpm format:check` | Prettier                                 |
| `pnpm test` / `pnpm test:run`       | Vitest (watch / one-shot)                |

## Variables de entorno

| Var                  | Default       | Descripción                                                  |
| -------------------- | ------------- | ------------------------------------------------------------ |
| `NODE_ENV`           | `development` | `development` / `production` / `test`                        |
| `PORT`               | `4000`        | Puerto HTTP                                                  |
| `LOG_LEVEL`          | `info`        | Pino: `fatal` `error` `warn` `info` `debug` `trace` `silent` |
| `SECRETORPRIVATEKEY` | —             | Secreto para firmar JWT                                      |
| `DATABASE_URL`       | —             | Connection string completa de Mongo (Atlas o local)          |
| `CORS_ORIGINS`       | `*`           | `*` o lista separada por comas                               |
| `BODY_LIMIT`         | `100kb`       | Límite de tamaño del body JSON                               |

El boot valida con Zod; si falta alguna obligatoria, el proceso muere con código 1.

## Estructura del proyecto

```
src/
  config/        env validation (Zod)
  controllers/   handlers HTTP (sin try/catch, errors burbujean)
  database/      conexión + modelos Mongoose
  errors/        AppError class
  helpers/       password (argon2), JWT, pagination, response envelope
  interfaces/    tipos compartidos
  logger/        pino instance
  middlewares/   auth, roles, validate, error-handler, not-found
  openapi/       registry + defineRoute + document generation
  repository/    GenericRepository<T> + repos específicos
  routes/        endpoints declarados con defineRoute()
  schemas/       Zod schemas (= DTOs)
  services/      lógica de negocio
  types/         declaration merging (Express.Request)
  app.ts         createApp() — testeable
  index.ts       boot + graceful shutdown
tests/
  *.test.ts      tests unitarios
  integration/   tests contra mongodb-memory-server
```

## Cómo agregar un nuevo endpoint

Asumamos `POST /api/orders` para crear órdenes.

**1. Schema (DTO + tipo + validación + docs en uno solo)**

```ts
// src/schemas/order.schema.ts
import { z } from 'zod';

export const createOrderSchema = z.object({
    productId: z.string(),
    quantity: z.number().int().positive(),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
```

**2. Service (tira `AppError` ante problemas)**

```ts
// src/services/OrderService.ts
import { AppError } from '../errors/AppError.js';

class OrderService {
    create = async (data: CreateOrderInput) => {
        if (data.quantity > 100) throw new AppError(400, 'Cantidad máxima: 100');
        return /* ... */;
    };
}
```

**3. Controller (sin try/catch — Express 5 atrapa rejected promises)**

```ts
// src/controllers/OrderController.ts
import { created } from '../helpers/index.js';

class OrderController {
    create = async (req, res) => {
        const order = await this.orderService.create(req.body);
        created(res, order);
    };
}
```

**4. Route con defineRoute (auto-registra en Swagger)**

```ts
// src/routes/OrderRoutes.ts
import { defineRoute } from '../openapi/defineRoute.js';
import { validate } from '../middlewares/index.js';
import { createOrderSchema } from '../schemas/order.schema.js';

const router = Router();
const prefix = '/api/orders';
const controller = new OrderController();

defineRoute(router, prefix, {
    method: 'post',
    path: '/',
    summary: 'Create order',
    tags: ['Orders'],
    body: createOrderSchema,
    middlewares: [validate({ body: createOrderSchema })],
    handler: controller.create,
});

export default { router, prefix };
```

**5. Mountar en `src/routes/index.ts`**

```ts
import orderRoutes from './OrderRoutes.js';
const allRoutes = [authRoutes, userRoutes, testRoutes, orderRoutes];
```

Listo. El endpoint aparece en Swagger automáticamente.

## Convenciones

### Envelope de respuesta

Todos los success responses:

```json
{ "data": {} }            // single
{ "data": [], "total": 0 } // lista paginada
```

Errores (todos pasan por `errorHandler`):

```json
{ "error": { "message": "...", "code": "VALIDATION_ERROR", "issues": {...} } }
```

### Paginación

Query string standard:

```
?page=0&pageSize=10&orderField=createdAt&orderDescending=true
```

Activación en el endpoint:

```ts
defineRoute(router, prefix, {
    method: 'get',
    path: '/',
    query: paginationQuerySchema,
    middlewares: [validate({ query: paginationQuerySchema })],
    handler: controller.getAll,
});
```

En el controller: `getPagination(res)` → `{ page, pageSize, orderField, orderDescending }` ya validado.

En el service: `repo.getPaginated(filter, pagination)` → `{ data, total }`.

### Autenticación

JWT via header `x-token`. Generado con `generarJWT(uid)`, verificado por middleware `requireAuth`. Para gating por rol: `requireAdmin` o `requireRoles(UserRoles.X, ...)`.

### Errores

Tirar `new AppError(statusCode, message, code?)` desde services. El middleware global formatea y loggea.

## Docker

```bash
# App + Mongo
docker compose up

# Solo Mongo (para dev local con pnpm dev)
docker compose up mongo -d
```

El Dockerfile usa multi-stage con `node:22-slim` y user no-root.

## CI

`.github/workflows/ci.yml` corre en cada PR a `main`: install, lint, typecheck, test, build.

## Pre-commit

Husky corre `lint-staged` que formatea + lintea solo los archivos staged.

## Tests

```bash
pnpm test           # watch mode
pnpm test:run       # one-shot (CI)
```

- Unitarios en `tests/*.test.ts`
- Integration en `tests/integration/*.integration.test.ts` — corren contra una MongoDB en memoria (binario descargado en el primer install). Ejemplo en `tests/integration/users.integration.test.ts`.
