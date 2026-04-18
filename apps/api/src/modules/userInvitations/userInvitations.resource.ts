import { UserInvitationSelect } from '@/core/db/schema/user_invitations.ts';

export type UserInvitation = UserInvitationSelect;

export const userInvitationResource = (invitation: UserInvitation) => {
  return {
    id: invitation.id,
    email: invitation.email,
    clinicId: invitation.clinicId,
    roleId: invitation.roleId,
    expiresAt: invitation.expiresAt,
    acceptedAt: invitation.acceptedAt,
    createdAt: invitation.createdAt,
  };
};

export const userInvitationCollectionResource = (
  invitations: UserInvitation[],
) => {
  return invitations.map(userInvitationResource);
};
