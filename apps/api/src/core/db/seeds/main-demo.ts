import { db } from '../index.ts';
import {
  clinics,
  services,
  branches,
  users,
  workers,
  roles,
  branchSchedules,
  workerBranches,
  workerSchedules,
  branchServices,
} from '../schema/index.ts';
import {
  DEMO_CLINIC,
  DEMO_SERVICES,
  DEMO_BRANCH,
  DEMO_USERS,
  DEMO_BRANCH_SCHEDULES,
  DEMO_WORKER_SCHEDULES,
  DEMO_IDS,
} from './fixtures/demo-data.ts';
import { isNull } from 'drizzle-orm';
import { ROLES } from '@repo/guards';
import bcrypt from 'bcryptjs';

export async function seedMainDemo() {
  console.log('🏥 Seeding Complete Demo Environment...');

  const existingClinic = await db.query.clinics.findFirst();
  if (existingClinic) {
    console.log('⚠️ Demo clinic already exists, skipping...');
    return;
  }

  const globalRoles = await db
    .select()
    .from(roles)
    .where(isNull(roles.clinicId));
  const requiredRoles = [ROLES.ADMIN, ROLES.DOCTOR, ROLES.RECEPTIONIST];
  const missingRoles = requiredRoles.filter(
    (roleName) => !globalRoles.some((r) => r.name === roleName),
  );

  if (missingRoles.length > 0) {
    throw new Error(
      `⚠️ You must run the Roles seeder first! Missing system roles: ${missingRoles.join(', ')}`,
    );
  }

  // 🛡️ All or nothing transaction for parent-child relationship
  await db.transaction(async (tx) => {
    // 1. Clinic
    const [clinic] = await tx
      .insert(clinics)
      .values({
        id: DEMO_IDS.CLINIC,
        ...DEMO_CLINIC,
      })
      .returning();
    if (!clinic) throw new Error('Failed to insert Demo Clinic');

    // 2. Branch
    const [branch] = await tx
      .insert(branches)
      .values({
        id: DEMO_IDS.BRANCH,
        ...DEMO_BRANCH,
        clinicId: clinic.id,
      })
      .returning();
    if (!branch) throw new Error('Failed to insert Demo Branch');

    // 3. Branch Schedules
    const mappedBranchSchedules = DEMO_BRANCH_SCHEDULES.map((sc) => ({
      ...sc,
      clinicId: clinic.id,
      branchId: branch.id,
    }));
    await tx.insert(branchSchedules).values(mappedBranchSchedules);

    // 4. Users & Workers
    const usersToCreate = [
      {
        ...DEMO_USERS[0],
        id: DEMO_IDS.USER_ADMIN,
        workerId: DEMO_IDS.WORKER_ADMIN,
      },
      {
        ...DEMO_USERS[1],
        id: DEMO_IDS.USER_DOCTOR,
        workerId: DEMO_IDS.WORKER_DOCTOR,
      },
      {
        ...DEMO_USERS[2],
        id: DEMO_IDS.USER_RECEPTION,
        workerId: DEMO_IDS.WORKER_RECEPTION,
      },
    ];

    for (const userData of usersToCreate) {
      const { id, workerId, metadata, password, email } = userData;

      const hashedPassword = await bcrypt.hash(password, 10);

      const [user] = await tx
        .insert(users)
        .values({
          id,
          email,
          passwordHash: hashedPassword,
        })
        .returning();

      if (!user) throw new Error(`Failed to insert User: ${userData.email}`);

      const targetRole = globalRoles.find((r) => r.name === metadata.roleName);

      const [worker] = await tx
        .insert(workers)
        .values({
          id: workerId,
          clinicId: clinic.id,
          userId: user.id,
          roleId: targetRole!.id,
          firstName: metadata.firstName,
          lastName: metadata.lastName,
          phone: metadata.phone,
          gender: metadata.gender,
          prefix: metadata.prefix,
          specialty: metadata.specialty,
        })
        .returning();
      if (!worker)
        throw new Error(`Failed to insert Worker for user: ${userData.email}`);

      await tx.insert(workerBranches).values({
        clinicId: clinic.id,
        workerId: worker.id,
        branchId: branch.id,
        isPrimary: true,
      });

      const mappedWorkerSchedules = DEMO_WORKER_SCHEDULES.map((ws) => ({
        ...ws,
        clinicId: clinic.id,
        workerId: worker.id,
        branchId: branch.id,
      }));
      await tx.insert(workerSchedules).values(mappedWorkerSchedules);
    }

    // 5. Services
    const servicesWithClinicId = DEMO_SERVICES.map((service) => ({
      ...service,
      clinicId: clinic.id,
    }));
    const insertedServices = await tx
      .insert(services)
      .values(servicesWithClinicId)
      .returning();

    // 6. Branch Services
    const branchServicesMap = insertedServices.map((srv) => ({
      clinicId: clinic.id,
      branchId: branch.id,
      serviceId: srv.id,
    }));
    await tx.insert(branchServices).values(branchServicesMap);

    console.log(
      `✅ Demo Foundation seeded successfully (Clinic, Branch, Workers, Schedules & Services)!`,
    );
    console.log(`👉 Login emails created:`);
    DEMO_USERS.forEach((u) => console.log(`  - ${u.email}`));
  });
}
