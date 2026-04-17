import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import app from '@/app.ts';
import { userInvitationsController } from '@/bootstrap/container.ts';

const VALID_UUID = '550e8400-e29b-41d4-a716-446655440000';

// Mock del controlador para evitar tocar DB/Servicios
vi.mock('@/bootstrap/container.ts', () => ({
  userInvitationsController: {
    sendInvitation: vi.fn((req, res) => res.status(201).json({ 
      success: true, 
      message: 'Invitación enviada exitosamente (Mock)' 
    })),
    validateInvitation: vi.fn(),
    acceptInvitation: vi.fn(),
  },
  // Necesitamos mockear authController también si algo lo importa, pero aquí nos enfocamos en Invitations
  authController: {},
  // clinicService lo usa protect? no, protect usa authService.
  authService: {},
  clinicService: {},
}));

// Mock simple de protect para saltar la autenticación en este test de integración de rutas
vi.mock('@/middlewares/protect.ts', () => ({
  protect: (req: any, res: any, next: any) => {
    req.user = { id: 'user-1', clinicId: 'clinic-1' };
    next();
  }
}));

describe('Integration Test: /api/v1/invitations', () => {

  describe('POST /api/v1/invitations', () => {
    it('✅ Debe enviar una invitación con todos los campos correctos', async () => {
      const validData = {
        email: 'new-worker@dentalsass.com',
        roleId: VALID_UUID,
      };

      const response = await request(app)
        .post('/api/v1/invitations')
        .send(validData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(userInvitationsController.sendInvitation).toHaveBeenCalled();
    });

    it('❌ Debe rechazar la petición si falta el email', async () => {
      const invalidData = {
        roleId: VALID_UUID,
      };

      const response = await request(app)
        .post('/api/v1/invitations')
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body.errors.errorCode).toBe('VALIDATION_ERROR');
      expect(response.body.errors.details).toHaveProperty('email');
    });

    it('❌ Debe rechazar si el email no es válido', async () => {
      const response = await request(app)
        .post('/api/v1/invitations')
        .send({
          email: 'nombre-sin-arroba',
          roleId: VALID_UUID,
        });

      expect(response.status).toBe(400);
      expect(response.body.errors.details.email[0]).toBe('Invalid email format');
    });
  });

  describe('GET /api/v1/invitations/:token', () => {
      it('✅ Debe validar una invitación', async () => {
          const response = await request(app)
            .get('/api/v1/invitations/some-token');
          
          expect(response.status).toBe(200);
      });
  });
});
