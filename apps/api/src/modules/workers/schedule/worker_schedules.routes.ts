import { Router } from 'express';
import { validateSchema } from '@middlewares/validateSchema.ts';
import { guardMiddleware } from '@middlewares/guard.ts';
import { workerSchedulesController } from '@/bootstrap/container.ts';
import {
  createWorkerScheduleRequestSchema,
  updateWorkerScheduleRequestSchema,
  getWorkerSchedulesRequestSchema,
  deleteWorkerScheduleRequestSchema,
} from './worker_schedules.schema.ts';
import { PERMISSIONS } from '@repo/guards';

const router: Router = Router({ mergeParams: true });

router.get(
  '/',
  guardMiddleware([PERMISSIONS.LIST_SCHEDULE]),
  validateSchema(getWorkerSchedulesRequestSchema),
  workerSchedulesController.getSchedules,
);

router.post(
  '/',
  guardMiddleware([PERMISSIONS.CREATE_SCHEDULE]),
  validateSchema(createWorkerScheduleRequestSchema),
  workerSchedulesController.createSchedule,
);

router.patch(
  '/:scheduleId',
  guardMiddleware([PERMISSIONS.UPDATE_SCHEDULE]),
  validateSchema(updateWorkerScheduleRequestSchema),
  workerSchedulesController.updateSchedule,
);

router.delete(
  '/:scheduleId',
  guardMiddleware([PERMISSIONS.DELETE_SCHEDULE]),
  validateSchema(deleteWorkerScheduleRequestSchema),
  workerSchedulesController.deleteSchedule,
);

export default router;