export type User = {
  id: string;
  email: string;
  isPlatformAdmin: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export const MOCK_USERS: User[] = [
  {
    id: 'usr_01jx2k3m4n5p6q7r8s9t0u1v2',
    email: 'sarah.admin@dentclinic.com',
    isPlatformAdmin: true,
    isActive: true,
    createdAt: '2024-01-15',
    updatedAt: '2025-03-20',
  },
  {
    id: 'usr_02jx2k3m4n5p6q7r8s9t0u1v3',
    email: 'john.doe@dentclinic.com',
    isPlatformAdmin: false,
    isActive: true,
    createdAt: '2024-02-10',
    updatedAt: '2025-03-18',
  },
  {
    id: 'usr_03jx2k3m4n5p6q7r8s9t0u1v4',
    email: 'maria.lopez@dentclinic.com',
    isPlatformAdmin: false,
    isActive: true,
    createdAt: '2024-03-05',
    updatedAt: '2025-02-14',
  },
  {
    id: 'usr_04jx2k3m4n5p6q7r8s9t0u1v5',
    email: 'carlos.ruiz@dentclinic.com',
    isPlatformAdmin: false,
    isActive: false,
    createdAt: '2024-04-20',
    updatedAt: '2025-01-30',
  },
  {
    id: 'usr_05jx2k3m4n5p6q7r8s9t0u1v6',
    email: 'ana.garcia@dentclinic.com',
    isPlatformAdmin: true,
    isActive: true,
    createdAt: '2024-05-12',
    updatedAt: '2025-03-22',
  },
  {
    id: 'usr_06jx2k3m4n5p6q7r8s9t0u1v7',
    email: 'pedro.martinez@dentclinic.com',
    isPlatformAdmin: false,
    isActive: true,
    createdAt: '2024-06-08',
    updatedAt: '2025-02-28',
  },
  {
    id: 'usr_07jx2k3m4n5p6q7r8s9t0u1v8',
    email: 'laura.sanchez@dentclinic.com',
    isPlatformAdmin: false,
    isActive: false,
    createdAt: '2024-07-15',
    updatedAt: '2024-12-10',
  },
  {
    id: 'usr_08jx2k3m4n5p6q7r8s9t0u1v9',
    email: 'miguel.torres@dentclinic.com',
    isPlatformAdmin: false,
    isActive: true,
    createdAt: '2024-08-20',
    updatedAt: '2025-03-15',
  },
];

export const fetchUsers = (): Promise<User[]> =>
  new Promise((resolve) => setTimeout(() => resolve(MOCK_USERS), 800));
