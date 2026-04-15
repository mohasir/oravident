import { BaseRepository } from '@/core/shared/BaseRepository.ts';
import { Database, db } from '@core/db/index.ts';
import { userInvitations } from '@core/db/schema/user_invitations.ts';
import { eq, and, isNull, gt } from 'drizzle-orm';

export class UserInvitationsRepository extends BaseRepository {

  constructor(db: Database) {
    super(db);
  }

  async findByEmail(email: string) {
    return this.db.select()
      .from(userInvitations)
      .where(eq(userInvitations.email, email))
      .limit(1)
  }

  async existsByEmail(email: string): Promise<boolean> {
    const result = await this.db.select({ id: userInvitations.id })
      .from(userInvitations)
      .where(
        and(
          eq(userInvitations.email, email),
          isNull(userInvitations.acceptedAt),
          gt(userInvitations.expiresAt, new Date())
        )
      )
      .limit(1);
    
    return result.length > 0;
  }

  async create(values: typeof userInvitations.$inferInsert) {
    const [newInvitation] = await this.db
      .insert(userInvitations)
      .values(values)
      .returning();

    return newInvitation;
  }
}

export const userInvitationsRepository = new UserInvitationsRepository(db);
