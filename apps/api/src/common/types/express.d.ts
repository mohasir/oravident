declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        roleId: string;
      }
      tenant?: {
        id: string;
      };
    }
  }
}

export {}