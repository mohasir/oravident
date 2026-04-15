import { authMiddleware } from './auth.ts';
import { tenantMiddleware } from './tenant.ts';

export const protect = [authMiddleware, tenantMiddleware];
