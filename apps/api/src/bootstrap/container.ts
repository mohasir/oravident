/**
 * Composition Root
 * 
 */


// ─── Infrastructure ───────────────────────────────────────────────────
import { db } from '@/core/db/index.ts';

// ─── Repositories ────────────────────────────────────────────────────
import { UserRepository } from '@modules/users/users.repository.ts';
import { RolesRepository } from '@modules/roles/roles.repository.ts';
import { ClinicsRepository } from '@modules/clinics/clinics.repository.ts';
import { UserInvitationsRepository } from '@modules/auth/userInvitations.repository.ts';
import { UserSessionsRepository } from '@modules/auth/userSessions.repository.ts';


// ─── Services ---
import { AuthService } from '@modules/auth/auth.service.ts';
import { AuthController } from '@modules/auth/auth.controller.ts';
import { ClinicService } from '@modules/clinics/clinics.service.ts';


// ─── Instance Construction ───────────────────────────────────────────────────

// 1. Instanciar Repositorios 
export const userRepository = new UserRepository(db);
export const rolesRepository = new RolesRepository(db);
export const clinicsRepository = new ClinicsRepository(db);
export const userInvitationsRepository = new UserInvitationsRepository(db);
export const userSessionsRepository = new UserSessionsRepository(db);

// 2. Instanciar Servicios
export const authService = new AuthService(
  userRepository,
  rolesRepository,
  userSessionsRepository,
  userInvitationsRepository,
);

export const clinicService = new ClinicService(clinicsRepository);

// 3. Instanciar Controladores
export const authController = new AuthController(authService);
