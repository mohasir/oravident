import { UserPublic } from '@/core/db/schema/users.ts';

export type User = UserPublic;

export const userResource = (user: User) => {
  return {
    id: user.id,
    email: user.email,
    isActive: user.isActive,
    createdAt: user.createdAt,
  };
};

export const userCollectionResource = (usersArr: User[]) => {
  return usersArr.map(userResource);
};
