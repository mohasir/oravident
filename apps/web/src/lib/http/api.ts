import { ENV } from '@/lib/env';
import axios from 'axios';

export const PUBLIC_API = axios.create({
  baseURL: ENV.apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const PROTECTED_API = axios.create({
  baseURL: ENV.apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

/* PROTECTED_API.interceptors.request.use(async (config) => {
  let token: string | undefined = undefined;

  if (typeof window === 'undefined') {
    const { auth } = await import('@/lib/auth/auth');
    const session = await auth();
    token = (session?.user as any)?.accessToken;
  } else {
    const { getSession } = await import('next-auth/react');
    const session = await getSession();
    token = (session?.user as any)?.accessToken;
  }

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

PROTECTED_API.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        const { signOut } = await import('next-auth/react');
        await signOut({ callbackUrl: window.location.pathname });
      }
    }
    return Promise.reject(error);
  },
); */
