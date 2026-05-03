import NextAuth, { NextAuthOptions, getServerSession } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { loginWithCredentials, getMeProfile } from '@/lib/services/auth.service';
import { normalizePermissions } from '@/lib/authorization/permissions.map';
import '@/lib/auth/auth.types';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        try {
          const authData = await loginWithCredentials(credentials.email, credentials.password);
          if (!authData?.accessToken) return null;

          const profile = await getMeProfile(authData.accessToken);
          if (!profile) return null;

          const roles = profile.roles?.map((r) => r.name) ?? [];
          const rawPermissions = [
            ...new Set(
              profile.roles?.flatMap((r) => r.permissions.map((p) => p.code)) ?? [],
            ),
          ];
          const isSuperadmin = profile.super_admin ?? false;

          return {
            id: profile.id,
            name: `${profile.profile.first_name} ${profile.profile.last_name}`.trim() || profile.username,
            email: credentials.email,
            accessToken: authData.accessToken,
            refreshToken: authData.refreshToken,
            roles,
            permissions: rawPermissions,
            isSuperadmin,
          };
        } catch {
          throw new Error('unauthorized');
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id           = user.id;
        token.accessToken  = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.roles        = user.roles;
        token.isSuperadmin = user.isSuperadmin;
        token.permissions  = normalizePermissions(user.permissions ?? []);
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id           = token.id as string;
        session.user.accessToken  = token.accessToken;
        session.user.roles        = token.roles;
        session.user.isSuperadmin = token.isSuperadmin;
        session.user.permissions  = token.permissions;
      }
      return session;
    }
  },
};

const handler = NextAuth(authOptions);

export const handlers = { GET: handler, POST: handler };

export const auth = () => getServerSession(authOptions);
