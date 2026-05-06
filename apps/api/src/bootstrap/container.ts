/**
 * Composition Root
 *
 */

// ─── Infrastructure ───────────────────────────────────────────────────
import { db } from '@core/db/index.ts';

import { DrizzleTransactionManager } from '@core/db/TransactionManager.ts';

// ─── Repositories ────────────────────────────────────────────────────
import { UserRepository } from '@modules/users/users.repository.ts';
import { RolesRepository } from '@modules/roles/roles.repository.ts';
import { ClinicsRepository } from '@modules/clinics/clinics.repository.ts';
import { UserInvitationsRepository } from '@modules/userInvitations/userInvitations.repository.ts';
import { UserSessionsRepository } from '@modules/auth/userSessions.repository.ts';
import { AuthRepository } from '@modules/auth/auth.repository.ts';
import { UserPasswordResetsRepository } from '@modules/auth/userPasswordResets.repository.ts';
import { WorkersRepository } from '@modules/workers/workers.repository.ts';
import { ServicesRepository } from '@modules/services/services.repository.ts';
import { BranchesRepository } from '@modules/branches/branches.repository.ts';
import { BranchSchedulesRepository } from '@modules/branches/schedule/branch_schedules.repository.ts';
import { BranchServicesRepository } from '@modules/branches/services/branch_services.repository.ts';
import { PatientsRepository } from '@modules/patients/patients.repository.ts';
import { AppointmentsRepository } from '@modules/appointments/appointments.repository.ts';
import { WorkerSchedulesRepository } from '@modules/workers/schedule/worker_schedules.repository.ts';
import { ScheduleBlocksRepository } from '@modules/workers/blocks/schedule_blocks.repository.ts';

// ─── Services ---
import { UsersService } from '@modules/users/users.service.ts';
import { UsersController } from '@modules/users/users.controller.ts';
import { RolesService } from '@modules/roles/roles.service.ts';
import { RolesController } from '@modules/roles/roles.controller.ts';
import { AuthService } from '@modules/auth/auth.service.ts';
import { AuthController } from '@modules/auth/auth.controller.ts';
import { ClinicsController } from '@modules/clinics/clinics.controller.ts';
import { ClinicsService } from '@modules/clinics/clinics.service.ts';
import { UserInvitationsService } from '@modules/userInvitations/userInvitations.service.ts';
import { UserInvitationsController } from '@modules/userInvitations/userInvitations.controller.ts';
import { DoctorsService } from '@modules/workers/doctors/doctors.service.ts';
import { DoctorsController } from '@modules/workers/doctors/doctors.controller.ts';
import { ReceptionistsService } from '@modules/workers/receptionists/receptionists.service.ts';
import { ReceptionistsController } from '@modules/workers/receptionists/receptionists.controller.ts';
import { WorkerSchedulesService } from '@modules/workers/schedule/worker_schedules.service.ts';
import { WorkerSchedulesController } from '@modules/workers/schedule/worker_schedules.controller.ts';
import { ScheduleBlocksService } from '@modules/workers/blocks/schedule_blocks.service.ts';
import { ScheduleBlocksController } from '@modules/workers/blocks/schedule_blocks.controller.ts';
import { ServicesService } from '@modules/services/services.service.ts';
import { ServicesController } from '@modules/services/services.controller.ts';
import { BranchesService } from '@modules/branches/branches.service.ts';
import { BranchesController } from '@modules/branches/branches.controller.ts';
import { BranchSchedulesService } from '@modules/branches/schedule/branch_schedules.service.ts';
import { BranchSchedulesController } from '@modules/branches/schedule/branch_schedules.controller.ts';
import { BranchServicesService } from '@modules/branches/services/branch_services.service.ts';
import { BranchServicesController } from '@modules/branches/services/branch_services.controller.ts';
import { PatientsService } from '@modules/patients/patients.service.ts';
import { PatientsController } from '@modules/patients/patients.controller.ts';
import { AppointmentsService } from '@modules/appointments/appointments.service.ts';
import { AppointmentsController } from '@modules/appointments/appointments.controller.ts';

// ─── Instance Construction ───────────────────────────────────────────────────

export const transactionManager = new DrizzleTransactionManager(db);

// Instanciar Repositorios
export const userRepository = new UserRepository(db);
export const rolesRepository = new RolesRepository(db);
export const clinicsRepository = new ClinicsRepository(db);
export const userInvitationsRepository = new UserInvitationsRepository(db);
export const userSessionsRepository = new UserSessionsRepository(db);
export const authRepository = new AuthRepository(db);
export const userPasswordResetsRepository = new UserPasswordResetsRepository(db);
export const workersRepository = new WorkersRepository(db);
export const servicesRepository = new ServicesRepository(db);
export const branchesRepository = new BranchesRepository(db);
export const branchSchedulesRepository = new BranchSchedulesRepository(db);
export const branchServicesRepository = new BranchServicesRepository(db);
export const patientsRepository = new PatientsRepository(db);
export const appointmentsRepository = new AppointmentsRepository(db);
export const workerSchedulesRepository = new WorkerSchedulesRepository(db);
export const scheduleBlocksRepository = new ScheduleBlocksRepository(db);

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
export const usersService = new UsersService(userRepository);
export const doctorsService = new DoctorsService(workersRepository, rolesRepository);
export const receptionistsService = new ReceptionistsService(workersRepository, rolesRepository);
export const workerSchedulesService = new WorkerSchedulesService(workerSchedulesRepository, workersRepository);
export const scheduleBlocksService = new ScheduleBlocksService(scheduleBlocksRepository, workersRepository);
export const rolesService = new RolesService(rolesRepository);
export const servicesService = new ServicesService(servicesRepository);
export const branchesService = new BranchesService(
  branchesRepository,
  branchSchedulesRepository,
  transactionManager,
);
export const branchSchedulesService = new BranchSchedulesService(
  branchSchedulesRepository,
  branchesRepository,
);
export const branchServicesService = new BranchServicesService(
  branchServicesRepository,
  branchesRepository,
  servicesRepository,
);
export const patientsService = new PatientsService(patientsRepository, branchesRepository);
export const appointmentsService = new AppointmentsService(
  appointmentsRepository,
  branchesRepository,
  workersRepository,
  patientsRepository,
  servicesRepository,
  workerSchedulesRepository,
  scheduleBlocksRepository,
  branchSchedulesRepository,
  branchServicesRepository,
);

// Instanciar Controladores
export const authController = new AuthController(authService);
export const userInvitationsController = new UserInvitationsController(userInvitationsService);
export const usersController = new UsersController(usersService);
export const doctorsController = new DoctorsController(doctorsService);
export const receptionistsController = new ReceptionistsController(receptionistsService);
export const workerSchedulesController = new WorkerSchedulesController(workerSchedulesService);
export const scheduleBlocksController = new ScheduleBlocksController(scheduleBlocksService);
export const clinicsController = new ClinicsController(clinicService);
export const rolesController = new RolesController(rolesService);
export const servicesController = new ServicesController(servicesService);
export const branchesController = new BranchesController(branchesService);
export const branchSchedulesController = new BranchSchedulesController(branchSchedulesService);
export const branchServicesController = new BranchServicesController(branchServicesService);
export const patientsController = new PatientsController(patientsService);
export const appointmentsController = new AppointmentsController(appointmentsService);
