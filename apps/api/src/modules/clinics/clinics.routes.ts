import { Router } from 'express';
import { validateSchema } from '@/middlewares/validateSchema.ts';
import { protect } from '@/middlewares/protect.ts';
import { clinicsController } from '@/bootstrap/container.ts';
import { createClinicSchema } from './clinics.schema.ts';

const router: Router = Router();

// --- Public Routes ---
// (None for now or createClinic could be public depending on the flow)
router.post('/', validateSchema(createClinicSchema), (req, res) => clinicsController.createClinic(req, res));

// --- Protected Routes ---
router.use(protect);

router.get('/:id', (req, res) => clinicsController.getClinic(req, res));

export default router;
