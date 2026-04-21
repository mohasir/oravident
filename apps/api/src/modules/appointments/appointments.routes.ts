import { Router } from 'express';
import { appointmentsController } from '@/bootstrap/container.ts';
import { validateSchema } from '@middlewares/validateSchema.ts';
import { guardMiddleware } from '@middlewares/guard.ts';
import { PERMISSIONS } from '@repo/guards';
import {
  createAppointmentRequestSchema,
  updateAppointmentRequestSchema,
  getAppointmentRequestSchema,
  getAppointmentsRequestSchema,
  deleteAppointmentRequestSchema,
  cancelAppointmentRequestSchema,
} from '@modules/appointments/appointments.schema.ts';
import { protect } from '@middlewares/protect.ts';

const router: Router = Router();

router.use(protect);

router.post(
  '/',
  guardMiddleware([PERMISSIONS.CREATE_APPOINTMENT]),
  validateSchema(createAppointmentRequestSchema),
  appointmentsController.createAppointment,
);

router.get(
  '/',
  guardMiddleware([PERMISSIONS.LIST_APPOINTMENT]),
  validateSchema(getAppointmentsRequestSchema),
  appointmentsController.getAppointments,
);

router.get(
  '/:id',
  guardMiddleware([PERMISSIONS.GET_APPOINTMENT]),
  validateSchema(getAppointmentRequestSchema),
  appointmentsController.getAppointment,
);

router.patch(
  '/:id',
  guardMiddleware([PERMISSIONS.UPDATE_APPOINTMENT]),
  validateSchema(updateAppointmentRequestSchema),
  appointmentsController.updateAppointment,
);

router.patch(
  '/:id/cancel',
  guardMiddleware([PERMISSIONS.UPDATE_APPOINTMENT]),
  validateSchema(cancelAppointmentRequestSchema),
  appointmentsController.cancelAppointment,
);

router.delete(
  '/:id',
  guardMiddleware([PERMISSIONS.DELETE_APPOINTMENT]),
  validateSchema(deleteAppointmentRequestSchema),
  appointmentsController.deleteAppointment,
);

export default router;
