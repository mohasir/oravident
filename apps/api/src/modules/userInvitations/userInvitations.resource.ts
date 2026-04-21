import { UserInvitationSelect } from '@/core/db/schema/user_invitations.ts';
import { formatDate } from '@common/utils/date.ts';

export type UserInvitation = UserInvitationSelect;

export const userInvitationResource = (invitation: UserInvitation) => {
  return {
    id: invitation.id,
    email: invitation.email,
    clinicId: invitation.clinicId,
    roleId: invitation.roleId,
    expiresAt: formatDate(invitation.expiresAt),
    acceptedAt: formatDate(invitation.acceptedAt),
    createdAt: formatDate(invitation.createdAt),
  };
};

export const userInvitationCollectionResource = (
  invitations: UserInvitation[],
) => {
  return invitations.map(userInvitationResource);
};
