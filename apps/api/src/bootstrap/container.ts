/**
 * Composition Root
 *
 */

// ─── Infrastructure ───────────────────────────────────────────────────
import { db } from '@/core/db/index.ts';

import { DrizzleTransactionManager } from '@/core/db/TransactionManager.ts';

// ─── Repositories ────────────────────────────────────────────────────
import { UserRepository } from '@modules/users/users.repository.ts';
import { RolesRepository } from '@modules/roles/roles.repository.ts';
import { ClinicsRepository } from '@modules/clinics/clinics.repository.ts';
import { UserInvitationsRepository } from '@modules/userInvitations/userInvitations.repository.ts';
import { UserSessionsRepository } from '@modules/auth/userSessions.repository.ts';
import { AuthRepository } from '@modules/auth/auth.repository.ts';
import { UserPasswordResetsRepository } from '@modules/auth/userPasswordResets.repository.ts';
import { WorkersRepository } from '@modules/workers/workers.repository.ts';

// ─── Services ---
import { RolesService } from '@modules/roles/roles.service.ts';
import { RolesController } from '@modules/roles/roles.controller.ts';
import { AuthService } from '@modules/auth/auth.service.ts';
import { AuthController } from '@modules/auth/auth.controller.ts';
import { ClinicsController } from '@modules/clinics/clinics.controller.ts';
import { ClinicsService } from '@modules/clinics/clinics.service.ts';
import { UserInvitationsService } from '@modules/userInvitations/userInvitations.service.ts';
import { UserInvitationsController } from '@modules/userInvitations/userInvitations.controller.ts';
import { WorkersService } from '@modules/workers/workers.service.ts';
import { WorkersController } from '@modules/workers/workers.controller.ts';

// ─── Instance Construction ───────────────────────────────────────────────────

export const transactionManager = new DrizzleTransactionManager(db);

// Instanciar Repositorios
export const userRepository = new UserRepository(db);
export const rolesRepository = new RolesRepository(db);
export const clinicsRepository = new ClinicsRepository(db);
export const userInvitationsRepository = new UserInvitationsRepository(db);
export const userSessionsRepository = new UserSessionsRepository(db);
export const authRepository = new AuthRepository(db);
export const userPasswordResetsRepository = new UserPasswordResetsRepository(
  db,
);
export const workersRepository = new WorkersRepository(db);

// Instanciar Servicios
export const authService = new AuthService(
  transactionManager,
  userRepository,
  authRepository,
  userSessionsRepository,
  userPasswordResetsRepository,
);

export const userInvitationsService = new UserInvitationsService(
  transactionManager,
  userInvitationsRepository,
  authRepository,
  rolesRepository,
);

export const clinicService = new ClinicsService(clinicsRepository);
export const workersService = new WorkersService(workersRepository);
export const rolesService = new RolesService(rolesRepository);

// Instanciar Controladores
export const authController = new AuthController(authService);
export const userInvitationsController = new UserInvitationsController(
  userInvitationsService,
);
export const workersController = new WorkersController(workersService);
export const clinicsController = new ClinicsController(clinicService);
export const rolesController = new RolesController(rolesService);
