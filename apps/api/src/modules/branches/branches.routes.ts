import { Router } from 'express';
import { validateSchema } from '@middlewares/validateSchema.ts';
import { protect } from '@middlewares/protect.ts';
import { guardMiddleware } from '@middlewares/guard.ts';
import { branchesController } from '@/bootstrap/container.ts';
import {
  createBranchRequestSchema,
  updateBranchRequestSchema,
  getBranchesRequestSchema,
  getBranchRequestSchema,
} from '@modules/branches/branches.schema.ts';
import { PERMISSIONS } from '@repo/guards';
import { idParamRequest } from '@common/types/requests.ts';

const router: Router = Router();

router.use(protect);

router.get(
  '/',
  guardMiddleware([PERMISSIONS.LIST_CLINIC]),
  validateSchema(getBranchesRequestSchema),
  branchesController.getBranches,
);

router.post(
  '/',
  guardMiddleware([PERMISSIONS.CREATE_CLINIC]),
  validateSchema(createBranchRequestSchema),
  branchesController.createBranch,
);

router.get(
  '/:id',
  guardMiddleware([PERMISSIONS.GET_CLINIC]),
  validateSchema(getBranchRequestSchema),
  branchesController.getBranch,
);

router.patch(
  '/:id',
  guardMiddleware([PERMISSIONS.UPDATE_CLINIC]),
  validateSchema(updateBranchRequestSchema),
  branchesController.updateBranch,
);

router.delete(
  '/:id',
  guardMiddleware([PERMISSIONS.DELETE_CLINIC]),
  validateSchema(idParamRequest),
  branchesController.deleteBranch,
);

export default router;
