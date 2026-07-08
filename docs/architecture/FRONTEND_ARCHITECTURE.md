# Especificación de Arquitectura — Frontend (Web)

> **Propósito de este documento**
> Es una *especificación de arquitectura orientada a IA* (Spec-Driven Development). Describe **cómo está construido** este frontend y, sobre todo, **las reglas que un agente de IA debe seguir** para añadir o modificar código de forma consistente — o para reproducir esta misma arquitectura en un proyecto nuevo.
>
> No es un README de "cómo correr el proyecto". Es el contrato de cómo se escribe el código.
>
> Implementación de referencia: panel de administración SaaS multi-tenant para clínicas dentales. Cualquier ejemplo concreto (`branches`, `appointments`, `auth`) es ilustrativo; el patrón es lo que importa. Este frontend consume la API descrita en `BACKEND_ARCHITECTURE.md` y **comparte su contrato de respuesta y su catálogo de permisos**.

---

## 1. Stack y principios

| Capa | Tecnología |
| --- | --- |
| Framework | **Next.js 16** (App Router, `--turbopack`) |
| UI runtime | **React 19** |
| Estado de servidor | **TanStack Query v5** (`@tanstack/react-query`) |
| Estado de cliente | **Zustand v5** (con `persist`) |
| HTTP | **Axios** (instancias con interceptores) |
| Formularios | **React Hook Form** + `@hookform/resolvers` + **Zod 4** |
| Tablas | **TanStack Table v8** |
| i18n | **i18next** + **react-i18next** (namespaces) |
| Estilos | **Tailwind CSS v4** |
| Componentes | **shadcn/ui** vía paquete compartido **`@repo/ui`** |
| Iconos | `lucide-react` |
| Calendario | `react-big-calendar` + `date-fns` |
| Monorepo | **Turborepo** + **pnpm workspaces** |

### Principios no negociables

1. **Feature-Sliced.** El código de dominio vive en `src/features/<feature>/`. Cada feature es autónoma y expone su API pública por un barrel `index.ts`. Las páginas del App Router son *thin*: solo importan y renderizan el componente índice de la feature.
2. **Separación estricta de capas dentro de la feature:** `service` (HTTP) → `hooks` (React Query / RHF / acciones) → `components` (UI). Un componente **nunca** llama a axios directamente ni construye query keys a mano.
3. **Estado de servidor ≠ estado de cliente.** Datos que vienen de la API → **TanStack Query**. Estado de UI/sesión/config global → **Zustand**. No se mezclan (no se cachea data de servidor en Zustand salvo config puntual de arranque).
4. **Zod como fuente de verdad de formularios**, resuelto con `zodResolver`. Los tipos de formulario se derivan (`z.input`/`z.output`), no se escriben a mano.
5. **Errores de API centralizados.** Toda respuesta de error se normaliza a `ApiError` y se traduce a mensaje i18n mediante su `errorCode` (`useApiErrorParser`). No se leen `error.response.data.message` sueltos por la UI.
6. **Autorización declarativa.** La visibilidad por permisos/roles se expresa con `<Can>` y los hooks `useCan`/`usePermissions`, usando el catálogo compartido `@repo/guards`.
7. **Todo texto visible pasa por i18n.** Nada de strings hardcodeados en la UI; se usan claves de namespace (`useTranslation('admin')`).

---

## 2. Estructura de directorios

```
apps/web/src/
├── app/                        # App Router. Páginas THIN + layouts.
│   ├── layout.tsx              # Root layout → RootLayoutContainer (monta AppProviders)
│   ├── (auth)/                 # Grupo de rutas públicas (login, forgot/reset password)
│   └── admin/                  # Grupo protegido
│       ├── layout.tsx          # AdminLayoutContainer (sidebar/topbar)
│       └── <recurso>/page.tsx  # Página: renderiza el índice de la feature
│
├── features/                   # DOMINIO. Un directorio por feature.
│   └── <feature>/
│       ├── components/         # Componentes de la feature (Page, Table, Dialog, Form, columns)
│       ├── hooks/              # useXQuery (React Query), useXForm (RHF), useXActions
│       ├── schemas/            # Schemas Zod de formularios
│       ├── services/           # Cliente HTTP del recurso (llamadas axios)
│       ├── types.ts            # Tipos del dominio + DTOs de request
│       ├── helpers.ts          # Utilidades puras de la feature
│       └── index.ts            # BARREL: API pública de la feature
│
├── lib/                        # Infraestructura transversal (no dominio)
│   ├── http/                   # api.ts (instancias axios), ApiError.ts, types.ts, useApiErrorParser.ts
│   ├── query/                  # QueryProvider.tsx
│   ├── auth/                   # store, hooks (useAuth/useCan/usePermissions), <Can>, guards, jwt helper
│   ├── config/                 # store de config global (branches, selectedBranch)
│   ├── loader/                 # store del loader global
│   ├── i18n/                   # config, provider, server helpers
│   ├── navigation/             # items del menú, iconos, hooks
│   ├── store/                  # clear-stores.ts (reset de todos los stores)
│   └── env.ts                  # Variables de entorno validadas
│
├── components/                 # Componentes GLOBALES (no de una feature)
│   ├── provider/               # AppProviders, AuthProvider, InitProvider
│   ├── Layouts/                # RootLayoutContainer, AdminLayoutContainer
│   └── shared/                 # PageHeader, DataTable, Sidebar, Topbar, ...
│
├── config/                     # app.config.ts, query.config.ts
└── locales/{es,en}/            # admin.json, common.json, public.json, api.json
```

### Path aliases (tsconfig)

Usar siempre los aliases:

```
@/*             → src/*
@/components/*  → src/components/*
@/features/*    → src/features/*
@/lib/*         → src/lib/*
@/constants/*   → src/constants/*
```

Paquetes del monorepo por nombre: **`@repo/ui`** (componentes), **`@repo/guards`** (permisos/roles).

---

## 3. Anatomía de una feature (el patrón canónico)

Una feature tiene capas con responsabilidades separadas. Este es el corazón del frontend.

| Capa | Archivo(s) | Responsabilidad | Qué NO hace |
| --- | --- | --- | --- |
| **Types** | `types.ts` | Entidad del dominio + DTOs de request (`CreateXDTO`, `UpdateXDTO`, `GetXParams`). | Validación (eso es Zod en `schemas/`). |
| **Service** | `services/<x>.service.ts` | Objeto con métodos que hacen las llamadas HTTP (una por endpoint). Devuelve `response.data` tipado. | Estado, cache, React. |
| **Query hooks** | `hooks/useXQuery.ts` | Factory de query keys + hooks `useQuery`/`useMutation` que envuelven el service. Invalidación de cache. | Renderizar UI, validar formularios. |
| **Form hook** | `hooks/useXForm.ts` | `useForm` + `zodResolver`, `defaultValues`, `onSubmit` (llama a la mutation), manejo de error con `useApiErrorParser` + `toast`. | Llamadas HTTP directas. |
| **Action hook** | `hooks/useXActions.ts` | Handlers de acciones de tabla (editar, desactivar, copiar id...). | — |
| **Components** | `components/*.tsx` | UI. Consumen los hooks. `Page` orquesta; `Table`/`columns`, `Dialog`, `Form`. | axios directo, query keys a mano. |
| **Barrel** | `index.ts` | Exporta la API pública de la feature (componente índice, service, hooks, keys, tipos). | — |

### 3.1 Types (`types.ts`)

```ts
export interface Branch {
  id: string;
  clinicId: string;
  name: string;
  isActive: boolean;
  schedules: BranchSchedule[];
  // ...forma exacta de la entidad tal como la devuelve la API (ver resource del backend)
}

export interface GetBranchesParams { page?: number; limit?: number; name?: string; isActive?: boolean; }
export interface CreateBranchDTO { name: string; address: string; /* ... */ }
export interface UpdateBranchDTO { name?: string; /* ...todo opcional */ }
```

Los tipos de entidad **espejan el `resource` del backend** (el shape público, no la fila de DB).

### 3.2 Service (`services/<x>.service.ts`)

Objeto plano de métodos. Usa la instancia axios adecuada y **devuelve `response.data`** (el envelope `ApiResponse<T>`).

```ts
import { PROTECTED_API } from '@/lib/http/api';
import type { ApiResponse, PaginatedResponse } from '@/lib/http/types';
import type { Branch, GetBranchesParams, CreateBranchDTO, UpdateBranchDTO } from '../types';

export const branchesService = {
  getAll:  (params?: GetBranchesParams) =>
    PROTECTED_API.get<PaginatedResponse<Branch>>('/branches', { params }).then((r) => r.data),
  getById: (id: string) =>
    PROTECTED_API.get<ApiResponse<Branch>>(`/branches/${id}`).then((r) => r.data),
  create:  (data: CreateBranchDTO) =>
    PROTECTED_API.post<ApiResponse<Branch>>('/branches', data).then((r) => r.data),
  update:  (id: string, data: UpdateBranchDTO) =>
    PROTECTED_API.patch<ApiResponse<Branch>>(`/branches/${id}`, data).then((r) => r.data),
  delete:  (id: string) => PROTECTED_API.delete(`/branches/${id}`),
};
```

Reglas del service:
- Tipar la respuesta con `ApiResponse<T>` o `PaginatedResponse<T>` (contrato del backend, ver §5).
- No manejar errores aquí: se dejan propagar para que los interceptores/React Query/`ApiError` los traten.
- Un método = un endpoint. Sin lógica.

### 3.3 Query hooks (`hooks/useXQuery.ts`)

Toda interacción con el service pasa por React Query. **Factory de query keys** obligatoria por feature.

```ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { branchesService } from '@/features/branches/services/branches.service';

export const BRANCH_KEYS = {
  all: ['branches'] as const,
  lists: () => [...BRANCH_KEYS.all, 'list'] as const,
  list: (params?: GetBranchesParams) => [...BRANCH_KEYS.lists(), params] as const,
  detail: (id: string) => [...BRANCH_KEYS.all, id] as const,
};

export function useBranchesQuery(params?: GetBranchesParams) {
  return useQuery({ queryKey: BRANCH_KEYS.list(params), queryFn: () => branchesService.getAll(params) });
}

export function useQueryBranch(id: string) {
  return useQuery({ queryKey: BRANCH_KEYS.detail(id), queryFn: () => branchesService.getById(id), enabled: !!id });
}

export function useMutationCreateBranch() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateBranchDTO) => branchesService.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: BRANCH_KEYS.lists() }),
  });
}

export function useMutationUpdateBranch() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBranchDTO }) => branchesService.update(id, data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: BRANCH_KEYS.lists() });
      qc.invalidateQueries({ queryKey: BRANCH_KEYS.detail(id) });
    },
  });
}
```

Convenciones de query:
- Nombres: `useXQuery` / `useQueryX` (lecturas), `useMutationCreateX` / `useMutationUpdateX` / `useMutationDeleteX` (escrituras).
- Query keys **siempre** desde el factory `X_KEYS`, jerárquico (`all → lists → list(params)` / `detail(id)`). Nunca arrays a mano.
- Tras mutar, **invalidar** las keys afectadas en `onSuccess` (listas y detalle).
- Queries dependientes de un id → `enabled: !!id`.

### 3.4 Form hook (`hooks/useXForm.ts`) + schema

El formulario es un hook que combina RHF + Zod + la mutation + manejo de error i18n.

```ts
// schemas/branch.schema.ts — mensajes de validación son CLAVES i18n, no texto
export const createBranchSchema = z.object({
  name: z.string().min(2, 'branch.validation.nameMin').max(100),
  email: z.union([z.literal(''), z.email('branch.validation.invalidEmail')]).optional(),
  schedules: z.array(scheduleInputSchema).optional(),
}).transform((data) => ({ /* normalización antes de enviar */ }));

export type CreateBranchFormInput = z.input<typeof createBranchSchema>;   // lo que maneja el form
export type CreateBranchSchema    = z.output<typeof createBranchSchema>;  // lo que sale del resolver
```

```ts
// hooks/useBranchForm.ts
export function useBranchForm({ initialData, onSuccess }: UseBranchFormProps = {}) {
  const { t } = useTranslation('admin');
  const parseError = useApiErrorParser();
  const createBranch = useMutationCreateBranch();
  const updateBranch = useMutationUpdateBranch();
  const isEditing = !!initialData;

  const form = useForm<CreateBranchFormInput, unknown, CreateBranchSchema>({
    resolver: zodResolver(createBranchSchema),
    defaultValues: { name: initialData?.name ?? '', /* ... */ },
  });

  const onSubmit = async (data: CreateBranchSchema) => {
    try {
      if (isEditing) {
        await updateBranch.mutateAsync({ id: initialData!.id, data });
        toast.success(t('branch.edit.success'));
      } else {
        await createBranch.mutateAsync(data);
        toast.success(t('branch.create.success'));
      }
      form.reset();
      onSuccess?.();
    } catch (e) {
      parseError(e, (message) => { form.setError('root', { message }); toast.error(message); });
    }
  };

  return { form, onSubmit: form.handleSubmit(onSubmit), isSubmitting: form.formState.isSubmitting, isEditing, t };
}
```

Reglas del form hook:
- Un mismo hook cubre **crear y editar** (discrimina por `initialData`).
- El resolver es `zodResolver(schema)`; los tipos genéricos de `useForm` usan `z.input` (entrada) y `z.output` (salida).
- Los mensajes de validación del schema son **claves i18n** que se traducen al renderizar el error.
- El error de submit se procesa con `useApiErrorParser` → `form.setError('root', ...)` + `toast.error(...)`.
- El componente `Form` solo consume `{ form, onSubmit, isSubmitting }`; no conoce las mutations.

### 3.5 Components

Jerarquía típica de una feature CRUD:

- **`XPage` / `XPageIndex`** (`'use client'`): orquesta. Renderiza `PageHeader`, la tabla y los diálogos; maneja estado local de "qué diálogo está abierto" y "qué fila se edita".
- **`XTable` + `columns.tsx`**: usa TanStack Table sobre el `DataTable` compartido; consume `useXQuery`.
- **`CreateXDialog` / `EditXDialog`**: envuelven `XForm` en un diálogo de `@repo/ui`.
- **`XForm`**: campos RHF; recibe el retorno de `useXForm`.

```tsx
export function BranchesPageIndex() {
  const { t } = useTranslation('admin');
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<Branch | null>(null);

  return (
    <div>
      <PageHeader title={t('branch.index.title')} actionLabel={t('branch.index.add')}
                  onActionClick={() => setCreateOpen(true)} />
      <BranchesTable onEdit={setEditing} />
      <CreateBranchDialog open={isCreateOpen} onOpenChange={setCreateOpen} />
      <EditBranchDialog branch={editing} open={!!editing} onOpenChange={(o) => !o && setEditing(null)} />
    </div>
  );
}
```

### 3.6 Barrel (`index.ts`)

La única superficie pública de la feature. Las páginas y otras features importan **de aquí**, no de rutas internas.

```ts
export { BranchesPageIndex } from './components/BranchesPage';
export { branchesService } from './services/branches.service';
export { useBranchesQuery, useMutationCreateBranch, BRANCH_KEYS } from './hooks/useBranchesQuery';
export type { Branch, CreateBranchDTO, UpdateBranchDTO } from './types';
```

---

## 4. App Router: páginas thin + layouts + providers

- **Página** = adaptador de ruta. Solo renderiza el índice de la feature:
  ```tsx
  // app/admin/branches/page.tsx
  import { BranchesPageIndex } from '@/features/branches';
  export default function BranchesPage() { return <BranchesPageIndex />; }
  ```
- **Layouts** delegan en contenedores de `components/Layouts`:
  - `app/layout.tsx` → `RootLayoutContainer` (monta `AppProviders`, fuentes, `<html>`).
  - `app/admin/layout.tsx` → `AdminLayoutContainer` (sidebar + topbar del panel).
- **Grupos de ruta**: `(auth)` para páginas públicas, `admin/` para el panel protegido.

### Composición de providers (`components/provider/AppProviders.tsx`)

Orden **exacto** (de fuera hacia dentro), porque hay dependencias entre ellos:

```
TranslationsProvider          # i18n disponible para todo
└── AuthProvider              # hidrata/valida sesión; bloquea con loader hasta resolver
    └── QueryProvider         # QueryClient (staleTime/retry desde config/query.config)
        └── InitProvider      # carga config inicial (ej. branches del tenant) tras autenticar
            └── {children}
+ <WrapperLoader/> + <Toaster/>   # globales
```

- **`AuthProvider`**: al montar, decide si hidratar la sesión (flag `DISABLE_REFRESH_ON_RELOAD`), redirige a `/login` si la ruta es protegida y no hay sesión, y marca `isHydrated`. Muestra un loader mientras inicializa.
- **`InitProvider`**: tras autenticar (y si no es superadmin), precarga config global del tenant (ej. sucursales) en el `configStore`.

---

## 5. Capa HTTP (`lib/http`)

### Instancias axios (`api.ts`)

Tres clientes con distinto propósito:

| Instancia | Uso | Detalle |
| --- | --- | --- |
| `PUBLIC_API` | Endpoints sin sesión (login inicial, forgot/reset password). | Sin token. |
| `PROTECTED_API` | Endpoints autenticados (la mayoría). | Interceptor **request** inyecta `Authorization: Bearer <accessToken>` desde `useAuthStore`. Interceptor **response** maneja refresh en 401. |
| `SECURE_API` | Flujo de auth basado en cookie httpOnly (login/logout/refresh). | `withCredentials: true`. |

### Refresh de token (interceptor de `PROTECTED_API`)

Ante un `401` no reintentado:
1. Marca `_retry` y activa `isRefreshing`.
2. Llama `authService.refreshToken()`, guarda el nuevo token (`useAuthStore.setAuth`) y reintenta la request original.
3. Requests concurrentes durante el refresh se **encolan** (`failedQueue`) y se resuelven con el nuevo token.
4. Si el refresh falla: `clearAuth()` y redirección a `/login`.

### `ApiError` + tipos (`ApiError.ts`, `types.ts`)

- `ApiError.from(error)` normaliza cualquier error de axios al shape `{ message, errorCode, statusCode, details }` leyendo el envelope del backend (`errors.errorCode`, etc.).
- Contrato de respuesta (espejo del backend):
  ```ts
  interface ApiResponse<T> { success: boolean; message: string; data: T; }
  interface PaginatedData<T> { items: T[]; pagination: { total; page; size; totalPages }; }
  type PaginatedResponse<T> = ApiResponse<PaginatedData<T>>;
  ```

### `useApiErrorParser`

Traduce un error a mensaje localizado usando su `errorCode` contra el namespace `api`:

```ts
const parseError = useApiErrorParser();
parseError(e, (message) => { form.setError('root', { message }); toast.error(message); });
// internamente: tApi(`errors.${err.errorCode}`, tApi('errors.generic'))
```

> **Contrato clave con el backend:** los `errorCode` que el backend define en `ErrorCodes` deben existir como claves en `locales/*/api.json` bajo `errors.<CODE>`. Así cada error del servidor se muestra traducido sin lógica ad-hoc en la UI.

---

## 6. Estado de servidor (TanStack Query)

- `QueryProvider` crea el `QueryClient` con defaults de `config/query.config.ts` (`staleTime: 60s`, `retry: 1`).
- **Regla:** ninguna data de servidor se guarda en Zustand (excepto config de arranque puntual). El caché es React Query.
- Query keys jerárquicas por feature (§3.3). Invalidación explícita en las mutations.

## 7. Estado de cliente (Zustand)

Stores en `lib/*/store/`. Patrón: `create(persist((set) => ({...}), { name, storage, partialize }))`.

| Store | Contenido | Persistencia |
| --- | --- | --- |
| `useAuthStore` (`lib/auth/store`) | `accessToken`, `session`, `isAuthenticated`, `isHydrated` + acciones `setAuth`/`setSession`/`clearAuth`/`setHydrated`. | `localStorage` (`auth-storage`) |
| `useConfigStore` (`lib/config/store`) | `branches`, `selectedBranch` (config del tenant). | `localStorage` (`config-storage`) |
| `useLoaderStore` (`lib/loader/store`) | estado del loader global. | — |

- `setSession` decodifica el JWT (`decodeAccessToken`) para extraer `permissions`/`tenantId` y los fusiona con el perfil `MeProfile`.
- **`clearAllStores()`** (`lib/store/clear-stores.ts`) resetea todos los stores; se llama en logout y ante fallos de auth.
- Fuera de componentes React, se accede con `useXStore.getState()` (ej. en interceptores y providers).

---

## 8. Autenticación y autorización

### Sesión

- **`useAuth()`** (`lib/auth/hook`): expone `signIn`, `signOut`, `initAuth`.
  - `signIn`: `authService.login` → set cookie `auth-session` → `setAuth` → `getMe` → `setSession` → `setHydrated(true)`.
  - `signOut`: `authService.logout` → borra cookie → `clearAllStores`.
- El middleware de Next / guards (`lib/auth/navigation.ts`, `middleware.guards.ts`) definen `AUTH_ROUTES`, `PROTECTED_ROUTES` y las redirecciones (`shouldRedirectToLogin` / `shouldRedirectToHome`).

### Autorización declarativa

Catálogo compartido en **`@repo/guards`** (`PERMISSIONS`, `ROLES`, tipos `PermissionType`/`RoleType`). Es el **mismo** paquete que usa el backend en `guardMiddleware`, garantizando coherencia.

- **`usePermissions()`**: deriva `{ roles, permissions, isSuperadmin, isLoading }` del `session` del store.
- **`useCan()`**: `can(perms)`, `canAll(perms)`, `hasRole(roles)`, `canWithRole(perms, roles)`. Superadmin siempre pasa; mientras `isLoading`, deniega.
- **`<Can>`** (componente): renderiza children solo si hay acceso; si no, `fallback`.
  ```tsx
  <Can allowed={[PERMISSIONS.CREATE_BRANCH]} fallback={null}>
    <Button onClick={openCreate}>{t('branch.index.add')}</Button>
  </Can>
  ```

---

## 9. Internacionalización (i18n)

- Config en `lib/i18n/config.ts`: `locales: ['es','en']`, `defaultLocale: 'es'`, namespaces `['common','public','admin','api']`, cookie `NEXT_LOCALE`.
- Recursos en `locales/{es,en}/<namespace>.json`.
- En cliente: `const { t } = useTranslation('admin')`. **Todo** texto visible usa `t('clave')`.
- **Convenciones de claves:**
  - Validaciones de formulario: `<feature>.validation.<regla>` (referenciadas desde los schemas Zod).
  - Errores de API: `errors.<ERROR_CODE>` en el namespace `api` (mapeo directo con `ErrorCodes` del backend).
  - UI de una feature: `<feature>.<seccion>.<clave>` (ej. `branch.index.title`).

---

## 10. UI compartida (`@repo/ui`)

- Los componentes base (Button, Input, Dialog, Table, Select, Calendar, `toast`/`Toaster`, `FormField`, `cn`, ...) viven en el paquete `@repo/ui` (shadcn + Tailwind v4) y se importan por nombre: `import { Button, Dialog, toast, cn } from '@repo/ui'`.
- **No** duplicar primitivas de UI en `apps/web`; si falta una, se añade a `packages/ui` y se reexporta en su `index.ts`.
- Componentes **globales de la app** (no primitivas) viven en `components/shared/` (`PageHeader`, `DataTable`, `Sidebar`, `Topbar`, ...).

---

## 11. Convenciones de nombres

| Elemento | Convención | Ejemplo |
| --- | --- | --- |
| Feature dir | kebab/lowerCamel del dominio, plural | `features/branches/` |
| Service | `<recurso>Service` (objeto) | `branchesService` |
| Query keys | `<RECURSO>_KEYS` (factory) | `BRANCH_KEYS` |
| Query hook | `useXQuery` / `useQueryX` | `useBranchesQuery` |
| Mutation hook | `useMutation<Accion>X` | `useMutationCreateBranch` |
| Form hook | `useXForm` | `useBranchForm` |
| Actions hook | `useXActions` | `useBranchesActions` |
| Schema | `<accion>XSchema` | `createBranchSchema` |
| Form types | `CreateXFormInput` (input) / `CreateXSchema` (output) | vía `z.input`/`z.output` |
| DTO | `CreateXDTO` / `UpdateXDTO` | en `types.ts` |
| Componente Page | `XPage` / `XPageIndex` | `BranchesPageIndex` |
| Stores | `useXStore` | `useAuthStore` |

---

## 12. Receta — Cómo añadir una feature nueva (checklist para IA)

Para un recurso nuevo `widgets`:

1. **Carpeta**: crear `features/widgets/` con subcarpetas `components/`, `hooks/`, `schemas/`, `services/`.
2. **Types** (`types.ts`): `Widget` (espeja el resource del backend), `GetWidgetsParams`, `CreateWidgetDTO`, `UpdateWidgetDTO`.
3. **Service** (`services/widgets.service.ts`): objeto con `getAll/getById/create/update/delete` usando `PROTECTED_API`, tipado con `ApiResponse<T>` / `PaginatedResponse<T>`.
4. **Query hooks** (`hooks/useWidgetsQuery.ts`): `WIDGET_KEYS` (factory) + `useWidgetsQuery`, `useQueryWidget`, `useMutationCreate/Update/DeleteWidget` con invalidación en `onSuccess`.
5. **Schema** (`schemas/widget.schema.ts`): `createWidgetSchema` con mensajes = claves i18n; exportar `WidgetFormInput`/`WidgetSchema` (`z.input`/`z.output`).
6. **Form hook** (`hooks/useWidgetForm.ts`): `useForm` + `zodResolver`, cubre crear/editar, `onSubmit` con `mutateAsync` + `toast` + `useApiErrorParser`.
7. **Components**: `WidgetsPage` (orquesta), `WidgetsTable` + `columns`, `CreateWidgetDialog`, `EditWidgetDialog`, `WidgetForm`. Textos con `useTranslation`.
8. **Barrel** (`index.ts`): exportar `WidgetsPageIndex`, `widgetsService`, hooks, `WIDGET_KEYS`, tipos.
9. **Página**: `app/admin/widgets/page.tsx` → `import { WidgetsPageIndex } from '@/features/widgets'`.
10. **i18n**: añadir claves `widget.*` en `locales/{es,en}/admin.json` (y `errors.*` en `api.json` si el backend define nuevos códigos).
11. **Navegación / permisos**: añadir el ítem de menú (`lib/navigation`) protegido con `<Can>`/`useCan` usando `PERMISSIONS` de `@repo/guards`.

Siguiendo estos pasos, la feature será indistinguible de las existentes.

---

## 13. Anti-patrones (qué NO hacer)

- ❌ Llamar a `axios`/`fetch` directamente desde un componente (siempre service → hook).
- ❌ Construir query keys a mano en vez de usar el factory `X_KEYS`.
- ❌ Guardar data de servidor en Zustand (usa React Query); mezclar ambos estados.
- ❌ Leer `error.response.data.message` en la UI en vez de `ApiError` + `useApiErrorParser`.
- ❌ Hardcodear texto visible en vez de `t('clave')`.
- ❌ Escribir tipos de formulario a mano en vez de `z.input`/`z.output`.
- ❌ Meter lógica pesada (fetch, mutations) en la página del App Router; debe ser thin.
- ❌ Importar desde rutas internas de otra feature en vez de su barrel `index.ts`.
- ❌ Chequear permisos con condicionales ad-hoc en vez de `<Can>`/`useCan` + `@repo/guards`.
- ❌ Duplicar primitivas de UI en `apps/web` en vez de usar/extender `@repo/ui`.
