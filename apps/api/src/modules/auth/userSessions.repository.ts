import { Database, db } from "@/core/db/index.ts";
import { BaseRepository } from "@/core/shared/BaseRepository.ts";
import { UserSessionsDTO } from "@modules/auth/auth.schema.ts";
import { userSessions } from "@/core/db/schema/user_sessions.ts";
import { eq, and } from 'drizzle-orm';

export class UserSessionsRepository extends BaseRepository{

  constructor(db: Database) {
    super(db);
  }

  async findByToken(token: string) {
    const [session] = await this.db.select()
      .from(userSessions)
      .where(
        and(
          eq(userSessions.token, token),
          eq(userSessions.isValid, true)
        )
      )
      .limit(1);

    return session;
  }

  async create(data: UserSessionsDTO) {
    const [session] = await this.db.insert(userSessions)
      .values(data)
      .returning();

    return session;
  }

  async revokeByToken(token: string) {
    await this.db.update(userSessions)
      .set({
        isValid: false,
        revokedAt: new Date(),
      })
      .where(eq(userSessions.token, token))
  }

  async revokeAllByUserId(userId: string) { 
    await this.db.update(userSessions)
      .set({
        isValid: false,
        revokedAt: new Date(),
      })
      .where(eq(userSessions.userId, userId))
  }
}

export const userSessionsRepository = new UserSessionsRepository(db);