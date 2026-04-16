import { PayloadAccessToken } from "../utils/jwt.ts";

declare global {
  namespace Express {
    interface Request {
      user?: {
        token: PayloadAccessToken;
        clinicId?: string;
      }
    }
  }
}

export {}