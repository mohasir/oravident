# DentSass — Documento de Requerimientos del Sistema

> Versión 1.0 · Mayo 2026  
> Plataforma SaaS multi-tenant para gestión de clínicas dentales

---

## Índice

1. [Visión General](#1-visión-general)
2. [Roles del Sistema](#2-roles-del-sistema)
3. [Modelo de Datos](#3-modelo-de-datos)
4. [Requerimientos Funcionales por Rol](#4-requerimientos-funcionales-por-rol)
   - 4.1 [Superadmin](#41-superadmin)
   - 4.2 [Admin (Propietario de Clínica)](#42-admin-propietario-de-clínica)
   - 4.3 [Doctor](#43-doctor)
   - 4.4 [Recepcionista](#44-recepcionista)
5. [Requerimientos No Funcionales](#5-requerimientos-no-funcionales)
6. [Reglas de Negocio — Control de Citas](#6-reglas-de-negocio--control-de-citas)
7. [Requerimientos de Seguridad](#7-requerimientos-de-seguridad)
8. [Matriz de Permisos](#8-matriz-de-permisos)

---

## 1. Visión General

DentSass es una plataforma SaaS multi-tenant diseñada para la gestión integral de clínicas dentales. Cada **clínica** es un tenant independiente con sus propias sucursales, trabajadores, pacientes, servicios y citas. El sistema soporta cuatro roles con diferentes niveles de acceso: `superadmin`, `admin`, `doctor` y `receptionist`.

### Contexto Multi-Tenant

- Un **usuario** puede pertenecer a múltiples clínicas con roles distintos en cada una.
- El `tenant_id` se incluye en el JWT y determina el contexto de operación.
- El `superadmin` opera a nivel global, sin pertenecer a ninguna clínica.

---

## 2. Roles del Sistema

| Rol | Alcance | Descripción |
|-----|---------|-------------|
| `superadmin` | Global | Administra toda la plataforma sin restricción de tenant |
| `admin` | Clínica | Propietario/administrador de una clínica específica |
| `doctor` | Clínica | Profesional de salud asignado a una clínica |
| `receptionist` | Clínica | Personal de recepción y gestión de agenda |

Los roles `superadmin`, `admin`, `doctor` y `receptionist` son roles del sistema y **no pueden ser modificados ni eliminados**.

---

## 3. Modelo de Datos

### 3.1 Clínica (`clinics`)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID | Identificador único |
| `name` | string | Nombre de la clínica |
| `slug` | string | Identificador URL único |
| `email` | string | Correo principal |
| `phone` | string | Teléfono principal |
| `logo` | string | URL del logo |
| `timezone` | string | Zona horaria (ej. `America/Bogota`) |
| `settings` | JSON | Configuraciones generales |
| `isActive` | boolean | Estado activo/inactivo |

### 3.2 Sucursal (`branches`)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID | Identificador único |
| `clinicId` | UUID | Referencia a la clínica |
| `name` | string | Nombre de la sucursal |
| `slug` | string | Identificador URL único |
| `phone` | string | Teléfono de la sucursal |
| `email` | string | Correo de la sucursal |
| `address` | string | Dirección física |
| `latitude` | decimal | Coordenada geográfica |
| `longitude` | decimal | Coordenada geográfica |
| `color` | string (hex) | Color identificador |
| `isActive` | boolean | Estado activo/inactivo |

#### 3.2.1 Horario de Sucursal (`branch_schedules`)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `branchId` | UUID | Referencia a la sucursal |
| `dayOfWeek` | enum | `monday`–`sunday` |
| `openTime` | time | Hora de apertura (HH:MM) |
| `closeTime` | time | Hora de cierre (HH:MM) |
| `isOpen` | boolean | Si la sucursal opera ese día |

### 3.3 Trabajador (`workers`)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID | Identificador único |
| `clinicId` | UUID | Clínica a la que pertenece |
| `userId` | UUID | Usuario del sistema vinculado |
| `roleId` | UUID | Rol (doctor / receptionist) |
| `firstName` | string | Primer nombre |
| `middleName` | string | Segundo nombre |
| `lastName` | string | Primer apellido |
| `secondLastName` | string | Segundo apellido |
| `birthDate` | date | Fecha de nacimiento |
| `gender` | enum | `male`, `female`, `other` |
| `prefix` | string | Prefijo profesional (Dr., Lic., etc.) |
| `specialty` | string | Especialidad médica |
| `licenseNumber` | string | Número de licencia médica |
| `idNumber` | string | Cédula de identidad |
| `contractType` | enum | `full_time`, `part_time`, `contractor` |
| `color` | string (hex) | Color en el calendario |
| `isActive` | boolean | Estado activo/suspendido |

#### 3.3.1 Calendario del Doctor (`worker_schedules`)

Define los horarios regulares de atención de un doctor.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `workerId` | UUID | Referencia al doctor |
| `branchId` | UUID | Sucursal donde aplica |
| `dayOfWeek` | enum | `monday`–`sunday` |
| `startTime` | time | Hora de inicio de atención |
| `endTime` | time | Hora de fin de atención |
| `isAvailable` | boolean | Si está disponible ese día |

#### 3.3.2 Bloqueo de Horario (`schedule_blocks`)

Define períodos en los que el doctor **no está disponible** (vacaciones, permisos, etc.).

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `workerId` | UUID | Referencia al doctor |
| `startDatetime` | datetime | Inicio del bloqueo |
| `endDatetime` | datetime | Fin del bloqueo |
| `reason` | string | Motivo del bloqueo (opcional) |

### 3.4 Paciente (`patients`)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID | Identificador único |
| `clinicId` | UUID | Clínica a la que pertenece |
| `firstName` | string | Primer nombre |
| `middleName` | string | Segundo nombre |
| `lastName` | string | Primer apellido |
| `secondLastName` | string | Segundo apellido |
| `idNumber` | string | Cédula (solo mayores de edad) |
| `email` | string | Correo electrónico |
| `phone` | string | Teléfono |
| `birthDate` | date | Fecha de nacimiento |
| `gender` | enum | `male`, `female`, `other` |
| `address` | string | Dirección |
| `medicalNotes` | text | Notas médicas |
| `primaryBranchId` | UUID | Sucursal principal de atención |
| `isActive` | boolean | Estado activo/inactivo |

### 3.5 Servicio (`services`)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID | Identificador único |
| `clinicId` | UUID | Clínica propietaria |
| `name` | string | Nombre del servicio |
| `description` | text | Descripción detallada |
| `durationMinutes` | integer | Duración en minutos |
| `basePrice` | decimal | Precio base |
| `isActive` | boolean | Estado activo/inactivo |

#### 3.5.1 Servicio por Sucursal (`branch_services`)

Un servicio es implícitamente disponible en **todas las sucursales** de la clínica al precio base. Solo se crea un registro en `branch_services` cuando se quiere hacer un override: cambiar el precio o desactivar el servicio en una sucursal específica.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `serviceId` | UUID | Referencia al servicio |
| `branchId` | UUID | Referencia a la sucursal |
| `priceOverride` | decimal | Precio específico para esta sucursal (opcional) |
| `isActive` | boolean | `false` para desactivar el servicio en esta sucursal |

> **Regla de negocio**: Un servicio está disponible en una sucursal si **no existe** un registro `branch_services` para ese par, o si existe con `isActive = true`. Solo se crea el registro cuando se quiere un precio diferente o desactivar en esa sucursal.

### 3.6 Cita (`appointments`)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID | Identificador único |
| `clinicId` | UUID | Clínica |
| `branchId` | UUID | Sucursal donde se realiza |
| `patientId` | UUID | Paciente |
| `workerId` | UUID | Doctor asignado |
| `serviceId` | UUID | Servicio a realizar |
| `createdByUserId` | UUID | Usuario que creó la cita |
| `appointmentDate` | date | Fecha de la cita |
| `startTime` | time | Hora de inicio |
| `endTime` | time | Hora de fin (calculada) |
| `notes` | text | Notas adicionales |
| `price` | decimal | Precio cobrado |
| `discount` | decimal | Descuento aplicado |
| `taxes` | decimal | Impuestos calculados |
| `statusId` | UUID | Estado actual |
| `reminderSentAt` | datetime | Cuándo se envió el recordatorio |
| `cancelledAt` | datetime | Cuándo fue cancelada |
| `cancelledByUserId` | UUID | Quién la canceló |
| `cancellationReason` | text | Motivo de cancelación |

#### 3.6.1 Estados de Cita

| Estado | Descripción |
|--------|-------------|
| `pending` | Agendada, pendiente de confirmación |
| `confirmed` | Confirmada |
| `rescheduled` | Fue reagendada |
| `cancelled` | Cancelada |
| `completed` | Completada exitosamente |
| `no_show` | El paciente no se presentó |

#### 3.6.2 Historial de Estado (`appointment_status_history`)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `appointmentId` | UUID | Referencia a la cita |
| `previousStatusId` | UUID | Estado anterior |
| `newStatusId` | UUID | Estado nuevo |
| `changedByUserId` | UUID | Usuario que realizó el cambio |
| `changedAt` | datetime | Fecha y hora del cambio |
| `notes` | text | Comentario del cambio |

### 3.7 Invitación (`user_invitations`)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID | Identificador único |
| `email` | string | Correo del invitado |
| `clinicId` | UUID | Clínica a la que pertenecerá |
| `roleId` | UUID | Rol que tendrá (doctor / receptionist) |
| `token` | string | Token único de invitación |
| `expiresAt` | datetime | Fecha de expiración |
| `status` | enum | `pending`, `accepted`, `cancelled`, `expired` |
| `createdByUserId` | UUID | Admin que la creó |

---

## 4. Requerimientos Funcionales por Rol

---

### 4.1 Superadmin

El superadmin opera a nivel global de la plataforma y no está asociado a ninguna clínica.

#### RF-SA-01: Gestión de Usuarios

- **Listar** todos los usuarios de la plataforma con filtros (nombre, email, estado, rol).
- **Crear** usuario con: nombre, correo, contraseña temporal, rol global.
- **Ver detalle** de un usuario.
- **Actualizar** datos de cualquier usuario.
- **Dar de baja** (soft delete / desactivar) un usuario.

#### RF-SA-02: Gestión de Roles

- **Listar** todos los roles del sistema.
- **Crear** nuevo rol con nombre y conjunto de permisos.
- **Actualizar** roles personalizados (nombre, permisos).
- **Desactivar** roles personalizados.
- Los roles del sistema (`superadmin`, `admin`, `doctor`, `receptionist`) **no pueden modificarse ni eliminarse**.

#### RF-SA-03: Gestión de Sesiones

- **Listar** todas las sesiones activas de la plataforma (usuario, dispositivo, IP, fecha de inicio).
- **Cerrar** cualquier sesión activa de forma remota.

#### RF-SA-04: Gestión de Clínicas

- **Listar** todas las clínicas con filtros (nombre, estado).
- **Crear** clínica nueva.
- **Ver detalle** de cualquier clínica.
- **Actualizar** datos de cualquier clínica.
- **Dar de baja** una clínica (desactivarla con todos sus datos).

#### RF-SA-05: Gestión de Sucursales

- **Listar** sucursales (con filtro por clínica).
- **Crear** sucursal para cualquier clínica.
- **Actualizar** cualquier sucursal.
- **Desactivar** cualquier sucursal.
- Gestionar el **horario** de cada sucursal (días y horas de operación).

#### RF-SA-06: Gestión de Trabajadores

- **Listar** trabajadores (con filtro por clínica, rol, estado).
- **Crear** trabajador asignado a cualquier clínica con especificación de rol.
- **Actualizar** datos de cualquier trabajador.
- **Dar de baja** (suspender) cualquier trabajador.

#### RF-SA-07: Gestión de Calendarios de Doctores

- **Crear** horario de atención para cualquier doctor (por día y sucursal).
- **Actualizar** horario de atención.
- **Listar** horarios de un doctor.
- **Eliminar** horarios de un doctor.
- **Crear** bloqueos de horario para cualquier doctor.
- **Actualizar** bloqueos de horario.
- **Listar** bloqueos de horario.
- **Eliminar** bloqueos de horario.

#### RF-SA-08: Gestión de Pacientes

- **Listar** pacientes (con filtro por clínica, estado).
- **Crear** paciente para cualquier clínica.
- **Actualizar** datos de cualquier paciente.
- **Dar de baja** cualquier paciente.

#### RF-SA-09: Gestión de Servicios

- **Listar** servicios (con filtro por clínica, estado).
- **Crear** servicio para cualquier clínica.
- **Actualizar** cualquier servicio.
- **Deshabilitar** cualquier servicio.

#### RF-SA-10: Gestión de Invitaciones

- **Listar** todas las invitaciones.
- **Crear** invitación para cualquier clínica.
- **Cancelar** cualquier invitación pendiente.

#### RF-SA-11: Gestión de Citas

- **Listar** citas (con filtro por clínica, sucursal, doctor, paciente, estado, fecha).
- **Crear** cita.
- **Actualizar** cita.
- **Cancelar** cita.

#### RF-SA-12: Gestión de Notificaciones

- **Listar** notificaciones de la plataforma.
- **Gestionar** notificaciones push de la app.
- Administrar el historial de notificaciones enviadas.

---

### 4.2 Admin (Propietario de Clínica)

El admin gestiona **únicamente su clínica** y todos los recursos que le pertenecen.

#### RF-AD-01: Gestión de Clínica Propia

- **Ver** los datos de su clínica.
- **Actualizar** los datos de su clínica (nombre, correo, teléfono, logo, timezone).

#### RF-AD-02: Gestión de Sucursales

- **Listar** las sucursales de su clínica.
- **Crear** nueva sucursal para su clínica con todos sus campos.
- **Ver detalle** de una sucursal.
- **Actualizar** datos de una sucursal.
- **Desactivar** una sucursal.
- **Gestionar el horario** de cada sucursal:
  - Definir qué días opera la sucursal.
  - Definir hora de apertura y cierre por día.

#### RF-AD-03: Gestión de Trabajadores

- **Listar** los trabajadores de su clínica con filtros (rol, estado, sucursal).
- **Crear** nuevo trabajador especificando:
  - Datos personales completos.
  - Rol (`doctor` o `receptionist`).
  - Sucursales a las que está asignado.
- **Ver detalle** de un trabajador.
- **Actualizar** datos de un trabajador.
- **Suspender** un trabajador (desactivar).

#### RF-AD-04: Calendarios de Doctores

- **Definir y gestionar el calendario** de atención de cada doctor:
  - Por día de la semana: hora de inicio y fin por sucursal.
- **Crear bloqueos de horario** para un doctor:
  - Fecha y hora de inicio.
  - Fecha y hora de fin.
  - Motivo (opcional).
- **Listar** el calendario y bloqueos de un doctor.
- **Eliminar** bloqueos de horario.

#### RF-AD-05: Gestión de Servicios

- **Listar** los servicios de su clínica.
- **Crear** nuevo servicio (disponible implícitamente en todas las sucursales al precio base).
- **Ver detalle** de un servicio, incluyendo overrides de precio/disponibilidad por sucursal.
- **Actualizar** datos de un servicio.
- **Gestionar overrides por sucursal**: establecer precio diferente o desactivar el servicio en una sucursal específica.
- **Desactivar** un servicio (lo desactiva en toda la clínica).

#### RF-AD-06: Gestión de Pacientes

- **Listar** los pacientes de su clínica con filtros.
- **Crear** nuevo paciente con todos sus campos, incluyendo sucursal principal.
- **Ver detalle** de un paciente.
- **Actualizar** datos de un paciente.
- **Desactivar** un paciente.

#### RF-AD-07: Gestión de Citas

- **Listar** citas de su clínica con filtros (sucursal, doctor, paciente, estado, fecha, rango de fechas).
- **Crear** cita validando:
  - Disponibilidad del doctor.
  - Horario operativo de la sucursal.
  - Servicio disponible en la sucursal.
  - Ausencia de conflictos de horario.
- **Ver detalle** de una cita con línea de tiempo completa de estados.
- **Actualizar** datos de una cita.
- **Cancelar** una cita especificando la razón.
  - Al cancelar: registrar quién la canceló, cuándo y el motivo.
- **Vista de Calendario**: visualizar citas en formato calendario (día/semana/mes).
- **Agenda Maestra**: vista consolidada de todos los doctores en paralelo para detectar huecos de disponibilidad.
- **Configurar recordatorios**: definir si se envía recordatorio automático (WhatsApp/Email) y cuántas horas antes de la cita.

#### RF-AD-08: Gestión de Invitaciones

- **Listar** las invitaciones de su clínica (pendientes, aceptadas, canceladas, expiradas).
- **Crear** invitación especificando:
  - Correo del invitado.
  - Rol que tendrá (`doctor` o `receptionist`).
  - El sistema envía el correo de invitación automáticamente.
- **Cancelar** una invitación pendiente.

#### RF-AD-09: Gestión de Perfil

- **Ver** su información de perfil.
- **Actualizar** sus datos personales (nombre, etc.).
- **Cambiar contraseña**.

---

### 4.3 Doctor

El doctor solo puede gestionar sus propias citas y su propio calendario.

#### RF-DR-01: Vista de Citas Propias

- **Listar** únicamente las citas que tiene asignadas en **vista de calendario**.
- Ver el detalle de cada cita (datos del paciente, servicio, sucursal, notas, estado).

#### RF-DR-02: Gestión de Propio Calendario

- **Ver** su calendario de atención por sucursal.
- **Crear** su horario de atención regular:
  - Día de la semana.
  - Hora de inicio y fin de disponibilidad.
  - Sucursal donde aplica.
- **Actualizar** su horario de atención.
- **Crear** bloqueos de horario propios:
  - Fecha y hora de inicio.
  - Fecha y hora de fin.
  - Motivo.
- **Gestionar** sus propios bloqueos (crear, ver, eliminar).

#### RF-DR-03: Gestión de Perfil

- **Ver** su información de perfil.
- **Actualizar** sus datos personales.
- **Cambiar contraseña**.

---

### 4.4 Recepcionista

La recepcionista gestiona citas y tiene acceso de lectura a recursos relacionados.

#### RF-RC-01: Gestión de Citas

- **Listar** citas de la clínica con filtros (sucursal, doctor, paciente, estado, fecha).
- **Crear** cita con las mismas validaciones que el admin.
- **Ver detalle** de una cita con línea de tiempo de estados.
- **Actualizar** una cita.
- **Cancelar** una cita especificando la razón.
- **Vista de Calendario**: visualizar citas en formato calendario (día/semana/mes).
- **Agenda Maestra**: vista consolidada de todos los doctores para detectar disponibilidad.

#### RF-RC-02: Gestión de Pacientes (parcial)

- **Listar** los pacientes de la clínica.
- **Actualizar** la información de un paciente.
- **Ver detalle** de un paciente.

#### RF-RC-03: Consulta de Servicios

- **Listar** los servicios activos de la clínica (con disponibilidad por sucursal y precio).

#### RF-RC-04: Consulta de Sucursales

- **Listar** las sucursales de la clínica junto con sus horarios de operación.
- **Ver detalle** de una sucursal.

#### RF-RC-05: Consulta de Doctores

- **Listar** los doctores de la clínica.
- Para cada doctor incluir su **calendario de atención** y **bloqueos activos**.

#### RF-RC-06: Información de Clínica

- **Ver** la información general de la clínica a la que pertenece.

#### RF-RC-07: Gestión de Perfil

- **Ver** su información de perfil.
- **Actualizar** sus datos personales.
- **Cambiar contraseña**.

---

## 5. Requerimientos No Funcionales

### RNF-01: Rendimiento
- Las consultas de listado deben responder en menos de 500ms bajo carga normal.
- El endpoint de disponibilidad de doctores debe calcularse en tiempo real.
- Las vistas de calendario deben soportar rangos de hasta 3 meses sin degradación.

### RNF-02: Seguridad
- Todos los endpoints protegidos requieren JWT válido.
- Los tokens de invitación expiran en 48 horas.
- Los tokens de reset de contraseña expiran en 1 hora.
- Rate limiting en endpoints de autenticación.
- Contraseñas hasheadas con bcrypt (min. 10 rounds).

### RNF-03: Multi-tenancy
- Los datos de una clínica son completamente aislados de otras clínicas.
- El `tenant_id` siempre se valida contra la base de datos, nunca se confía solo en el token.
- Un usuario con rol en una clínica no puede acceder a datos de otra.

### RNF-04: Disponibilidad
- El sistema debe operar 24/7 con al menos 99.5% de uptime.
- La lógica de recordatorios debe tolerarse a fallos transitorios de comunicación.

### RNF-05: Auditoría
- Todos los cambios de estado de citas se registran en el historial.
- Las cancelaciones registran: usuario, fecha y motivo.
- Las invitaciones registran quién las creó y cuándo fueron aceptadas.

### RNF-06: Internacionalización
- El sistema soporta múltiples zonas horarias (configurado por clínica).
- La interfaz soporta i18n (inicialmente español).

### RNF-07: Comunicación
- El sistema debe integrarse con un servicio de envío de emails (invitaciones, recordatorios, reset de contraseña).
- El sistema debe soportar envío de recordatorios vía WhatsApp Business API.

---

## 6. Reglas de Negocio — Control de Citas

### RN-01: Validación de Disponibilidad del Doctor

Antes de crear o actualizar una cita, el sistema **debe rechazarla** si se cumple cualquiera de las siguientes condiciones:

**a) Bloqueo de agenda activo**
```
schedule_blocks donde:
  workerId = doctor seleccionado
  startDatetime <= nueva_cita_inicio
  endDatetime >= nueva_cita_fin
```

**b) Fuera del horario laboral del doctor**
```
worker_schedules donde:
  workerId = doctor seleccionado
  branchId = sucursal seleccionada
  dayOfWeek = día de la cita
  
Si no existe registro → doctor no trabaja ese día en esa sucursal
Si existe → startTime <= nueva_cita_inicio AND endTime >= nueva_cita_fin
```

**c) Fuera del horario operativo de la sucursal**
```
branch_schedules donde:
  branchId = sucursal seleccionada
  dayOfWeek = día de la cita
  isOpen = true
  openTime <= nueva_cita_inicio
  closeTime >= nueva_cita_fin
```

**d) Servicio no disponible en la sucursal**
```
branch_services donde:
  serviceId = servicio seleccionado
  branchId = sucursal seleccionada
  isActive = true
```

**e) Conflicto con cita existente (traslape de rangos)**
```sql
WHERE workerId = :doctorId
  AND appointmentDate = :date
  AND status NOT IN ('cancelled', 'no_show')
  AND :newStart < endTime
  AND :newEnd > startTime
```

> `newEnd` se calcula como `newStart + service.durationMinutes`.

### RN-02: Cálculo del Precio Final

```
precioFinal = (precio_del_servicio_en_sucursal - descuento) * (1 + impuesto)
```

El precio de la cita puede ser editado manualmente (override), pero el sistema propone el precio del servicio en esa sucursal.

### RN-03: Recordatorios Automáticos

- Si la clínica tiene habilitados los recordatorios, el sistema envía una notificación (Email y/o WhatsApp) automáticamente `X` horas antes de la cita.
- `X` es configurable por clínica.
- Solo se envía si la cita está en estado `confirmed`.

---

## 7. Requerimientos de Seguridad

### RS-01: Autenticación

- Todos los endpoints (excepto login, register, forgot-password, reset-password, validate-invitation) requieren JWT válido.
- El JWT debe contener: `userId`, `tenantId`, `roleId`, `sessionId`.
- Los tokens de acceso expiran en 15 minutos; los de refresco en 7 días.

### RS-02: Validación para Usuarios No-Superadmin

El middleware de autorización debe validar en este orden:

1. JWT válido y no expirado.
2. `userId` existe en la base de datos y `isActive = true`.
3. `tenantId` existe en la base de datos y `isActive = true`.
4. Existe relación activa en `clinic_users` (o `workers`) entre el usuario y el tenant.
5. `roleId` existe, está activo y pertenece al usuario en ese tenant.
6. Los permisos requeridos por el endpoint existen y están asignados al rol del usuario en ese tenant.

Si cualquier validación falla → `403 Forbidden`.

### RS-03: Validación para Superadmin

1. JWT válido y no expirado.
2. `userId` existe y `isActive = true`.
3. El usuario tiene el rol global `superadmin`.

Para superadmin **no se requiere** `tenantId`, pertenencia a clínica, ni validación de permisos por recurso.

### RS-04: Aislamiento de Tenant

- Todos los queries de recursos de clínica (branches, workers, patients, services, appointments) deben incluir el filtro `clinicId = tokenClinicId`.
- Un usuario no puede acceder a recursos de otra clínica aunque conozca los IDs.

### RS-05: Protección de Datos Sensibles

- Las contraseñas nunca se devuelven en respuestas API.
- Los tokens de invitación y reset se invalidan tras su uso.
- Las sesiones se invalidan al hacer logout.

---

## 8. Matriz de Permisos

| Recurso | Acción | Superadmin | Admin | Doctor | Recepcionista |
|---------|--------|:----------:|:-----:|:------:|:-------------:|
| **clinic** | get | ✓ | ✓ (propia) | — | ✓ (propia) |
| **clinic** | update | ✓ | ✓ (propia) | — | — |
| **clinic** | create/list/delete | ✓ | — | — | — |
| **branch** | list | ✓ | ✓ | ✓ | ✓ |
| **branch** | get | ✓ | ✓ | ✓ | ✓ |
| **branch** | create/update/delete | ✓ | ✓ | — | — |
| **worker** | list | ✓ | ✓ | — | ✓ |
| **worker** | get | ✓ | ✓ | ✓ (propio) | ✓ |
| **worker** | create/update/delete | ✓ | ✓ | — | — |
| **schedule** | list | ✓ | ✓ | ✓ (propio) | ✓ |
| **schedule** | create/update/delete | ✓ | ✓ | ✓ (propio) | — |
| **patient** | list | ✓ | ✓ | — | ✓ |
| **patient** | get | ✓ | ✓ | — | ✓ |
| **patient** | create/delete | ✓ | ✓ | — | — |
| **patient** | update | ✓ | ✓ | — | ✓ |
| **service** | list/get | ✓ | ✓ | — | ✓ |
| **service** | create/update/delete | ✓ | ✓ | — | — |
| **appointment** | list/get | ✓ | ✓ | ✓ (propias) | ✓ |
| **appointment** | create/update/cancel | ✓ | ✓ | — | ✓ |
| **invitation** | list/create/cancel | ✓ | ✓ | — | — |
| **user** | list/get/create/update/delete | ✓ | — | — | — |
| **role** | list/get/create/update/delete | ✓ | — | — | — |
| **session** | list/close | ✓ | — | — | — |
| **notification** | manage | ✓ | — | — | — |
