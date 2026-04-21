import { PublicUser } from '@/core/db/schema/users.ts';

export const userResource = (user: PublicUser) => {
  return {
    id: user.id,
    email: user.email,
    isPlatformAdmin: user.isPlatformAdmin,
    isActive: user.isActive,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

export const userCollectionResource = (usersArr: PublicUser[]) => {
  return usersArr.map(userResource);
};
