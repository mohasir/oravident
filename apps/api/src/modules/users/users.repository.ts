import { db, Database } from '@core/db/index.ts';
import { users } from '@/core/db/schema/users.ts';
import { workers } from '@/core/db/schema/workers.ts';
import { eq, SQL } from 'drizzle-orm';
import { BaseRepository } from '@/core/shared/BaseRepository.ts';

export class UserRepository extends BaseRepository {

  constructor(db: Database) {
    super(db);
  }

  private async findUserWorker(where: SQL) {
    const [userWorker] = await this.db.select({
      user: users,
      worker: {
        clinicId: workers.clinicId
      }
    })
      .from(users)
      .leftJoin(
        workers,
        eq(users.id, workers.userId)
      )
      .where(where)
      .limit(1);

    return userWorker;
  }

  async findUsersByEmail(email: string) {
    const [user] = await this.db.select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    return user;
  }

  async findUserWorkerByEmail(email: string) {
    return this.findUserWorker(
      eq(users.email, email)
    );
  }

  async findUserWorkerById(id: string) {
    return this.findUserWorker(
      eq(users.id, id)
    );
  }

  async existsByEmail(email: string) {
    const result = await this.db.select({ id: users.id })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    
    return result.length > 0;
  }
}

export const userRepository = new UserRepository(db);