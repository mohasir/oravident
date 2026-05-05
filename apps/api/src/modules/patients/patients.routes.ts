import { Router } from 'express';
import { patientsController } from '@/bootstrap/container.ts';
import { validateSchema } from '@middlewares/validateSchema.ts';
import { guardMiddleware, roleGuardMiddleware } from '@middlewares/guard.ts';
import { PERMISSIONS, ROLES } from '@repo/guards';
import {
  createPatientRequestSchema,
  createPatientSuperadminRequestSchema,
  updatePatientRequestSchema,
  getPatientRequestSchema,
  getPatientsRequestSchema,
  deletePatientRequestSchema,
} from '@modules/patients/patients.schema.ts';
import { protect } from '@middlewares/protect.ts';

const router: Router = Router();

router.use(protect);

router.post(
  '/',
  guardMiddleware([PERMISSIONS.CREATE_PATIENT]),
  validateSchema(createPatientRequestSchema),
  patientsController.createPatient,
);

router.post(
  '/clinic/:clinicId',
  roleGuardMiddleware([ROLES.SUPERADMIN]),
  validateSchema(createPatientSuperadminRequestSchema),
  patientsController.createPatientForSuperadmin,
);

router.get(
  '/',
  guardMiddleware([PERMISSIONS.LIST_PATIENT]),
  validateSchema(getPatientsRequestSchema),
  patientsController.getPatients,
);

router.get(
  '/:id',
  guardMiddleware([PERMISSIONS.GET_PATIENT]),
  validateSchema(getPatientRequestSchema),
  patientsController.getPatient,
);

router.patch(
  '/:id',
  guardMiddleware([PERMISSIONS.UPDATE_PATIENT]),
  validateSchema(updatePatientRequestSchema),
  patientsController.updatePatient,
);

router.delete(
  '/:id',
  guardMiddleware([PERMISSIONS.DELETE_PATIENT]),
  validateSchema(deletePatientRequestSchema),
  patientsController.deletePatient,
);

export default router;

