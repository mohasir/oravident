import { BaseRepository } from '@/core/shared/BaseRepository.ts';
import { Database } from '@core/db/index.ts';
import { userPasswordResets } from '@core/db/schema/user_password_resets.ts';
import { eq, and, isNull, gt } from 'drizzle-orm';

export class UserPasswordResetsRepository extends BaseRepository {
  constructor(db: Database) {
    super(db);
  }

  async create(values: typeof userPasswordResets.$inferInsert) {
    const [newReset] = await this.db
      .insert(userPasswordResets)
      .values(values)
      .returning();

    return newReset;
  }

  async findValidToken(hashedToken: string) {
    const [token] = await this.db
      .select()
      .from(userPasswordResets)
      .where(
        and(
          eq(userPasswordResets.token, hashedToken),
          isNull(userPasswordResets.usedAt),
          gt(userPasswordResets.expiresAt, new Date()),
        ),
      )
      .limit(1);

    return token;
  }

  async markAsUsed(id: string) {
    await this.db
      .update(userPasswordResets)
      .set({ usedAt: new Date() })
      .where(eq(userPasswordResets.id, id));
  }

  async revokeAllByUserId(userId: string) {
    await this.db
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
