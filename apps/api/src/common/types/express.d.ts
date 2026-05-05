import { PayloadAccessToken } from '@common/utils/jwt.ts';

declare global {
  namespace Express {
    interface Request {
      user?: {
        token: PayloadAccessToken;
        clinicId?: string;
      };
      tenantId?: string | null;
    }
  }
}

export {};
