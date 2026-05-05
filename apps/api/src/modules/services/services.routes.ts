import { Router } from 'express';
import { servicesController } from '@/bootstrap/container.ts';
import { validateSchema } from '@middlewares/validateSchema.ts';
import { guardMiddleware, roleGuardMiddleware } from '@middlewares/guard.ts';
import { PERMISSIONS, ROLES } from '@repo/guards';
import {
  createServiceRequestSchema,
  createServiceSuperadminRequestSchema,
  updateServiceRequestSchema,
  getServiceRequestSchema,
  getServicesRequestSchema,
  deleteServiceRequestSchema,
} from '@modules/services/services.schema.ts';
import { protect } from '@middlewares/protect.ts';

const router: Router = Router();

router.use(protect);

router.post(
  '/',
  guardMiddleware([PERMISSIONS.CREATE_SERVICE]),
  validateSchema(createServiceRequestSchema),
  servicesController.createService,
);

router.post(
  '/clinic/:clinicId',
  roleGuardMiddleware([ROLES.SUPERADMIN]),
  validateSchema(createServiceSuperadminRequestSchema),
  servicesController.createServiceForSuperadmin,
);

router.get(
  '/',
  guardMiddleware([PERMISSIONS.LIST_SERVICE]),
  validateSchema(getServicesRequestSchema),
  servicesController.getServices,
);

router.get(
  '/:id',
  guardMiddleware([PERMISSIONS.GET_SERVICE]),
  validateSchema(getServiceRequestSchema),
  servicesController.getService,
);

router.patch(
  '/:id',
  guardMiddleware([PERMISSIONS.UPDATE_SERVICE]),
  validateSchema(updateServiceRequestSchema),
  servicesController.updateService,
);

router.delete(
  '/:id',
  guardMiddleware([PERMISSIONS.DELETE_SERVICE]),
  validateSchema(deleteServiceRequestSchema),
  servicesController.deleteService,
);

export default router;
