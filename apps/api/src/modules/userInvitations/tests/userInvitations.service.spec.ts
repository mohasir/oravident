import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UserInvitationsService } from '@modules/userInvitations/userInvitations.service.ts';
import { ErrorCodes } from '@/core/errors/ErrorCodes.ts';
import { AuthRepository } from '@modules/auth/auth.repository.ts';
import { UserInvitationsRepository } from '@modules/userInvitations/userInvitations.repository.ts';
import { RolesRepository } from '@modules/roles/roles.repository.ts';
import { SendInvitationDTO } from '@modules/userInvitations/userInvitations.schema.ts';
import { Mocked } from 'vitest';

describe('UserInvitationsService', () => {
  let userInvitationsService: UserInvitationsService;
  let mockAuthRepo: Mocked<AuthRepository>;
  let mockInviteRepo: Mocked<UserInvitationsRepository>;
  let mockRoleRepo: Mocked<RolesRepository>;

  beforeEach(() => {
    mockAuthRepo = {
      userExists: vi.fn(),
    } as unknown as Mocked<AuthRepository>;

    mockInviteRepo = {
      findByEmail: vi.fn(),
      existsByEmail: vi.fn(),
      create: vi.fn(),
    } as unknown as Mocked<UserInvitationsRepository>;

    mockRoleRepo = {
      isValidRoleForClinic: vi.fn(),
    } as unknown as Mocked<RolesRepository>;

    userInvitationsService = new UserInvitationsService(
      mockInviteRepo,
      mockAuthRepo,
      mockRoleRepo,
    );
  });

  describe('sendInvitation', () => {
    it('should throw an error if role is invalid for clinic', async () => {
      mockRoleRepo.isValidRoleForClinic.mockResolvedValue(false);

      const inviteData: SendInvitationDTO = {
        email: 'test@dent.com',
        roleId: '768be548-c89b-4394-bb9f-50d43702434',
      };

      await expect(
        userInvitationsService.sendInvitation(inviteData, 'clinic-1'),
      ).rejects.toMatchObject({
        message: 'The role does not belong to this clinic or is not available',
        statusCode: 422,
      });
    });

    it('should throw an error if user already exists', async () => {
      mockRoleRepo.isValidRoleForClinic.mockResolvedValue(true);
      mockAuthRepo.userExists.mockResolvedValue(true);

      const inviteData: SendInvitationDTO = {
        email: 'test@dent.com',
        roleId: '768be548-c89b-4394-bb9f-50d43702434',
      };

      await expect(
        userInvitationsService.sendInvitation(inviteData, 'clinic-1'),
      ).rejects.toMatchObject({
        message: 'User is already registered in the system',
        statusCode: 409,
        errorCode: ErrorCodes.auth.EMAIL_ALREADY_EXISTS,
      });

      expect(mockAuthRepo.userExists).toHaveBeenCalledWith({
        email: 'test@dent.com',
      });
    });

    it('should throw an error if there is already a pending invitation', async () => {
      mockRoleRepo.isValidRoleForClinic.mockResolvedValue(true);
      mockAuthRepo.userExists.mockResolvedValue(false);
      mockInviteRepo.exists.mockResolvedValue(true);

      const inviteData: SendInvitationDTO = {
        email: 'pending@dent.com',
        roleId: '768be548-c89b-4394-bb9f-50d43702434',
      };

      await expect(
        userInvitationsService.sendInvitation(inviteData, 'clinic-1'),
      ).rejects.toMatchObject({
        message: 'There is already a pending invitation for this email',
        statusCode: 409,
        errorCode: ErrorCodes.auth.INVITATION_PENDING,
      });
    });

    it('should create an invitation if everything is correct', async () => {
      mockRoleRepo.isValidRoleForClinic.mockResolvedValue(true);
      mockAuthRepo.userExists.mockResolvedValue(false);
      mockInviteRepo.exists.mockResolvedValue(false);
      mockInviteRepo.create.mockResolvedValue({
        id: 'new-invite-id',
        email: 'new@dent.com',
        clinicId: 'clinic-1',
        roleId: 'role-1',
        token: 'token-123',
        expiresAt: new Date(),
        acceptedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any);

      const inviteData: SendInvitationDTO = {
        email: 'new@dent.com',
        roleId: '768be548-c89b-4394-bb9f-50d43702434',
      };

      await userInvitationsService.sendInvitation(inviteData, 'clinic-1');

      expect(mockInviteRepo.create).toHaveBeenCalled();
    });
  });
});
