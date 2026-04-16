export type WorkerProfileRow = {
  user: { 
    id: string; 
    email: string;
    passwordHash: string;
  };
  worker: { clinicId: string | null } | null;
  role: { id: string | null; name: string | null } | null;
  permission: { id: string | null; code: string | null } | null;
};