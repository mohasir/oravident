import { Router } from 'express';
import authRoutes from '@modules/auth/auth.routes.ts';
import userInvitationsRoutes from '@modules/userInvitations/userInvitations.routes.ts';
import clinicRoutes from '@modules/clinics/clinics.routes.ts';
import roleRoutes from '@modules/roles/roles.routes.ts';
import servicesRoutes from '@modules/services/services.routes.ts';
import workersRoutes from '@modules/workers/workers.route.ts';
import branchesRoutes from '@modules/branches/branches.routes.ts';
import usersRoutes from '@modules/users/users.routes.ts';
import patientsRoutes from '@modules/patients/patients.routes.ts';
import appointmentsRoutes from '@modules/appointments/appointments.routes.ts';

const v1Router: Router = Router();

v1Router.use('/auth', authRoutes);
v1Router.use('/invitations', userInvitationsRoutes);
v1Router.use('/users', usersRoutes);
v1Router.use('/clinics', clinicRoutes);
v1Router.use('/roles', roleRoutes);
v1Router.use('/services', servicesRoutes);
v1Router.use('/workers', workersRoutes);
v1Router.use('/branches', branchesRoutes);
v1Router.use('/patients', patientsRoutes);
v1Router.use('/appointments', appointmentsRoutes);

export default v1Router;
