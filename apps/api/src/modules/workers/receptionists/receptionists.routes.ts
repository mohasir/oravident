import { Router } from 'express';
import { receptionistsController } from '@/bootstrap/container.ts';
import { protect } from '@middlewares/protect.ts';
import { guardMiddleware } from '@middlewares/guard.ts';
import { validateSchema } from '@middlewares/validateSchema.ts';
import { PERMISSIONS } from '@repo/guards';
import {
  createReceptionistRequestSchema,
  updateReceptionistRequestSchema,
  getReceptionistRequestSchema,
  getReceptionistsRequestSchema,
} from './receptionists.schema.ts';
import { idParamRequest } from '@common/types/requests.ts';

const router: Router = Router();

router.use(protect);

router.get(
  '/',
  guardMiddleware([PERMISSIONS.LIST_WORKER]),
  validateSchema(getReceptionistsRequestSchema),
  receptionistsController.getReceptionists,
);

router.get(
  '/:id',
  guardMiddleware([PERMISSIONS.GET_WORKER]),
  validateSchema(getReceptionistRequestSchema),
  receptionistsController.getReceptionist,
);

router.post(
  '/',
  guardMiddleware([PERMISSIONS.CREATE_WORKER]),
  validateSchema(createReceptionistRequestSchema),
  receptionistsController.createReceptionist,
);

router.patch(
  '/:id',
  guardMiddleware([PERMISSIONS.UPDATE_WORKER]),
  validateSchema(updateReceptionistRequestSchema),
  receptionistsController.updateReceptionist,
);

router.delete(
  '/:id',
  guardMiddleware([PERMISSIONS.DELETE_WORKER]),
  validateSchema(idParamRequest),
  receptionistsController.deleteReceptionist,
);

export default router;
