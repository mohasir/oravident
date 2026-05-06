import { Router } from 'express';
import { validateSchema } from '@middlewares/validateSchema.ts';
import { guardMiddleware } from '@middlewares/guard.ts';
import { branchSchedulesController } from '@/bootstrap/container.ts';
import {
  createBranchScheduleRequestSchema,
  updateBranchScheduleRequestSchema,
  getBranchSchedulesRequestSchema,
  deleteBranchScheduleRequestSchema,
} from '@modules/branches/schedule/branch_schedules.schema.ts';
import { PERMISSIONS } from '@repo/guards';

// mergeParams allows access to :branchId from the parent branches router
const router: Router = Router({ mergeParams: true });

router.get(
  '/',
  guardMiddleware([PERMISSIONS.LIST_SCHEDULE]),
  validateSchema(getBranchSchedulesRequestSchema),
  branchSchedulesController.getSchedules,
);

router.post(
  '/',
  guardMiddleware([PERMISSIONS.CREATE_SCHEDULE]),
  validateSchema(createBranchScheduleRequestSchema),
  branchSchedulesController.createSchedule,
);

router.patch(
  '/:scheduleId',
  guardMiddleware([PERMISSIONS.UPDATE_SCHEDULE]),
  validateSchema(updateBranchScheduleRequestSchema),
  branchSchedulesController.updateSchedule,
);

router.delete(
  '/:scheduleId',
  guardMiddleware([PERMISSIONS.DELETE_SCHEDULE]),
  validateSchema(deleteBranchScheduleRequestSchema),
  branchSchedulesController.deleteSchedule,
);

export default router;
