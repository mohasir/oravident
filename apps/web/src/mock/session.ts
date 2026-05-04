export interface UserSession {
  name: string;
  email: string;
  avatarUrl?: string;
  role: string;
}

export const MOCK_USER: UserSession = {
  name: 'Dr. John Doe',
  email: 'john.doe@samsoft.com',
  avatarUrl: undefined,
  role: 'admin',
};

export function getMockSession(): UserSession {
  return MOCK_USER;
}
