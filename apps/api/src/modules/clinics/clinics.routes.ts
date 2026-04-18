import { Router } from 'express';
import { validateSchema } from '@/middlewares/validateSchema.ts';
import { protect } from '@/middlewares/protect.ts';
import { guardMiddleware } from '@/middlewares/guard.ts';
import { clinicsController } from '@/bootstrap/container.ts';
import {
  createClinicRequestSchema,
  updateClinicRequestSchema,
  getClinicsRequestSchema,
  getClinicRequestSchema,
} from './clinics.schema.ts';
import { PERMISSIONS } from '@repo/guards';
import { idParamRequest } from '@/common/types/requests.ts';

const router: Router = Router();

// --- Protected Routes (Clinic Management) ---
router.use(protect);

router.get(
  '/',
  guardMiddleware([PERMISSIONS.LIST_CLINIC]),
  validateSchema(getClinicsRequestSchema),
  clinicsController.getClinics,
);

router.post(
  '/',
  guardMiddleware([PERMISSIONS.CREATE_CLINIC]),
  validateSchema(createClinicRequestSchema),
  clinicsController.createClinic,
);

router.get(
  '/:id',
  guardMiddleware([PERMISSIONS.GET_CLINIC]),
  validateSchema(getClinicRequestSchema),
  clinicsController.getClinic,
);

router.patch(
  '/:id',
  guardMiddleware([PERMISSIONS.UPDATE_CLINIC]),
  validateSchema(updateClinicRequestSchema),
  clinicsController.updateClinic,
);

router.delete(
  '/:id',
  guardMiddleware([PERMISSIONS.DELETE_CLINIC]),
  validateSchema(idParamRequest),
  clinicsController.deleteClinic,
);

export default router;
