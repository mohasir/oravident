import { Router } from 'express';
import { workersController } from '@/bootstrap/container.ts';
import { validateSchema } from '@middlewares/validateSchema.ts';
import { guardMiddleware } from '@middlewares/guard.ts';
import { PERMISSIONS } from '@repo/guards';
import {
  createWorkerRequestSchema,
  updateWorkerRequestSchema,
  getWorkerRequestSchema,
  getWorkersRequestSchema,
} from '@modules/workers/workers.schema.ts';
import { protect } from '@middlewares/protect.ts';

const router: Router = Router();

router.use(protect);

router.post(
  '/',
  guardMiddleware([PERMISSIONS.CREATE_WORKER]),
  validateSchema(createWorkerRequestSchema),
  workersController.createWorker,
);

router.get(
  '/',
  guardMiddleware([PERMISSIONS.LIST_WORKER]),
  validateSchema(getWorkersRequestSchema),
  workersController.getWorkers,
);

router.get(
  '/:id',
  guardMiddleware([PERMISSIONS.GET_WORKER]),
  validateSchema(getWorkerRequestSchema),
  workersController.getWorker,
);

router.patch(
  '/:id',
  guardMiddleware([PERMISSIONS.UPDATE_WORKER]),
  validateSchema(updateWorkerRequestSchema),
  workersController.updateWorker,
);

router.delete(
  '/:id',
  guardMiddleware([PERMISSIONS.DELETE_WORKER]),
  validateSchema(getWorkerRequestSchema),
  workersController.deleteWorker,
);

export default router;
