import { BaseRepository } from '@/core/shared/BaseRepository.ts';
import { Database } from '@core/db/index.ts';
import {
  userPasswordResets,
  UserPasswordResetTable,
  UserPasswordResetInsert,
} from '@core/db/schema/user_password_resets.ts';
import { eq, and, isNull, gt } from 'drizzle-orm';
import { UserPasswordResetFiltersDTO } from '@modules/auth/auth.schema.ts';

export class UserPasswordResetsRepository extends BaseRepository<
  UserPasswordResetTable,
  UserPasswordResetFiltersDTO
> {
  constructor(db: Database) {
    super(db, userPasswordResets);
  }

  protected override applyFilters<
    T extends import('drizzle-orm/pg-core').PgSelect,
  >(qb: T, filters: UserPasswordResetFiltersDTO) {
    const { isValid, ...rest } = filters;

    super.applyFilters(qb, rest);

    if (isValid) {
      qb.where(
        and(
          isNull(userPasswordResets.usedAt),
          gt(userPasswordResets.expiresAt, new Date()),
        ),
      );
    }

    return qb;
  }

  async create(values: UserPasswordResetInsert) {
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
