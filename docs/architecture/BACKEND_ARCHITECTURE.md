# Especificación de Arquitectura — Backend (API)

> **Propósito de este documento**
> Es una *especificación de arquitectura orientada a IA* (Spec-Driven Development). Describe **cómo está construido** este backend y, sobre todo, **las reglas que un agente de IA debe seguir** para añadir o modificar código de forma consistente — o para reproducir esta misma arquitectura en un proyecto nuevo.
>
> No es un README de "cómo correr el proyecto". Es el contrato de cómo se escribe el código.
>
> Implementación de referencia: API SaaS multi-tenant para clínicas dentales. Cualquier ejemplo concreto (`appointments`, `branches`, `clinics`) es ilustrativo; el patrón es lo que importa.

---

## 1. Stack y principios

| Capa | Tecnología |
| --- | --- |
| Runtime | Node.js (ESM, `"type": "module"`) ejecutado con `tsx` en dev y bundleado con `esbuild` en build |
| Framework HTTP | **Express 5** |
| Lenguaje | **TypeScript** (strict), imports con extensión `.ts` explícita (`allowImportingTsExtensions`) |
| ORM / DB | **Drizzle ORM** sobre **PostgreSQL** (`postgres-js`) |
| Validación | **Zod 4** (única fuente de verdad de los tipos de request) |
| Auth | **JWT** (access + refresh), `bcryptjs` para hashing |
| Logging | **pino** + `pino-pretty` |
| Jobs | `node-cron` |
| Tests | **Vitest** + `supertest` |
| Monorepo | **Turborepo** + **pnpm workspaces** |

### Principios no negociables

1. **Arquitectura en capas estricta.** El flujo de una request es siempre el mismo y unidireccional:
   `Route → Middleware → Controller → Service → Repository → DB`.
   Una capa **solo** llama a la capa inmediatamente inferior. Nunca se salta capas (un controller jamás toca la DB; un repository jamás lanza reglas de negocio).
2. **Inyección de dependencias por constructor**, cableada manualmente en un único *composition root* (`bootstrap/container.ts`). No hay framework de DI ni decoradores `@Injectable`. Las clases reciben sus dependencias por constructor y son instanciadas una sola vez como singletons.
3. **Zod es la única fuente de verdad** para la forma de los datos que entran por HTTP. Los tipos de DTO se *derivan* del schema con `z.infer`, nunca se escriben a mano.
4. **Respuesta HTTP con envelope uniforme.** Todo lo que sale de la API tiene la misma forma (`{ success, message, data?, meta?, errors? }`).
5. **Errores como excepciones tipadas.** El código de negocio lanza `ApiError`; un único middleware al final de la cadena lo traduce a una respuesta HTTP. No se hace `res.status(...).json(...)` de error disperso por el código.
6. **Multi-tenancy por `clinicId` (tenant).** Casi toda fila pertenece a un tenant. El scoping por tenant se resuelve en middleware y se propaga explícitamente como argumento hacia abajo. **Nunca** se confía solo en filtros del cliente.
7. **Soft delete por defecto.** "Borrar" = `isActive = false`. No se hace `DELETE` físico salvo casos justificados.

---

## 2. Estructura de directorios

```
apps/api/src/
├── server.ts                  # Entry point: testea conexión DB y levanta el server
├── app.ts                     # Construye la app Express (middlewares globales, router, error handler)
│
├── bootstrap/
│   └── container.ts           # COMPOSITION ROOT: instancia repos, services y controllers (singletons)
│
├── routes/
│   └── v1/index.ts            # Monta cada router de módulo bajo /api/v1/<recurso>
│
├── middlewares/               # Middlewares Express transversales
│   ├── auth.ts                # Verifica JWT, carga el usuario en req.user
│   ├── tenant.ts              # Resuelve req.tenantId a partir del token
│   ├── protect.ts             # = [authMiddleware, tenantMiddleware]
│   ├── guard.ts               # guardMiddleware(permissions[]) / roleGuardMiddleware(roles[])
│   ├── validateSchema.ts      # Valida body/query/params contra schemas Zod
│   ├── errorHandler.ts        # Traduce errores a respuesta HTTP (último middleware)
│   ├── notFound.ts            # 404 para rutas no registradas
│   └── rateLimit.ts
│
├── modules/                   # Un directorio por dominio. AQUÍ vive la lógica de negocio.
│   └── <module>/
│       ├── <module>.routes.ts
│       ├── <module>.controller.ts
│       ├── <module>.service.ts
│       ├── <module>.repository.ts
│       ├── <module>.resource.ts
│       └── <module>.schema.ts
│
├── core/                      # Infraestructura compartida (no dominio)
│   ├── config/                # env.ts (variables de entorno validadas)
│   ├── db/
│   │   ├── index.ts           # Cliente drizzle (db) + testDatabaseConnection
│   │   ├── TransactionManager.ts
│   │   ├── schema/            # Tablas Drizzle (una por archivo) + index.ts barrel
│   │   ├── migrations/        # Migraciones generadas por drizzle-kit
│   │   ├── seeds/             # Datos semilla
│   │   └── scripts/           # reset.ts, etc.
│   ├── errors/
│   │   ├── ApiError.ts        # Clase de error de dominio
│   │   ├── ErrorCodes.ts      # Catálogo de códigos de error
│   │   ├── helpers/asyncHandler.ts
│   │   └── index.ts
│   └── shared/
│       ├── BaseController.ts  # Helpers de respuesta (ok, created, noContent, ...)
│       ├── BaseRepository.ts
│       └── decorators/CatchAsync.ts
│
├── common/                    # Utilidades y tipos genéricos reutilizables
│   ├── schemas/               # common.schema.ts (createIdSchema, paginationQuerySchema, ...)
│   ├── types/                 # requests.ts (TypedRequest), response.ts (ApiResponse), pagination.ts
│   └── utils/                 # request.ts (validateRequest), pagination.ts, date.ts, jwt.ts, transformers/
│
├── commands/                  # Scripts CLI (update-permissions, etc.)
├── jobs/                      # Cron jobs
└── docs/                      # openapi.yaml
```

### Path aliases (tsconfig)

Usar **siempre** los aliases, nunca rutas relativas profundas (`../../../`):

```
@/*            → src/*
@core/*        → src/core/*
@common/*      → src/common/*
@modules/*     → src/modules/*
@routes/*      → src/routes/*
@middlewares/* → src/middlewares/*
@commands/*    → src/commands/*
@channels/*    → src/channels/*
@jobs/*        → src/jobs/*
```

Los paquetes compartidos del monorepo se importan por su nombre: `@repo/guards`, `@repo/contracts`.

---

## 3. Anatomía de un módulo (el patrón canónico)

Cada dominio es un directorio en `modules/` con **6 archivos** y responsabilidades estrictamente separadas. Este es el corazón de la arquitectura: si entiendes esto, entiendes el backend.

| Archivo | Responsabilidad | Qué SÍ hace | Qué NO hace |
| --- | --- | --- | --- |
| `*.schema.ts` | Contrato de entrada. Schemas Zod + tipos derivados + tipos de request. | Definir validación de `body`/`query`/`params`, reglas de formato y refinements (`superRefine`). Exportar DTOs vía `z.infer`. | Lógica de negocio, acceso a DB. |
| `*.routes.ts` | Mapa de endpoints. | Declarar rutas Express, encadenar middlewares (`protect`, `guard`, `validateSchema`) y apuntar al método del controller (tomado del container). | Lógica. Solo cableado. |
| `*.controller.ts` | Adaptador HTTP. Clase que extiende `BaseController`. | Extraer datos validados (`validateRequest`), resolver `tenantId`, llamar al service, formatear la respuesta con un *resource* y devolverla con un helper (`this.ok`, `this.created`...). | Reglas de negocio, queries, `try/catch` (lo hace `@CatchAsync`). |
| `*.service.ts` | Lógica de negocio. Clase POJO. | Orquestar reglas, validaciones de dominio, coordinar varios repositories, transacciones, lanzar `ApiError`. | Tocar `req`/`res`, conocer Express, construir SQL. |
| `*.repository.ts` | Acceso a datos. Clase que recibe `Database` por constructor. | Construir y ejecutar queries Drizzle, aplicar filtros, paginación, joins. Devolver filas crudas/tipos `*Select`. | Reglas de negocio, lanzar `ApiError` de dominio, formatear respuestas. |
| `*.resource.ts` | Serialización de salida. Funciones puras. | Transformar filas de DB (`*Select`) en el shape público de la API (formatear fechas, ocultar campos, agrupar relaciones). | Acceso a DB, lógica. |

### Reglas de flujo

- El **Controller** recibe el request ya validado por el middleware `validateSchema`. Lee los datos con `validateRequest(req)` (no toca `req.body` crudo).
- El **Controller** pasa al Service **solo** datos planos + el `tenantId` resuelto. Nunca pasa `req`/`res`.
- El **Service** recibe `tenantId` como argumento explícito y lo usa para scoping. Devuelve entidades de dominio o lanza `ApiError`.
- El **Repository** recibe filtros ya construidos y **siempre** incluye el `clinicId`/`tenantId` en el `WHERE` cuando aplica.
- El **Resource** se aplica en el Controller, justo antes de responder.

### 3.1 Schema (`*.schema.ts`)

Estructura recomendada, en secciones comentadas:

```ts
import { z } from 'zod';
import { createIdSchema, paginationQuerySchema } from '@common/schemas/common.schema.ts';
import { commonIdParamSchema, TypedRequest } from '@common/types/requests.ts';

// 1. CORE DOMAIN SCHEMAS — el input base y sus variantes
const appointmentInputSchema = z.object({
  branchId: createIdSchema('branchId'),
  patientId: createIdSchema('patientId'),
  startsAt: z.iso.datetime({ message: 'Invalid datetime format for startsAt' }),
  // ...
}).strict();                                   // .strict() => rechaza claves desconocidas

export const createAppointmentSchema = appointmentInputSchema.superRefine((data, ctx) => {
  // reglas cruzadas (ej. endsAt > startsAt, duración mín/máx)
  if (new Date(data.endsAt) <= new Date(data.startsAt)) {
    ctx.addIssue({ code: 'custom', message: 'endsAt must be after startsAt', path: ['endsAt'] });
  }
});

export const updateAppointmentSchema = appointmentInputSchema.omit({ clinicId: true }).partial();

// 2. API REQUEST SCHEMAS — agrupan body/query/params por endpoint
export const createAppointmentRequestSchema = { body: createAppointmentSchema };
export const getAppointmentRequestSchema    = { params: commonIdParamSchema.params };
export const updateAppointmentRequestSchema = { params: commonIdParamSchema.params, body: updateAppointmentSchema };

// 3. DTOs & DOMAIN TYPES — derivados, NUNCA escritos a mano
export type CreateAppointmentDTO = z.infer<typeof createAppointmentSchema>;
export type UpdateAppointmentDTO = z.infer<typeof updateAppointmentSchema>;

// 4. TYPED REQUESTS — para tipar los métodos del controller
export type CreateAppointmentRequest = TypedRequest<typeof createAppointmentRequestSchema>;
export type UpdateAppointmentRequest = TypedRequest<typeof updateAppointmentRequestSchema>;
```

Convenciones de schema:
- Todo schema de objeto de input usa `.strict()` para rechazar claves no reconocidas (el middleware las reporta como `unrecognizedKeys`).
- IDs con el helper `createIdSchema('campo')` de `@common/schemas`.
- Listados extienden `paginationQuerySchema`.
- Reglas que cruzan campos → `superRefine`/`refine`, **no** en el service si son puramente estructurales.
- Los `updateSchema` suelen ser `inputSchema.partial()` (y omiten campos que no se pueden cambiar, como `clinicId`).

### 3.2 Routes (`*.routes.ts`)

Solo cableado declarativo. Orden de middlewares: `protect` (global del router) → `guard` (permiso) → `validateSchema` → método del controller.

```ts
import { Router } from 'express';
import { appointmentsController } from '@/bootstrap/container.ts';
import { protect } from '@middlewares/protect.ts';
import { guardMiddleware } from '@middlewares/guard.ts';
import { validateSchema } from '@middlewares/validateSchema.ts';
import { PERMISSIONS } from '@repo/guards';
import { createAppointmentRequestSchema, /* ... */ } from '@modules/appointments/appointments.schema.ts';

const router: Router = Router();

router.use(protect);                           // autenticación + tenant para todo el router

router.post(
  '/',
  guardMiddleware([PERMISSIONS.CREATE_APPOINTMENT]),
  validateSchema(createAppointmentRequestSchema),
  appointmentsController.createAppointment,
);

export default router;
```

El router se monta en `routes/v1/index.ts`:

```ts
v1Router.use('/appointments', appointmentsRoutes);
```

### 3.3 Controller (`*.controller.ts`)

Clase decorada con `@CatchAsync` (envuelve cada método con `asyncHandler` para que los errores async lleguen al error handler sin `try/catch`). Extiende `BaseController`.

```ts
@CatchAsync
export class AppointmentsController extends BaseController {
  constructor(private appointmentsService: AppointmentsService) {
    super();
  }

  async createAppointment(req: CreateAppointmentRequest, res: Response) {
    const { body } = validateRequest(req);                 // datos ya validados por el middleware
    const tenantId = this.resolveTenantId(req.tenantId);   // garantiza tenant resuelto
    const result = await this.appointmentsService.create(body, tenantId!);
    return this.created(res, 'Appointment created successfully', appointmentResource(result));
  }

  async getAppointments(req: GetAppointmentsRequest, res: Response) {
    const { query } = validateRequest(req);
    const tenantId = this.resolveTenantId(req.tenantId);
    const result = await this.appointmentsService.getAllAppointments(query, tenantId);
    return this.ok(res, 'Appointments retrieved successfully', {
      ...result,
      items: appointmentWithRelationsCollectionResource(result.items),
    });
  }
}
```

Reglas del controller:
- **Nunca** `try/catch` por error de negocio — lo cubre `@CatchAsync`. Para fallar, el service lanza `ApiError`.
- Siempre responde con un helper de `BaseController` (`this.ok`, `this.created`, `this.noContent`, `this.paginated`).
- Siempre serializa con un *resource* antes de responder. No devuelve filas crudas de Drizzle.
- `resolveTenantId(req.tenantId)` lanza 500 si el tenant no fue resuelto (defensa en profundidad).

### 3.4 Service (`*.service.ts`)

POJO con dependencias por constructor. Aquí vive **toda** la lógica de negocio.

```ts
export class AppointmentsService {
  constructor(
    private appointmentsRepository: AppointmentsRepository,
    private branchesRepository: BranchesRepository,
    // ... otros repos que necesite orquestar
  ) {}

  async create(values: CreateAppointmentDTO, clinicId: string) {
    await this.validateClinicOwnership({ clinicId, /* ... */ });   // reglas de dominio
    await this.validateTimeSlot({ /* ... */ });                    // ej. solapamientos

    const result = await this.appointmentsRepository.create({ ...values, clinicId });
    if (!result) {
      throw new ApiError('An unexpected error occurred', 500, ErrorCodes.system.INTERNAL_SERVER_ERROR);
    }
    return result;
  }

  async getAppointmentById(id: string, clinicId: string | null) {
    const result = await this.appointmentsRepository.findOne({ id, ...(clinicId ? { clinicId } : {}) });
    if (!result) throw new ApiError('Appointment not found', 404, ErrorCodes.system.NOT_FOUND);
    return result;
  }
}
```

Reglas del service:
- Recibe `clinicId`/`tenantId` como argumento explícito y lo propaga a cada repo. Para superadmin, `clinicId` puede ser `null` (sin scoping de tenant).
- Lanza `ApiError(message, statusCode, errorCode)` para cualquier condición de fallo de dominio (404, 409, 422...).
- Puede orquestar **varios** repositories y usar `Promise.all` para validaciones en paralelo.
- Transacciones: vía `ITransactionManager` inyectado (`this.transactionManager.run(async (tx) => { ... })`).
- No conoce Express (`req`/`res`), ni Zod, ni cómo se serializa la respuesta.

### 3.5 Repository (`*.repository.ts`)

Acceso a datos con Drizzle. Recibe `Database` por constructor.

```ts
export class AppointmentsRepository {
  constructor(private readonly db: Database) {}

  private applyFilters(filters: AppointmentFiltersDTO): SQL[] {
    const conditions: SQL[] = [];
    if (filters.clinicId) conditions.push(eq(appointments.clinicId, filters.clinicId));
    // soft-delete por defecto salvo que el filtro pida lo contrario
    if (filters.isActive === undefined) conditions.push(eq(appointments.isActive, true));
    return conditions;
  }

  async findAll(filters: AppointmentFiltersDTO, pagination?: { page?: number; limit?: number }) {
    const conditions = this.applyFilters(filters);
    const dataQuery = this.getBaseSelect().where(and(...conditions)).$dynamic();
    if (pagination?.page && pagination?.limit) {
      dataQuery.limit(pagination.limit).offset((pagination.page - 1) * pagination.limit);
    }
    const countQuery = this.db.select({ count: count() }).from(appointments).where(and(...conditions));
    const [data, [totalResult]] = await Promise.all([dataQuery, countQuery]);
    return { data, total: Number(totalResult?.count ?? 0) };
  }

  async create(data: AppointmentInsert) {
    const [row] = await this.db.insert(appointments).values(data).returning();
    return row;
  }

  async delete(id: string): Promise<boolean> {                // SOFT delete
    const [row] = await this.db.update(appointments).set({ isActive: false }).where(eq(appointments.id, id)).returning();
    return !!row;
  }
}
```

Reglas del repository:
- Devuelve tipos de Drizzle (`*Select`) o `null`/`undefined`. **No** lanza `ApiError` de dominio (eso lo decide el service según si la fila existe).
- El scoping por tenant se aplica **aquí**, en el `WHERE`, a partir de los filtros recibidos.
- Soft-delete por defecto en listados (`isActive = true`) salvo override explícito.
- Joins/relaciones: helper privado `getBaseSelect()` con los `leftJoin` reutilizables.
- `findAll` devuelve `{ data, total }`; la transformación a forma paginada la hace `paginatedResult` en el service.

### 3.6 Resource (`*.resource.ts`)

Funciones puras que mapean filas de DB → shape público. Una función por "vista" + su versión de colección.

```ts
export const appointmentResource = (a: AppointmentSelect) => ({
  id: a.id,
  startsAt: formatDate(a.startsAt),       // fechas siempre formateadas aquí
  endsAt: formatDate(a.endsAt),
  isActive: a.isActive,
  // ...solo los campos que la API expone
});

export const appointmentWithRelationsResource = (data: AppointmentJoined) => ({
  /* ...campos + objetos anidados (clinic, branch, patient...) ya aplanados */
});

export const appointmentCollectionResource = (rows: AppointmentSelect[]) => rows.map(appointmentResource);
```

Reglas del resource:
- Es el único lugar donde se decide qué sale al cliente. Para ocultar un campo, simplemente no se mapea.
- Formatea fechas con el helper común (`formatDate`).
- No hace I/O.

---

## 4. Composition Root (`bootstrap/container.ts`)

Único lugar donde se instancian las clases. Orden: **infra → repositories → services → controllers**. Todo se exporta como singleton.

```ts
import { db } from '@core/db/index.ts';
import { DrizzleTransactionManager } from '@core/db/TransactionManager.ts';

// infra
export const transactionManager = new DrizzleTransactionManager(db);

// repositories (todos reciben db)
export const appointmentsRepository = new AppointmentsRepository(db);
export const branchesRepository = new BranchesRepository(db);

// services (reciben los repos que necesitan)
export const appointmentsService = new AppointmentsService(
  appointmentsRepository,
  branchesRepository,
  /* ...demás repos */
);

// controllers (reciben su service)
export const appointmentsController = new AppointmentsController(appointmentsService);
```

Las **routes** importan el controller ya instanciado desde aquí. Esto mantiene las clases libres de cómo se construyen sus dependencias y permite sustituirlas fácilmente en tests.

---

## 5. Manejo de errores

### 5.1 `ApiError`

Excepción de dominio. Lleva `statusCode`, `errorCode` (del catálogo) y opcionalmente `details`.

```ts
throw new ApiError('Appointment not found', 404, ErrorCodes.system.NOT_FOUND);
throw new ApiError('Validation failed', 400, ErrorCodes.validation.VALIDATION_ERROR, { details });
```

### 5.2 `ErrorCodes`

Catálogo central de códigos como constante `as const`, agrupados por dominio (`system`, `auth`, `validation`, ...). El tipo `ErrorCodeType` se deriva de él. **Todo error usa un código del catálogo** — el frontend mapea esos códigos a mensajes i18n.

```ts
export const ErrorCodes = {
  system: { NOT_FOUND: 'NOT_FOUND', CONFLICT: 'CONFLICT', INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR', /* ... */ },
  auth:   { UNAUTHORIZED: 'UNAUTHORIZED', FORBIDDEN: 'FORBIDDEN', INVALID_TOKEN: 'INVALID_TOKEN', /* ... */ },
  validation: { VALIDATION_ERROR: 'VALIDATION_ERROR' },
} as const;
```

### 5.3 Propagación

- El código **lanza**; nunca responde un error a mano.
- `@CatchAsync` envuelve los métodos del controller con `asyncHandler`, que captura rechazos async y los pasa a `next(err)`.
- `errorHandlerMiddleware` (último `app.use`) recibe el error, y si es `ApiError` produce el envelope `errorResponse(...)`; si no, lo trata como 500.
- `BaseController` ofrece atajos semánticos que lanzan `ApiError`: `this.notFound()`, `this.forbidden()`, `this.conflict()`, `this.unauthorized()`, `this.tooMany()`.

---

## 6. Envelope de respuesta

Toda respuesta exitosa pasa por `successResponse` (vía los helpers de `BaseController`):

```jsonc
// éxito simple
{ "success": true, "message": "Appointment created successfully", "data": { /* resource */ } }

// listado paginado (data.items + data.pagination)
{ "success": true, "message": "...", "data": { "items": [ /* ... */ ], "pagination": { "total": 42, "page": 1, "size": 20, "totalPages": 3 } } }

// error
{ "success": false, "message": "Appointment not found", "errors": { "statusCode": 404, "errorCode": "NOT_FOUND", "details": { /* opcional */ } } }
```

Tipos en `common/types/response.ts` (`ApiResponse<T>`, `ApiResponseError`, `ApiResponseMeta`). El frontend consume exactamente este contrato (ver doc de frontend).

---

## 7. Validación (request)

Dos piezas que trabajan juntas:

1. **`validateSchema(requestSchema)`** (middleware): hace `safeParse` de `params`, `query` y `body` contra los schemas Zod. En éxito, deja los datos limpios en `req.validatedParams` / `req.validatedQuery` / `req.validatedBody`. En fallo, acumula los issues en `details` (por path) y lanza un `ApiError` 400 `VALIDATION_ERROR`. Claves desconocidas se reportan como `unrecognizedKeys`/`unrecognizedQueryKeys`.
   - Tiene una capa de tenancy: si el rol **no** es superadmin y el body trae `clinicId`, lo *omite* del schema (el `clinicId` lo inyecta el backend desde el tenant, no el cliente).

2. **`validateRequest(req)`** (helper en el controller): expone getters tipados `.body` / `.query` / `.params` que devuelven los datos validados (o lanzan 500 si faltan, lo cual sería un bug de cableado).

`TypedRequest<T>` (en `common/types/requests.ts`) une el `Request` de Express con los tipos inferidos de los schemas, dando type-safety de punta a punta sin castings.

---

## 8. Multi-tenancy, autenticación y autorización

### Cadena `protect`

`protect = [authMiddleware, tenantMiddleware]`. Se aplica con `router.use(protect)` en cada router que requiere sesión.

- **`authMiddleware`**: extrae el Bearer token, lo verifica (`verifyAccessToken`), carga el usuario activo desde el repo y rellena `req.user = { token: payload, clinicId }`. Lanza 401 si falta/expira/es inválido.
- **`tenantMiddleware`**: si el usuario es superadmin → `req.tenantId = null` (acceso global). Si no, valida que el `tenantId` del token coincida con el `clinicId` del worker y que la clínica exista; rellena `req.tenantId`. Lanza 403 ante mismatch.

### Autorización: `guardMiddleware`

`guardMiddleware([PERMISSIONS.X, ...])` se coloca por ruta. Deja pasar a superadmin siempre; para el resto exige que el token contenga **todas** las permissions requeridas. Existe también `roleGuardMiddleware([ROLES...])`.

Los **permisos y roles viven en el paquete compartido `@repo/guards`** (`PERMISSIONS`, `ROLES`, `isSuperAdmin`, matrices rol→permisos). El backend y el frontend importan el **mismo** catálogo, garantizando que un permiso usado en una ruta exista también en el cliente.

### Regla de oro de tenancy

El `clinicId` que entra por el body de un no-superadmin se ignora; el backend usa el `tenantId` del token. El service recibe el `tenantId` resuelto y lo aplica en cada query. Nunca confiar en un `clinicId` provisto por el cliente para scoping.

---

## 9. Base de datos (Drizzle)

- Una tabla por archivo en `core/db/schema/`, reexportadas en `schema/index.ts`. El cliente `db` se crea con ese schema.
- Cada tabla exporta sus tipos: `XSelect = typeof x.$inferSelect`, `XInsert = typeof x.$inferInsert`, `XUpdate = Partial<Omit<XInsert, 'id' | 'createdAt'>>`.
- **Campos estándar** en tablas de dominio:
  - `id: uuid().primaryKey().defaultRandom()`
  - `clinicId` (FK al tenant) cuando aplica, con `onDelete` apropiado (`restrict`/`cascade`/`set null`).
  - `isActive: boolean().default(true).notNull()` (soft delete)
  - `createdAt` / `updatedAt: timestamp({ withTimezone: true }).defaultNow().notNull()`, con `updatedAt.$onUpdate(() => new Date())`.
  - Campos de auditoría cuando aplica (`createdBy`, `cancelledBy`...), `version` para optimistic locking.
  - Índices explícitos sobre FKs y columnas de filtrado frecuente.
- Migraciones con `drizzle-kit` (`db:generate`, `db:migrate`, `db:push`). Seeds en `core/db/seeds`.
- **Transacciones** vía `ITransactionManager` inyectado (no usar `db.transaction` directamente en services para mantener testabilidad).

### Comandos de DB (package.json)

```
db:generate   genera migraciones desde el schema
db:migrate    aplica migraciones
db:push       sincroniza schema (dev)
db:seed       siembra datos
db:fresh      reset + push + permissions + roles + seed
```

---

## 10. Paginación

- Query params estándar: `page`, `limit` (con alias `pageSize`). Se validan extendiendo `paginationQuerySchema`.
- El repository devuelve `{ data, total }`.
- El service envuelve con `paginatedResult(data, total, { page, limit })` → `{ items, pagination: { total, page, size, totalPages } }`.
- El controller serializa `items` con el resource de colección y responde con `this.ok`.

---

## 11. Convenciones de nombres

| Elemento | Convención | Ejemplo |
| --- | --- | --- |
| Archivos de módulo | `<module>.<capa>.ts` en kebab/lowerCamel del dominio | `appointments.service.ts` |
| Clases | PascalCase + sufijo de capa | `AppointmentsService`, `AppointmentsRepository` |
| Singletons en container | camelCase | `appointmentsService` |
| Schemas Zod | `<accion><Entidad>Schema` | `createAppointmentSchema` |
| Request schemas | `<accion><Entidad>RequestSchema` | `updateAppointmentRequestSchema` |
| DTOs | `<Accion><Entidad>DTO` (vía `z.infer`) | `CreateAppointmentDTO` |
| Typed requests | `<Accion><Entidad>Request` | `CreateAppointmentRequest` |
| Resources | `<entidad>Resource`, `<entidad>CollectionResource` | `appointmentResource` |
| Tablas DB | plural snake_case | `appointment_statuses` |
| Tipos DB | `<Entidad>Select/Insert/Update` | `AppointmentSelect` |
| Error codes | UPPER_SNAKE agrupados por dominio | `ErrorCodes.system.NOT_FOUND` |
| Endpoints | REST, recurso en plural | `GET /api/v1/appointments/:id` |

Idioma: **código, identificadores y mensajes de error en inglés**. La traducción a idioma de usuario ocurre en el frontend vía los `errorCode`.

---

## 12. Receta — Cómo añadir un módulo nuevo (checklist para IA)

Para un recurso nuevo `widgets`:

1. **DB**: crear `core/db/schema/widgets.ts` (tabla + tipos `WidgetSelect/Insert/Update`, campos estándar `id/clinicId/isActive/createdAt/updatedAt`, índices). Reexportar en `schema/index.ts`. Generar migración (`db:generate`).
2. **Schema**: crear `modules/widgets/widgets.schema.ts` con input base `.strict()`, `create/update` schemas, request schemas (`{ body }`/`{ params }`/`{ query }`), DTOs (`z.infer`) y typed requests (`TypedRequest<...>`).
3. **Resource**: crear `widgets.resource.ts` con `widgetResource` (+ colección, + relaciones si hay joins). Formatear fechas con `formatDate`.
4. **Repository**: crear `widgets.repository.ts` (constructor `db`), con `applyFilters` (incluye `clinicId` y `isActive` por defecto), `findOne`, `findAll` (`{ data, total }`), `create`, `update`, `delete` (soft).
5. **Service**: crear `widgets.service.ts` (POJO, repos por constructor). Métodos que reciben `clinicId` explícito, aplican reglas de negocio y lanzan `ApiError` con códigos del catálogo. Usar `paginatedResult` en listados.
6. **Controller**: crear `widgets.controller.ts`, `@CatchAsync` + `extends BaseController`. Usar `validateRequest(req)`, `this.resolveTenantId(req.tenantId)`, serializar con el resource y responder con helpers.
7. **Routes**: crear `widgets.routes.ts` (`router.use(protect)`, cada ruta con `guardMiddleware([PERMISSIONS.X])` + `validateSchema(schema)` + método del controller).
8. **Container**: registrar en `bootstrap/container.ts` en orden (repo → service → controller).
9. **Montaje**: añadir `v1Router.use('/widgets', widgetsRoutes)` en `routes/v1/index.ts`.
10. **Permisos**: si introduce permisos nuevos, añadirlos en `@repo/guards` y a las matrices rol→permiso; correr `db:permissions` / `db:roles`.

Si sigues estos 10 pasos respetando las responsabilidades de cada capa, el módulo será indistinguible de los existentes.

---

## 13. Anti-patrones (qué NO hacer)

- ❌ Acceder a la DB desde un controller o un service sin pasar por el repository.
- ❌ Poner reglas de negocio en el repository o en el resource.
- ❌ Construir respuestas de error a mano con `res.status().json()`; siempre `throw new ApiError(...)`.
- ❌ Escribir tipos de DTO a mano en vez de `z.infer`.
- ❌ Confiar en el `clinicId` del body para scoping de un no-superadmin.
- ❌ Devolver filas crudas de Drizzle al cliente (siempre pasar por un resource).
- ❌ Instanciar repos/services con `new` fuera del container.
- ❌ Usar rutas relativas profundas en vez de los path aliases.
- ❌ `try/catch` en controllers para errores de negocio (rompe el patrón `@CatchAsync`).
