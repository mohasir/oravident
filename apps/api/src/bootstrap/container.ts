/**
 * Composition Root
 * 
 */

// --- Repositories ---
import { userRepository } from '@modules/users/users.repository.ts';
import { rolesRepository } from '@modules/roles/roles.repository.ts';
import { clinicsRepository } from '@modules/clinics/clinics.repository.ts';
import { userInvitationsRepository } from '@modules/auth/userInvitations.repository.ts';
import { userSessionsRepository } from '@modules/auth/userSessions.repository.ts';

// --- Services ---
import { AuthService } from '@modules/auth/auth.service.ts';
import { AuthController } from '@modules/auth/auth.controller.ts';
import { ClinicService } from '@modules/clinics/clinics.service.ts';

// ─── Auth ────────────────────────────────────────────────────────────────────
const authService = new AuthService(
  userRepository,
  rolesRepository,
  userSessionsRepository,
  userInvitationsRepository,
);

export const authController = new AuthController(authService);

// ─── Clinics ─────────────────────────────────────────────────────────────────
export const clinicService = new ClinicService(clinicsRepository);
