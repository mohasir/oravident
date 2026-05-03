import type { DefaultSession } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import type { PermissionCode } from '@/lib/authorization/data/permissions';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string | number;
      roles: string[];
      permissions: PermissionCode[];
      isSuperadmin: boolean;
      accessToken: string;
    } & DefaultSession['user'];
  }

  interface User {
    id: string | number;
    accessToken: string;
    refreshToken: string;
    roles: string[];
    permissions: string[];
    isSuperadmin: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken: string;
    refreshToken: string;
    roles: string[];
    permissions: PermissionCode[];
    isSuperadmin: boolean;
  }
}
