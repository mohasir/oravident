import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthService } from '../auth.service.ts';
import { ApiError } from '@/core/errors/ApiError.ts';
import { ErrorCodes } from '@/core/errors/ErrorCodes.ts';
import { UserRepository } from '../../users/users.repository.ts';
import { UserInvitationsRepository } from '../../userInvitations/userInvitations.repository.ts';
import { InviteWorkerDTO } from '../auth.schema.ts';
import { Mocked } from 'vitest';

describe('AuthService', () => {
  let authService: AuthService;
  let mockUserRepo: Mocked<UserRepository>;
  let mockInviteRepo: Mocked<UserInvitationsRepository>;

  beforeEach(() => {
    mockUserRepo = {
      findUsersByEmail: vi.fn(),
      existsByEmail: vi.fn(),
    } as unknown as Mocked<UserRepository>;
    
    mockInviteRepo = {
      findByEmail: vi.fn(),
      existsByEmail: vi.fn(),
      create: vi.fn(),
    } as unknown as Mocked<UserInvitationsRepository>;

    authService = new AuthService(mockUserRepo, mockInviteRepo);
  });

  describe('inviteWorker', () => {
    it('should throw an error if user already exists', async () => {
      mockUserRepo.existsByEmail.mockResolvedValue(true);

      const inviteData: InviteWorkerDTO = {
        email: 'test@dent.com',
        roleId: '768be548-c89b-4394-bb9f-50d43702434',
        clinicId: '768be548-c89b-4394-bb9f-50d43702431'
      };

      await expect(authService.inviteWorker(inviteData))
        .rejects
        .toBeInstanceOf(ApiError);

      await expect(authService.inviteWorker(inviteData))
        .rejects
        .toMatchObject({
          message: 'User is already registered in the system',
          statusCode: 409,
          errorCode: ErrorCodes.auth.EMAIL_ALREADY_EXISTS,
        });
      
      expect(mockUserRepo.existsByEmail).toHaveBeenCalledWith('test@dent.com');
    });

    it('should create an invitation if everything is correct', async () => {
      // Mock: simulamos que NO existe el usuario ni invitación previa
      mockUserRepo.existsByEmail.mockResolvedValue(false);
      mockInviteRepo.existsByEmail.mockResolvedValue(false);
      mockInviteRepo.create.mockResolvedValue({ 
        id: 'new-invite-id',
        email: 'new@dent.com',
        clinicId: '768be548-c89b-4394-bb9f-50d43702431',
        roleId: '768be548-c89b-4394-bb9f-50d43702434',
        token: 'token-123',
        expiresAt: new Date(),
        acceptedAt: null,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      const inviteData: InviteWorkerDTO = {
        email: 'new@dent.com',
        roleId: '768be548-c89b-4394-bb9f-50d43702434',
        clinicId: '768be548-c89b-4394-bb9f-50d43702431'
      };

      const result = await authService.inviteWorker(inviteData);

      expect(result.message).toBe('Invitation sent successfully');
      expect(mockInviteRepo.create).toHaveBeenCalled();
      expect(result.token).toBeDefined();
    });

    it('should throw an error if there is already a pending invitation', async () => {
        // Mock: simulamos que NO hay usuario pero SI hay invitación
        mockUserRepo.existsByEmail.mockResolvedValue(false);
        mockInviteRepo.existsByEmail.mockResolvedValue(true);
  
        const inviteData: InviteWorkerDTO = {
          email: 'pending@dent.com',
          roleId: '768be548-c89b-4394-bb9f-50d43702434',
          clinicId: '768be548-c89b-4394-bb9f-50d43702431'
        };
  
        await expect(authService.inviteWorker(inviteData))
          .rejects
          .toBeInstanceOf(ApiError);

        await expect(authService.inviteWorker(inviteData))
          .rejects
          .toMatchObject({
            message: 'There is already a pending invitation for this email',
            statusCode: 409,
            errorCode: ErrorCodes.auth.INVITATION_PENDING,
          });
      });
  });
});
