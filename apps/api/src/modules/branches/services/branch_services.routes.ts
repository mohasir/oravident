import { Router } from 'express';
import { validateSchema } from '@middlewares/validateSchema.ts';
import { guardMiddleware } from '@middlewares/guard.ts';
import { branchServicesController } from '@/bootstrap/container.ts';
import {
  getBranchServicesRequestSchema,
  upsertBranchServiceRequestSchema,
  deleteBranchServiceRequestSchema,
} from './branch_services.schema.ts';
import { PERMISSIONS } from '@repo/guards';

const router: Router = Router({ mergeParams: true });

router.get(
  '/',
  guardMiddleware([PERMISSIONS.LIST_SERVICE]),
  validateSchema(getBranchServicesRequestSchema),
  branchServicesController.getOverrides,
);

router.put(
  '/:serviceId',
  guardMiddleware([PERMISSIONS.UPDATE_SERVICE]),
  validateSchema(upsertBranchServiceRequestSchema),
  branchServicesController.upsertOverride,
);

router.delete(
  '/:serviceId',
  guardMiddleware([PERMISSIONS.UPDATE_SERVICE]),
  validateSchema(deleteBranchServiceRequestSchema),
  branchServicesController.removeOverride,
);

export default router;