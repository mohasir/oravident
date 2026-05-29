import { Router } from 'express';
import { doctorsController } from '@/bootstrap/container.ts';
import { protect } from '@middlewares/protect.ts';
import { guardMiddleware } from '@middlewares/guard.ts';
import { validateSchema } from '@middlewares/validateSchema.ts';
import { PERMISSIONS } from '@repo/guards';
import {
  createDoctorRequestSchema,
  updateDoctorRequestSchema,
  getDoctorRequestSchema,
  getDoctorsRequestSchema,
} from '@modules/workers/doctors/doctors.schema.ts';
import { idParamRequest } from '@common/types/requests.ts';
import workerSchedulesRoutes from '@modules/workers/schedule/worker_schedules.routes.ts';
import scheduleBlocksRoutes from '@modules/workers/blocks/schedule_blocks.routes.ts';

const router: Router = Router();

router.use(protect);

router.get(
  '/',
  guardMiddleware([PERMISSIONS.LIST_WORKER]),
  validateSchema(getDoctorsRequestSchema),
  doctorsController.getDoctors,
);

router.get(
  '/:id',
  guardMiddleware([PERMISSIONS.GET_WORKER]),
  validateSchema(getDoctorRequestSchema),
  doctorsController.getDoctor,
);

router.post(
  '/',
  guardMiddleware([PERMISSIONS.CREATE_WORKER]),
  validateSchema(createDoctorRequestSchema),
  doctorsController.createDoctor,
);

router.patch(
  '/:id',
  guardMiddleware([PERMISSIONS.UPDATE_WORKER]),
  validateSchema(updateDoctorRequestSchema),
  doctorsController.updateDoctor,
);

router.delete(
  '/:id',
  guardMiddleware([PERMISSIONS.DELETE_WORKER]),
  validateSchema(idParamRequest),
  doctorsController.deleteDoctor,
);

router.use('/:workerId/schedules', workerSchedulesRoutes);
router.use('/:workerId/blocks', scheduleBlocksRoutes);

export default router;
