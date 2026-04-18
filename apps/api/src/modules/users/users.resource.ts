import { users } from '@/core/db/schema/users.ts';

export type User = typeof users.$inferSelect;

export const userResource = (user: Partial<User>) => {
  return {
    id: user.id,
    email: user.email,
    isActive: user.isActive,
    createdAt: user.createdAt,
  };
};

export const userCollectionResource = (usersArr: Partial<User>[]) => {
  return usersArr.map(userResource);
};
