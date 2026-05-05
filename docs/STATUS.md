# DentSass — Estado de Implementación del Sistema

> Versión 1.1 · Mayo 2026  
> Leyenda: ✅ Completo · 🔶 Parcial · ❌ Faltante

## Decisiones técnicas adoptadas

| Área | Decisión |
| --- | --- |
| Calendario de citas | `react-big-calendar` + `date-fns` (ya instalado). shadcn `Calendar` para date pickers en formularios. |
| Servicios por sucursal | Disponibilidad implícita (sin registro = disponible en todas). `branch_services` solo para `priceOverride` o `isActive: false`. Se agrega `isActive`. |

---

## Índice

1. [Resumen Ejecutivo](#1-resumen-ejecutivo)
2. [Estado por Capa Técnica](#2-estado-por-capa-técnica)
   - 2.1 [Backend (API)](#21-backend-api)
   - 2.2 [Frontend (Web)](#22-frontend-web)
3. [Estado por Módulo Funcional](#3-estado-por-módulo-funcional)
4. [Estado por Rol](#4-estado-por-rol)
   - 4.1 [Superadmin](#41-superadmin)
   - 4.2 [Admin](#42-admin)
   - 4.3 [Doctor](#43-doctor)
   - 4.4 [Recepcionista](#44-recepcionista)
5. [Prioridades de Desarrollo](#5-prioridades-de-desarrollo)

---

## 1. Resumen Ejecutivo

| Área | Backend | Frontend |
|------|:-------:|:--------:|
| Autenticación | ✅ | ✅ |
| Gestión de usuarios | ✅ | ✅ |
| Gestión de clínicas | ✅ | ❌ |
| Gestión de sucursales | 🔶 | ✅ |
| Gestión de trabajadores | 🔶 | ❌ |
| Calendarios / horarios | 🔶 | ❌ |
| Gestión de pacientes | ✅ | ✅ |
| Gestión de servicios | 🔶 | ✅ |
| Gestión de citas | 🔶 | ❌ |
| Invitaciones | 🔶 | ❌ |
| Roles y permisos | 🔶 | ❌ |
| Notificaciones | 🔶 | ❌ |
| Recordatorios automáticos | ❌ | ❌ |
| Agenda Maestra | ❌ | ❌ |

---

## 2. Estado por Capa Técnica

---

### 2.1 Backend (API)

#### Infraestructura Base

| Elemento | Estado | Notas |
|----------|:------:|-------|
| Servidor Express + TypeScript | ✅ | Express 5.2, TS 5.9 |
| PostgreSQL + Drizzle ORM | ✅ | Migrations y schema definidos |
| JWT (access + refresh tokens) | ✅ | Incluye sesiones en BD |
| Rate limiting en auth | ✅ | Login, forgot-password, refresh |
| Validación con Zod | ✅ | Schemas en cada módulo |
| Swagger/OpenAPI docs | ✅ | `/docs` endpoint |
| Middleware de autenticación | ✅ | Verifica JWT |
| Middleware de autorización (RBAC) | 🔶 | Verifica permisos, **falta validación de tenant en BD** |
| Guards package (`@repo/guards`) | 🔶 | Permisos definidos, falta validar tenant activo y pertenencia |
| Manejo de errores global | ✅ | Middleware centralizado |
| Sistema de jobs/cron | ❌ | Carpeta `jobs/` vacía — sin implementación |
| WebSockets / canales real-time | ❌ | Carpeta `channels/` vacía |
| Envío de emails | ❌ | Templates en BD, sin proveedor integrado |
| Envío de WhatsApp | ❌ | Sin integración |

#### Módulos de API

##### Autenticación (`/api/v1/auth`)

| Endpoint | Estado | Notas |
|----------|:------:|-------|
| `POST /login` | ✅ | |
| `POST /register` | ✅ | |
| `POST /forgot-password` | ✅ | |
| `POST /reset-password` | ✅ | |
| `POST /refresh` | ✅ | |
| `POST /logout` | ✅ | |
| `GET /me` | ✅ | |
| `POST /change-password` | ✅ | |
| `PUT /profile` | ✅ | |

##### Usuarios (`/api/v1/users`) — Solo Superadmin

| Endpoint | Estado | Notas |
|----------|:------:|-------|
| `GET /` | ✅ | |
| `POST /` | ✅ | |
| `GET /:id` | ✅ | |
| `PATCH /:id` | ✅ | |
| `DELETE /:id` | ✅ | Soft delete |

##### Clínicas (`/api/v1/clinics`)

| Endpoint | Estado | Notas |
|----------|:------:|-------|
| `GET /` | ✅ | |
| `POST /` | ✅ | Superadmin |
| `GET /:id` | ✅ | |
| `PATCH /:id` | ✅ | |
| `DELETE /:id` | ✅ | |
| `PATCH /:id/settings` | ❌ | Configuración de recordatorios faltante |

##### Sucursales (`/api/v1/branches`)

| Endpoint | Estado | Notas |
|----------|:------:|-------|
| `GET /` | ✅ | |
| `POST /` | ✅ | |
| `GET /:id` | ✅ | |
| `PATCH /:id` | ✅ | |
| `DELETE /:id` | ✅ | |
| `GET /:id/schedules` | ❌ | Falta endpoint para listar horarios de sucursal |
| `POST /:id/schedules` | ❌ | Falta crear/actualizar horario de sucursal |
| `GET /:id/services` | ❌ | Falta listar servicios por sucursal |

##### Trabajadores (`/api/v1/workers`)

| Endpoint | Estado | Notas |
|----------|:------:|-------|
| `GET /` | ✅ | |
| `POST /` | ✅ | |
| `GET /:id` | ✅ | |
| `PATCH /:id` | ✅ | |
| `DELETE /:id` | ✅ | |
| `GET /:id/schedules` | ❌ | Falta endpoints de calendario del doctor |
| `POST /:id/schedules` | ❌ | Falta crear horario de atención |
| `PATCH /:id/schedules/:scheduleId` | ❌ | |
| `DELETE /:id/schedules/:scheduleId` | ❌ | |
| `GET /:id/schedule-blocks` | ❌ | Falta endpoints de bloqueos |
| `POST /:id/schedule-blocks` | ❌ | |
| `PATCH /:id/schedule-blocks/:blockId` | ❌ | |
| `DELETE /:id/schedule-blocks/:blockId` | ❌ | |
| `GET /:id/availability` | ❌ | Falta endpoint de disponibilidad en tiempo real |

##### Pacientes (`/api/v1/patients`)

| Endpoint | Estado | Notas |
|----------|:------:|-------|
| `GET /` | ✅ | |
| `POST /` | ✅ | |
| `GET /:id` | ✅ | |
| `PATCH /:id` | ✅ | |
| `DELETE /:id` | ✅ | |

##### Servicios (`/api/v1/services`)

| Endpoint | Estado | Notas |
|----------|:------:|-------|
| `GET /` | ✅ | |
| `POST /` | 🔶 | **Falta asignación automática a todas las sucursales** |
| `GET /:id` | ✅ | |
| `PATCH /:id` | ✅ | |
| `DELETE /:id` | ✅ | |
| `GET /:id/branches` | ❌ | Falta listar asignaciones por sucursal |
| `PATCH /:id/branches/:branchId` | ❌ | Falta gestionar precio y disponibilidad por sucursal |

##### Citas (`/api/v1/appointments`)

| Endpoint | Estado | Notas |
|----------|:------:|-------|
| `GET /` | ✅ | |
| `POST /` | 🔶 | **Faltan todas las validaciones de negocio** |
| `GET /:id` | ✅ | |
| `PATCH /:id` | 🔶 | **Faltan validaciones de negocio** |
| `PATCH /:id/cancel` | 🔶 | **Falta registrar cancelledBy, cancelledAt, reason** |
| `DELETE /:id` | ✅ | |
| `GET /:id/timeline` | ❌ | Falta endpoint de línea de tiempo |
| `GET /availability` | ❌ | Falta consulta de disponibilidad para agendar |
| `GET /master-agenda` | ❌ | Falta endpoint de agenda maestra |

**Validaciones de negocio FALTANTES en crear/actualizar cita:**
- ❌ Verificación de `schedule_blocks` del doctor
- ❌ Verificación del horario de trabajo del doctor (`worker_schedules`)
- ❌ Verificación del horario operativo de la sucursal (`branch_schedules`)
- ❌ Verificación de servicio disponible en la sucursal (`branch_services`)
- ❌ Detección de conflictos de cita por traslape de rangos
- ❌ Cálculo automático de `endTime` basado en la duración del servicio

##### Roles (`/api/v1/roles`)

| Endpoint | Estado | Notas |
|----------|:------:|-------|
| `GET /` | ✅ | |
| `POST /` | 🔶 | **Falta proteger roles del sistema** |
| `GET /:id` | ✅ | |
| `PUT /:id` | 🔶 | **Falta bloquear edición de roles del sistema** |
| `DELETE /:id` | 🔶 | **Falta bloquear eliminación de roles del sistema** |
| `GET /:id/permissions` | ❌ | Falta listar permisos de un rol |
| `PATCH /:id/permissions` | ❌ | Falta asignar/quitar permisos a un rol |

##### Invitaciones (`/api/v1/invitations`)

| Endpoint | Estado | Notas |
|----------|:------:|-------|
| `GET /:token` | ✅ | Validar token (público) |
| `POST /:token/accept` | ✅ | Aceptar invitación (público) |
| `POST /` | ✅ | Crear invitación |
| `GET /` | ❌ | **Falta listar invitaciones** |
| `DELETE /:id` | ❌ | **Falta cancelar invitación** |
| Envío de email al crear | ❌ | Sin integración de email |

##### Sesiones (`/api/v1/sessions`) — Solo Superadmin

| Endpoint | Estado | Notas |
|----------|:------:|-------|
| `GET /` | ❌ | No existe módulo de sesiones |
| `DELETE /:id` | ❌ | No existe |

##### Notificaciones

| Endpoint | Estado | Notas |
|----------|:------:|-------|
| CRUD notificaciones | ❌ | Schema en BD, sin endpoints |
| Push notifications | ❌ | Schema en BD, sin endpoints |

---

### 2.2 Frontend (Web)

#### Infraestructura

| Elemento | Estado | Notas |
|----------|:------:|-------|
| Next.js 16 + React 19 + TS | ✅ | |
| TanStack Query (data fetching) | ✅ | |
| Zustand (estado global) | ✅ | |
| React Hook Form + Zod | ✅ | |
| Axios con interceptors JWT | ✅ | |
| i18n (react-i18next) | ✅ | |
| shadcn/ui + Tailwind 4 | ✅ | |
| TanStack Table | ✅ | |
| Routing (Next.js app router) | ✅ | |
| Layout admin con sidebar | ✅ | |
| Componente de cambio de clínica/sucursal | 🔶 | Existe `warehouse-switcher`, pendiente de integración real |
| Manejo de errores global (auth 401) | ✅ | Via Axios interceptors |

#### Páginas y Módulos Frontend

##### Autenticación

| Página/Funcionalidad | Estado | Notas |
|---------------------|:------:|-------|
| Login | ✅ | |
| Forgot password | ✅ | |
| Reset password | ✅ | |
| Register | 🔶 | Existe endpoint, sin página de UI |

##### Dashboard Admin (`/admin`)

| Página/Funcionalidad | Estado | Ruta |
|---------------------|:------:|------|
| Página de inicio/dashboard | ✅ | `/admin` |
| Usuarios (tabla + CRUD) | ✅ | `/admin/users` |
| Pacientes (tabla + CRUD) | ✅ | `/admin/patients` |
| Sucursales (tabla + CRUD) | ✅ | `/admin/branches` |
| Servicios (tabla + CRUD) | ✅ | `/admin/services` |
| Perfil | ✅ | `/admin/profile` |
| Trabajadores | ❌ | `/admin/workers` — **No existe** |
| Clínica (ver/editar propia) | ❌ | `/admin/clinic` — **No existe** |
| Citas (calendario + CRUD) | ❌ | `/admin/appointments` — **No existe** |
| Agenda Maestra | ❌ | `/admin/agenda` — **No existe** |
| Invitaciones | ❌ | `/admin/invitations` — **No existe** |
| Roles y permisos | ❌ | `/admin/roles` — **No existe** |
| Configuración de clínica | ❌ | `/admin/settings` — **No existe** |
| Notificaciones | ❌ | Sin página dedicada |

##### Dashboard Doctor

| Página/Funcionalidad | Estado | Ruta |
|---------------------|:------:|------|
| Vista de citas propias (calendario) | ❌ | `/doctor/appointments` — **No existe** |
| Mi calendario de atención | ❌ | `/doctor/schedule` — **No existe** |
| Mis bloqueos de horario | ❌ | `/doctor/blocks` — **No existe** |
| Perfil | ❌ | `/doctor/profile` — **No existe** |

##### Dashboard Recepcionista

| Página/Funcionalidad | Estado | Ruta |
|---------------------|:------:|------|
| Citas (calendario + CRUD) | ❌ | `/receptionist/appointments` — **No existe** |
| Pacientes (listar + actualizar) | ❌ | `/receptionist/patients` — **No existe** |
| Servicios (listar) | ❌ | `/receptionist/services` — **No existe** |
| Sucursales (listar) | ❌ | `/receptionist/branches` — **No existe** |
| Doctores (listar + calendarios) | ❌ | `/receptionist/workers` — **No existe** |
| Agenda Maestra | ❌ | `/receptionist/agenda` — **No existe** |
| Perfil | ❌ | `/receptionist/profile` — **No existe** |

##### Dashboard Superadmin

| Página/Funcionalidad | Estado | Ruta |
|---------------------|:------:|------|
| Usuarios | ✅ | (reutiliza `/admin/users`) |
| Clínicas | ❌ | **No existe** |
| Sucursales | ✅ | (reutiliza `/admin/branches`) |
| Trabajadores | ❌ | **No existe** |
| Pacientes | ✅ | (reutiliza `/admin/patients`) |
| Servicios | ✅ | (reutiliza `/admin/services`) |
| Roles | ❌ | **No existe** |
| Sesiones | ❌ | **No existe** |
| Invitaciones | ❌ | **No existe** |
| Citas | ❌ | **No existe** |
| Notificaciones | ❌ | **No existe** |

---

## 3. Estado por Módulo Funcional

### Módulo: Autenticación y Seguridad

| Funcionalidad | Backend | Frontend |
|---------------|:-------:|:--------:|
| Login / Logout | ✅ | ✅ |
| Refresh token | ✅ | ✅ |
| Forgot/Reset password | ✅ | ✅ |
| Registro de usuario | ✅ | ❌ |
| Cambio de contraseña | ✅ | ✅ |
| Actualizar perfil | ✅ | ✅ |
| Validación de tenant en BD | ❌ | — |
| Validación de pertenencia activa al tenant | ❌ | — |
| Validación de permisos contra BD | 🔶 | — |
| Protección de roles del sistema | ❌ | — |

### Módulo: Clínicas

| Funcionalidad | Backend | Frontend |
|---------------|:-------:|:--------:|
| Listar clínicas (superadmin) | ✅ | ❌ |
| Crear clínica (superadmin) | ✅ | ❌ |
| Ver/Editar clínica propia (admin) | ✅ | ❌ |
| Desactivar clínica | ✅ | ❌ |
| Configurar recordatorios | ❌ | ❌ |

### Módulo: Sucursales

| Funcionalidad | Backend | Frontend |
|---------------|:-------:|:--------:|
| CRUD sucursales | ✅ | ✅ |
| Horarios de sucursal (CRUD) | ❌ | ❌ |
| Servicios por sucursal | ❌ | ❌ |

### Módulo: Trabajadores

| Funcionalidad | Backend | Frontend |
|---------------|:-------:|:--------:|
| CRUD trabajadores | ✅ | ❌ |
| Asignación a sucursales | 🔶 | ❌ |
| Calendario de atención (horarios regulares) | ❌ | ❌ |
| Bloqueos de horario | ❌ | ❌ |
| Consulta de disponibilidad en tiempo real | ❌ | ❌ |

### Módulo: Pacientes

| Funcionalidad | Backend | Frontend |
|---------------|:-------:|:--------:|
| CRUD pacientes | ✅ | ✅ |
| Filtro por clínica/sucursal | ✅ | 🔶 |
| Asignación de sucursal principal | 🔶 | 🔶 |

### Módulo: Servicios

| Funcionalidad | Backend | Frontend |
|---------------|:-------:|:--------:|
| CRUD servicios | ✅ | ✅ |
| Asignación automática a sucursales | ❌ | ❌ |
| Precio diferente por sucursal | ❌ | ❌ |
| Activar/desactivar por sucursal | ❌ | ❌ |

### Módulo: Citas

| Funcionalidad | Backend | Frontend |
|---------------|:-------:|:--------:|
| CRUD básico de citas | 🔶 | ❌ |
| Vista de calendario | ❌ | ❌ |
| Agenda Maestra (todos los doctores) | ❌ | ❌ |
| Validaciones de negocio al crear | ❌ | ❌ |
| Detección de conflictos (traslape) | ❌ | ❌ |
| Línea de tiempo de la cita | ❌ | ❌ |
| Cancelación con auditoría | 🔶 | ❌ |
| Historial de estados | 🔶 | ❌ |
| Recordatorios automáticos | ❌ | ❌ |
| Configurar cuándo enviar recordatorio | ❌ | ❌ |

### Módulo: Invitaciones

| Funcionalidad | Backend | Frontend |
|---------------|:-------:|:--------:|
| Crear invitación | ✅ | ❌ |
| Validar token | ✅ | — |
| Aceptar invitación | ✅ | ❌ |
| Listar invitaciones | ❌ | ❌ |
| Cancelar invitación | ❌ | ❌ |
| Envío de email | ❌ | — |

### Módulo: Roles y Permisos

| Funcionalidad | Backend | Frontend |
|---------------|:-------:|:--------:|
| CRUD roles | 🔶 | ❌ |
| Proteger roles del sistema | ❌ | ❌ |
| Asignar permisos a rol | ❌ | ❌ |
| Ver permisos de un rol | ❌ | ❌ |

### Módulo: Sesiones (Superadmin)

| Funcionalidad | Backend | Frontend |
|---------------|:-------:|:--------:|
| Listar sesiones activas | ❌ | ❌ |
| Cerrar sesión remota | ❌ | ❌ |

### Módulo: Notificaciones

| Funcionalidad | Backend | Frontend |
|---------------|:-------:|:--------:|
| Notificaciones in-app | ❌ | ❌ |
| Push notifications | ❌ | ❌ |
| Templates de comunicación | ❌ | ❌ |

---

## 4. Estado por Rol

---

### 4.1 Superadmin

| Funcionalidad | Backend | Frontend | Notas |
|---------------|:-------:|:--------:|-------|
| **Gestión de Usuarios** | | | |
| Listar usuarios | ✅ | ✅ | |
| Crear usuario | ✅ | ✅ | |
| Ver detalle usuario | ✅ | ✅ | |
| Actualizar usuario | ✅ | ✅ | |
| Dar de baja usuario | ✅ | ✅ | |
| **Gestión de Roles** | | | |
| Listar roles | ✅ | ❌ | |
| Crear rol | 🔶 | ❌ | Falta proteger roles del sistema |
| Actualizar rol | 🔶 | ❌ | Falta proteger roles del sistema |
| Desactivar rol | 🔶 | ❌ | Falta proteger roles del sistema |
| Gestionar permisos del rol | ❌ | ❌ | |
| **Gestión de Sesiones** | | | |
| Listar sesiones activas | ❌ | ❌ | |
| Cerrar sesión remota | ❌ | ❌ | |
| **Gestión de Clínicas** | | | |
| Listar clínicas | ✅ | ❌ | |
| Crear clínica | ✅ | ❌ | |
| Ver detalle clínica | ✅ | ❌ | |
| Actualizar clínica | ✅ | ❌ | |
| Dar de baja clínica | ✅ | ❌ | |
| **Gestión de Sucursales** | | | |
| Listar sucursales | ✅ | ✅ | (comparte con admin) |
| Crear sucursal | ✅ | ✅ | |
| Actualizar sucursal | ✅ | ✅ | |
| Desactivar sucursal | ✅ | ✅ | |
| Gestionar horario de sucursal | ❌ | ❌ | |
| **Gestión de Trabajadores** | | | |
| Listar trabajadores | ✅ | ❌ | |
| Crear trabajador | ✅ | ❌ | |
| Actualizar trabajador | ✅ | ❌ | |
| Dar de baja trabajador | ✅ | ❌ | |
| Gestionar calendario doctor | ❌ | ❌ | |
| **Gestión de Pacientes** | | | |
| CRUD pacientes | ✅ | ✅ | (comparte con admin) |
| **Gestión de Servicios** | | | |
| CRUD servicios | ✅ | ✅ | (comparte con admin) |
| Servicios por sucursal | ❌ | ❌ | |
| **Gestión de Invitaciones** | | | |
| Listar invitaciones | ❌ | ❌ | |
| Crear/cancelar invitación | 🔶 | ❌ | |
| **Gestión de Citas** | | | |
| CRUD citas básico | 🔶 | ❌ | Sin validaciones de negocio |
| **Notificaciones** | | | |
| Gestionar notificaciones | ❌ | ❌ | |

---

### 4.2 Admin

| Funcionalidad | Backend | Frontend | Notas |
|---------------|:-------:|:--------:|-------|
| **Clínica Propia** | | | |
| Ver datos de clínica | ✅ | ❌ | |
| Actualizar clínica | ✅ | ❌ | |
| Configurar recordatorios | ❌ | ❌ | |
| **Sucursales** | | | |
| Listar / CRUD | ✅ | ✅ | |
| Gestionar horario de sucursal | ❌ | ❌ | |
| **Trabajadores** | | | |
| Listar trabajadores | ✅ | ❌ | |
| Crear trabajador (con rol) | ✅ | ❌ | |
| Actualizar / suspender trabajador | ✅ | ❌ | |
| Asignar trabajador a sucursales | 🔶 | ❌ | |
| Definir calendario de doctor | ❌ | ❌ | |
| Crear/eliminar bloqueos de horario | ❌ | ❌ | |
| **Servicios** | | | |
| Listar / CRUD | ✅ | ✅ | |
| Asignación automática a sucursales | ❌ | ❌ | |
| Precio por sucursal | ❌ | ❌ | |
| **Pacientes** | | | |
| Listar / CRUD | ✅ | ✅ | |
| **Citas** | | | |
| Listar citas | ✅ | ❌ | |
| Crear cita (con validaciones) | ❌ | ❌ | Solo CRUD básico sin validar |
| Actualizar cita | 🔶 | ❌ | |
| Cancelar cita (con auditoría) | 🔶 | ❌ | Falta registrar cancelledBy/reason |
| Ver línea de tiempo de cita | ❌ | ❌ | |
| Vista calendario | ❌ | ❌ | |
| Agenda Maestra | ❌ | ❌ | |
| Configurar recordatorios | ❌ | ❌ | |
| **Invitaciones** | | | |
| Crear invitación + envío email | 🔶 | ❌ | Sin email |
| Listar / cancelar invitaciones | ❌ | ❌ | |
| **Perfil** | | | |
| Ver / actualizar perfil | ✅ | ✅ | |
| Cambiar contraseña | ✅ | ✅ | |

---

### 4.3 Doctor

| Funcionalidad | Backend | Frontend | Notas |
|---------------|:-------:|:--------:|-------|
| **Citas Propias** | | | |
| Ver citas asignadas | 🔶 | ❌ | Backend lista todas, falta filtro por doctor autenticado |
| Vista de calendario de citas | ❌ | ❌ | |
| Ver detalle de cita | ✅ | ❌ | |
| **Calendario Propio** | | | |
| Ver calendario de atención | ❌ | ❌ | |
| Crear horario de atención por sucursal | ❌ | ❌ | |
| Actualizar horario | ❌ | ❌ | |
| Crear bloqueo de horario | ❌ | ❌ | |
| Ver / eliminar bloqueos | ❌ | ❌ | |
| **Perfil** | | | |
| Ver / actualizar perfil | ✅ | ❌ | Backend listo, sin UI de doctor |
| Cambiar contraseña | ✅ | ❌ | |

---

### 4.4 Recepcionista

| Funcionalidad | Backend | Frontend | Notas |
|---------------|:-------:|:--------:|-------|
| **Citas** | | | |
| Listar citas | ✅ | ❌ | |
| Crear cita (con validaciones) | ❌ | ❌ | |
| Actualizar / cancelar cita | 🔶 | ❌ | |
| Ver línea de tiempo de cita | ❌ | ❌ | |
| Vista calendario | ❌ | ❌ | |
| Agenda Maestra | ❌ | ❌ | |
| **Pacientes** | | | |
| Listar pacientes | ✅ | ❌ | |
| Actualizar paciente | ✅ | ❌ | |
| **Servicios** | | | |
| Listar servicios | ✅ | ❌ | |
| **Sucursales** | | | |
| Listar sucursales (con horarios) | 🔶 | ❌ | Falta incluir horarios en la respuesta |
| **Doctores** | | | |
| Listar doctores (con calendarios) | 🔶 | ❌ | Falta incluir calendarios en la respuesta |
| **Información de Clínica** | | | |
| Ver info de clínica | ✅ | ❌ | |
| **Perfil** | | | |
| Ver / actualizar perfil | ✅ | ❌ | Sin UI de recepcionista |
| Cambiar contraseña | ✅ | ❌ | |

---

## 5. Prioridades de Desarrollo

### Prioridad 1 — Crítico (Bloquea uso mínimo del sistema)

Estas funcionalidades son necesarias para que el sistema sea operativo:

1. **Backend: Validaciones de negocio en citas** (RF-AD-07)
   - Detección de conflictos de traslape de horario
   - Verificación de disponibilidad del doctor (horario + bloqueos)
   - Verificación del horario operativo de la sucursal
   - Verificación de servicio disponible en la sucursal
   - Cálculo automático de `endTime`

2. **Backend: Endpoints de calendario de doctores** (RF-AD-04, RF-DR-02)
   - CRUD de `worker_schedules`
   - CRUD de `schedule_blocks`

3. **Backend: Endpoints de horario de sucursales** (RF-AD-02)
   - CRUD de `branch_schedules`

4. **Frontend: Módulo de citas con vista de calendario** (RF-AD-07, RF-RC-01)
   - Calendario (día/semana/mes)
   - Formulario de creación/edición de cita
   - Vista de cancelación con motivo

5. **Frontend: Módulo de trabajadores** (RF-AD-03)
   - Tabla con CRUD
   - Gestión de calendario y bloqueos

---

### Prioridad 2 — Alta (Funcionalidad core incompleta)

6. **Backend: Servicios por sucursal** (RF-AD-05)
   - Asignación automática al crear
   - CRUD de `branch_services`
   - Precio override por sucursal

7. **Backend: Validación de tenant en middleware** (RS-02)
   - Verificar pertenencia activa del usuario al tenant en BD
   - No confiar solo en el JWT

8. **Backend: Listar/cancelar invitaciones** (RF-AD-08)
   - `GET /invitations`
   - `DELETE /invitations/:id`

9. **Frontend: Agenda Maestra** (RF-AD-07, RF-RC-01)
   - Vista de todos los doctores en paralelo

10. **Frontend: Módulo de clínica propia** (RF-AD-01)
    - Pantalla de ver/editar la clínica

11. **Frontend: Módulo de invitaciones** (RF-AD-08)

---

### Prioridad 3 — Media (Completa la experiencia)

12. **Backend + Frontend: Línea de tiempo de cita** (RF-AD-07)
    - Endpoint `GET /appointments/:id/timeline`
    - UI de historial de estados

13. **Backend + Frontend: Roles y permisos UI** (RF-SA-02)
    - Página de gestión de roles
    - Asignación de permisos

14. **Backend: Proteger roles del sistema** (RF-SA-02)
    - No permitir editar/eliminar roles `superadmin`, `admin`, `doctor`, `receptionist`

15. **Frontend: Dashboards de Doctor y Recepcionista**
    - Layouts y rutas específicas por rol
    - Redirección post-login según rol

16. **Backend + Frontend: Sesiones activas** (RF-SA-03)
    - Módulo para superadmin

---

### Prioridad 4 — Baja (Valor agregado)

17. **Backend: Sistema de recordatorios automáticos** (RF-AD-07)
    - Job/cron para envío X horas antes
    - Integración con email provider (SendGrid, Resend, etc.)
    - Integración con WhatsApp Business API

18. **Backend + Frontend: Notificaciones in-app y push**
    - Endpoints de notificaciones
    - UI del menú de notificaciones

19. **Backend: Templates de comunicación**
    - Gestión de templates de email/SMS

20. **Frontend: Página de registro de usuario** (flujo de invitación completo)

---

### Resumen de Conteo

| Prioridad | Funcionalidades | Estado estimado |
|-----------|:--------------:|:---------------:|
| Crítico | 5 bloques | 0% → MVP |
| Alta | 6 bloques | 20% hecho |
| Media | 5 bloques | 5% hecho |
| Baja | 4 bloques | 0% hecho |
| **Total** | **20 bloques** | **~15% del sistema completo** |
