import { Router } from 'express';
import { validateSchema } from '@middlewares/validateSchema.ts';
import { guardMiddleware } from '@middlewares/guard.ts';
import { scheduleBlocksController } from '@/bootstrap/container.ts';
import {
  createScheduleBlockRequestSchema,
  updateScheduleBlockRequestSchema,
  getScheduleBlocksRequestSchema,
  deleteScheduleBlockRequestSchema,
} from './schedule_blocks.schema.ts';
import { PERMISSIONS } from '@repo/guards';

const router: Router = Router({ mergeParams: true });

router.get(
  '/',
  guardMiddleware([PERMISSIONS.LIST_SCHEDULE]),
  validateSchema(getScheduleBlocksRequestSchema),
  scheduleBlocksController.getBlocks,
);

router.post(
  '/',
  guardMiddleware([PERMISSIONS.CREATE_SCHEDULE]),
  validateSchema(createScheduleBlockRequestSchema),
  scheduleBlocksController.createBlock,
);

router.patch(
  '/:blockId',
  guardMiddleware([PERMISSIONS.UPDATE_SCHEDULE]),
  validateSchema(updateScheduleBlockRequestSchema),
  scheduleBlocksController.updateBlock,
);

router.delete(
  '/:blockId',
  guardMiddleware([PERMISSIONS.DELETE_SCHEDULE]),
  validateSchema(deleteScheduleBlockRequestSchema),
  scheduleBlocksController.deleteBlock,
);

export default router;