import { BaseRepository } from '@/core/shared/BaseRepository.ts';
import { Database } from '@core/db/index.ts';
import { userPasswordResets } from '@core/db/schema/user_password_resets.ts';
import { eq, and, isNull, gt } from 'drizzle-orm';
import { UserPasswordResetFilters } from '@modules/auth/auth.schema.ts';

export class UserPasswordResetsRepository extends BaseRepository {
  constructor(db: Database) {
    super(db);
  }

  async findOne(filters: UserPasswordResetFilters) {
    const result = await this.db.query.userPasswordResets.findFirst({
      where: (u, { eq, and, isNull, gt }) => {
        const conditions = [];

        if (filters.id) conditions.push(eq(u.id, filters.id));
        if (filters.userId) conditions.push(eq(u.userId, filters.userId));
        if (filters.token) conditions.push(eq(u.token, filters.token));
        
        if (filters.usedAt === null) {
          conditions.push(isNull(u.usedAt));
        } else if (filters.usedAt) {
          conditions.push(eq(u.usedAt, filters.usedAt));
        }

        if (filters.isValid) {
          conditions.push(isNull(u.usedAt));
          conditions.push(gt(u.expiresAt, new Date()));
        }

        return conditions.length > 0 ? and(...conditions) : undefined;
      },
    });

    return result;
  }

  async exists(filters: UserPasswordResetFilters): Promise<boolean> {
    const result = await this.db.query.userPasswordResets.findFirst({
      where: (u, { eq, and, isNull, gt }) => {
        const conditions = [];

        if (filters.id) conditions.push(eq(u.id, filters.id));
        if (filters.userId) conditions.push(eq(u.userId, filters.userId));
        if (filters.token) conditions.push(eq(u.token, filters.token));
        
        if (filters.usedAt === null) {
          conditions.push(isNull(u.usedAt));
        } else if (filters.usedAt) {
          conditions.push(eq(u.usedAt, filters.usedAt));
        }

        if (filters.isValid) {
          conditions.push(isNull(u.usedAt));
          conditions.push(gt(u.expiresAt, new Date()));
        }

        return conditions.length > 0 ? and(...conditions) : undefined;
      },
      columns: { id: true },
    });

    return !!result;
  }

  async create(values: typeof userPasswordResets.$inferInsert) {
    const [newReset] = await this.db
      .insert(userPasswordResets)
      .values(values)
      .returning();

    return newReset;
  }

  async markAsUsed(id: string, tx?: Database) {
    const conn = tx ?? this.db;
    await conn
      .update(userPasswordResets)
      .set({ usedAt: new Date() })
      .where(eq(userPasswordResets.id, id));
  }

  async revokeAllByUserId(userId: string, tx?: Database) {
    const conn = tx ?? this.db;
    await conn
      .update(userPasswordResets)
      .set({ usedAt: new Date() })
      .where(
        and(
          eq(userPasswordResets.userId, userId),
          isNull(userPasswordResets.usedAt),
        ),
      );
  }
}
