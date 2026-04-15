import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import app from '@/app.ts';
import { authController } from '../auth.controller.ts';

const VALID_UUID = '550e8400-e29b-41d4-a716-446655440000';

// Mock del controlador para evitar tocar DB/Servicios y no romper las rutas de Express
vi.mock('../auth.controller.ts', () => ({
  authController: {
    login: vi.fn(),
    register: vi.fn(),
    forgotPassword: vi.fn(),
    resetPassword: vi.fn(),
    acceptInvitation: vi.fn(),
    refreshToken: vi.fn(),
    changePassword: vi.fn(),
    updateProfile: vi.fn(),
    inviteWorker: vi.fn((req, res) => res.status(201).json({ 
      success: true, 
      message: 'Invitación enviada exitosamente (Mock)' 
    })),
  }
}));

describe('Integration Test: POST /api/v1/auth/invitations', () => {

  it('✅ Debe aceptar una invitación con todos los campos correctos', async () => {

    const validData = {
      email: 'new-worker@dentalsass.com',
      roleId: VALID_UUID,
    };

    const response = await request(app)
      .post('/api/v1/auth/invitations')
      .send(validData);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(authController.inviteWorker).toHaveBeenCalled();
  });

  it('❌ Debe rechazar la petición si falta el email', async () => {
    const invalidData = {
      roleId: VALID_UUID,
    };

    const response = await request(app)
      .post('/api/v1/auth/invitations')
      .send(invalidData);

    expect(response.status).toBe(400);
    expect(response.body.errors.errorCode).toBe('VALIDATION_ERROR');
    expect(response.body.errors.details).toHaveProperty('email');
    expect(response.body.errors.details.email[0]).toBe('Required');
  });

  it('❌ Debe rechazar si los UUIDs tienen formato inválido', async () => {
    const invalidData = {
      email: 'worker@dent.com',
      roleId: 'esto-no-es-un-uuid',
    };

    const response = await request(app)
      .post('/api/v1/auth/invitations')
      .send(invalidData);

    expect(response.status).toBe(400);
    expect(response.body.errors.details).toHaveProperty('roleId');
    expect(response.body.errors.details).toHaveProperty('clinicId');
    expect(response.body.errors.details.roleId[0]).toBe('Invalid uuid');
  });

  it('❌ Debe rechazar si el email no es válido', async () => {
    const response = await request(app)
      .post('/api/v1/auth/invitations')
      .send({
        email: 'nombre-sin-arroba',
        roleId: VALID_UUID,
        clinicId: VALID_UUID
      });

    expect(response.status).toBe(400);
    expect(response.body.errors.details.email[0]).toBe('Invalid email');
  });

  it('⚠️ Debe ignorar campos extra y procesar la petición', async () => {
    const response = await request(app)
      .post('/api/v1/auth/invitations')
      .send({
        email: 'worker@dent.com',
        roleId: VALID_UUID,
        clinicId: VALID_UUID,
        extraField: 'soy-basura-extra' // Este campo será ignorado por Zod .strip()
      });

    expect(response.status).toBe(201);
  });
});
