# Diseño de Base de Datos - Dental SaaS

Este documento contiene la estructura de la base de datos para el proyecto, organizada por módulos.

## 1. Módulo Tenant (Clínica y Sucursales)

### Table: clinics
Representa la entidad principal (El Cliente/SaaS).
- `id`: uuid (PK)
- `name`: varchar(150)
- `slug`: varchar(80) (Unique)
- `email`: varchar(150)
- `phone`: varchar(30)
- `logo_url`: text
- `timezone`: varchar(50) (Default: 'America/Panama')
- `settings`: jsonb
- `is_active`: boolean
- `created_at`: timestamptz
- `updated_at`: timestamptz

### Table: branches
Sucursales físicas de cada clínica.
- `id`: uuid (PK)
- `clinic_id`: uuid (FK -> clinics.id)
- `name`: varchar(150)
- `slug`: varchar(80)
- `phone`: varchar(30)
- `email`: varchar(150)
- `address`: text
- `latitude`: decimal(10,7)
- `longitude`: decimal(10,7)
- `settings`: jsonb
- `is_active`: boolean
- `created_at`: timestamptz
- `updated_at`: timestamptz
- *Index*: (clinic_id, slug) [unique]

## 2. Módulo RBAC (Roles y Permisos)

### Table: permissions
- `id`: uuid (PK)
- `resource`: varchar(50) (appointments, patients, etc.)
- `action`: varchar(20) (create, read, update, delete)
- `display_name`: varchar(80)
- `description`: text
- *Index*: (resource, action) [unique]

### Table: roles
- `id`: uuid (PK)
- `clinic_id`: uuid (FK -> clinics.id)
- `name`: varchar(50)
- `display_name`: varchar(80)
- `is_system`: boolean (Default: false)

### Table: role_permissions
Tabla intermedia para N:N de Roles y Permisos.
- `id`: uuid (PK)
- `role_id`: uuid (FK -> roles.id)
- `permission_id`: uuid (FK -> permissions.id)

## 3. Módulo Usuarios y Personal (Workers)

### Table: users
Credenciales de acceso.
- `id`: uuid (PK)
- `clinic_id`: uuid (FK -> clinics.id)
- `role_id`: uuid (FK -> roles.id)
- `email`: varchar(150)
- `password_hash`: text
- *Index*: (clinic_id, email) [unique]

### Table: workers
Personal que atiende (doctores, asistentes).
- `id`: uuid (PK)
- `clinic_id`: uuid (FK -> clinics.id)
- `user_id`: uuid (FK -> users.id)
- `specialty`: varchar(100)

### Table: worker_branches
Mapeo de qué doctores trabajan en qué sucursales.
- `id`: uuid (PK)
- `worker_id`: uuid (FK)
- `branch_id`: uuid (FK)
- `is_primary`: boolean

## 4. Módulo Pacientes

### Table: patients
- `id`: uuid (PK)
- `clinic_id`: uuid (FK)
- `primary_branch_id`: uuid (FK)
- `first_name`: varchar(80)
- `lastname`: varchar(80)
- `email`: varchar(150)
- `phone`: varchar(30)
- `date_of_birth`: date
- `gender`: varchar(10)
- `medical_notes`: text

## 5. Módulo Agenda (Servicios y Citas)

### Table: services
- `id`: uuid (PK)
- `clinic_id`: uuid (FK)
- `name`: varchar(120)
- `duration_minutes`: int (Default: 30)
- `price`: decimal(10,2)

### Table: appointments
- `id`: uuid (PK)
- `clinic_id`: uuid (FK)
- `branch_id`: uuid (FK)
- `patient_id`: uuid (FK)
- `worker_id`: uuid (FK)
- `service_id`: uuid (FK)
- `starts_at`: timestamptz
- `ends_at`: timestamptz
- `status`: varchar(20)

## 6. Módulo Notificaciones

### Table: notifications
Historial de comunicaciones externas (WhatsApp, Email).
- `id`: uuid (PK)
- `appointment_id`: uuid (FK)
- `channel`: varchar(15)
- `status`: varchar(15)
- `sent_at`: timestamptz
