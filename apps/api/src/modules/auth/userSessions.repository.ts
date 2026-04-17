import { Database, db } from '@/core/db/index.ts';
import { BaseRepository } from '@/core/shared/BaseRepository.ts';
import { UserSessionsDTO, UserSessionFilters } from '@modules/auth/auth.schema.ts';
import { userSessions } from '@/core/db/schema/user_sessions.ts';
import { eq, and, isNull } from 'drizzle-orm';

export class UserSessionsRepository extends BaseRepository {
  constructor(db: Database) {
    super(db);
  }

  async findOne(filters: UserSessionFilters) {
    const result = await this.db.query.userSessions.findFirst({
      where: (u, { eq, and }) => {
        const conditions = [];

        if (filters.id) conditions.push(eq(u.id, filters.id));
        if (filters.userId) conditions.push(eq(u.userId, filters.userId));
        if (filters.token) conditions.push(eq(u.token, filters.token));
        if (filters.isValid !== undefined)
          conditions.push(eq(u.isValid, filters.isValid));

        return conditions.length > 0 ? and(...conditions) : undefined;
      },
    });

    return result;
  }

  async exists(filters: UserSessionFilters): Promise<boolean> {
    const result = await this.db.query.userSessions.findFirst({
      where: (u, { eq, and }) => {
        const conditions = [];

        if (filters.id) conditions.push(eq(u.id, filters.id));
        if (filters.userId) conditions.push(eq(u.userId, filters.userId));
        if (filters.token) conditions.push(eq(u.token, filters.token));
        if (filters.isValid !== undefined)
          conditions.push(eq(u.isValid, filters.isValid));

        return conditions.length > 0 ? and(...conditions) : undefined;
      },
      columns: { id: true },
    });

    return !!result;
  }

  async create(data: UserSessionsDTO) {
    const [session] = await this.db
      .insert(userSessions)
      .values(data)
      .returning();

    return session;
  }

  async revokeByToken(token: string) {
    await this.db
      .update(userSessions)
      .set({
        isValid: false,
        revokedAt: new Date(),
      })
      .where(eq(userSessions.token, token));
  }

  async revokeAllSessionsByUserId(userId: string, tx?: Database) {
    const conn = tx ?? this.db;
    await conn
      .update(userSessions)
      .set({
        isValid: false,
        revokedAt: new Date(),
      })
      .where(eq(userSessions.userId, userId));
  }
}
