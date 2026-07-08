# Especificaciones de Arquitectura (Spec-Driven Development)

Esta carpeta contiene las especificaciones de arquitectura del proyecto, escritas para que **un agente de IA pueda entenderlas y aplicarlas** — tanto para mantener este código como para replicar la arquitectura en un proyecto nuevo.

| Documento | Alcance |
| --- | --- |
| [`BACKEND_ARCHITECTURE.md`](./BACKEND_ARCHITECTURE.md) | API **de este repo**: Express 5 + Drizzle + Zod (REST). Arquitectura en capas, módulos, DI, errores, multi-tenancy, DB. |
| [`FRONTEND_ARCHITECTURE.md`](./FRONTEND_ARCHITECTURE.md) | Web **de este repo**: Next.js 16 + React Query + Zustand + RHF/Zod (axios/REST). Feature-slicing, capa HTTP, auth, i18n. |
| [`MONOREPO_BOILERPLATE.md`](./MONOREPO_BOILERPLATE.md) | Spec ejecutable para que un **agente inicialice un monorepo boilerplate nuevo**: Turborepo + pnpm, Express+**tRPC**+Drizzle, Next+tRPC+RQ+Zustand+RHF+Table, shadcn (`@repo/ui`), **Better Auth**, Zod compartido (`@repo/schemas`). Single-tenant, por capas, con Docker Postgres + env Zod + i18n. |

> Nota: `BACKEND/FRONTEND_ARCHITECTURE` documentan el stack **actual** (REST + JWT propio). `MONOREPO_BOILERPLATE` describe el stack **objetivo del boilerplate nuevo** (tRPC + Better Auth). Comparten los principios (capas, feature-slicing, Zod como fuente de verdad, monorepo con paquetes compartidos), pero difieren en transporte (REST vs tRPC) y auth (JWT propio vs Better Auth).

## Cómo usarlos

- **Para trabajar en este repo:** son el contrato de cómo se escribe el código. Cada doc termina con una *receta paso a paso* para añadir un módulo (BE) / feature (FE) y una lista de anti-patrones.
- **Para un proyecto nuevo:** dale al agente el documento correspondiente como especificación base. Las secciones "principios", "anatomía", "convenciones de nombres" y "receta" son generalizables; los ejemplos concretos (`branches`, `appointments`) son solo ilustrativos del patrón.
- **Contrato compartido BE↔FE:** ambos lados comparten el catálogo de permisos (`@repo/guards`), el envelope de respuesta (`ApiResponse`) y el mapeo de `errorCode` → clave i18n. Al cambiar uno, revisar el otro.
