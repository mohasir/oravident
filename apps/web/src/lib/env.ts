function requireServerEnv(key: string): string {
  if (typeof window !== 'undefined') return '';
  const value = process.env[key];
  if (!value) throw new Error(`Missing required server environment variable: ${key}`);
  return value;
}

function requirePublicEnv(value: string | undefined, name: string): string {
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

export const ENV = {
  isDemoMode: process.env.NEXT_PUBLIC_DEMO_MODE === 'true',
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
  apiUrl: requirePublicEnv(process.env.NEXT_PUBLIC_API_URL, 'NEXT_PUBLIC_API_URL'),
  serverApiUrl: requireServerEnv('API_URL'),
  authSecret: requireServerEnv('AUTH_SECRET'),
} as const;
