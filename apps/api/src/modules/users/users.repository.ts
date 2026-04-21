import { Database } from '@core/db/index.ts';
import { BaseRepository } from '@/core/shared/BaseRepository.ts';
import { UserFiltersDTO } from '@modules/users/users.schema.ts';
import {
  users,
  UserTable,
  UserInsert,
  UserUpdate,
  publicUserColumns,
  PublicUser,
} from '@/core/db/schema/users.ts';
import { workers } from '@/core/db/schema/workers.ts';
import { eq, and } from 'drizzle-orm';

export class UserRepository extends BaseRepository<UserTable, UserFiltersDTO> {
  constructor(db: Database) {
    super(db, users);
  }

  async findPublicOne(filters: UserFiltersDTO) {
    return super.findOne<PublicUser>(filters, {
      columns: publicUserColumns,
    });
  }

  async findPublicAll(
    filters: UserFiltersDTO,
    pagination?: { page?: number; limit?: number },
  ) {
    return super.findAll<PublicUser>(filters, pagination, {
      columns: publicUserColumns,
    });
  }

  async delete(id: string) {
    const [deletedUser] = await this.db
      .update(users)
      .set({ isActive: false })
      .where(eq(users.id, id))
      .returning();
    return !!deletedUser;
  }

  async findActiveUserWorkerById(id: string) {
    const rows = await this.db
      .select({
        id: users.id,
        email: users.email,
        worker: {
          clinicId: workers.clinicId,
        },
      })
      .from(users)
      .leftJoin(workers, eq(users.id, workers.userId))
      .where(and(eq(users.id, id), eq(users.isActive, true)))
      .limit(1);

    return rows[0];
  }

  async create(values: UserInsert) {
    const [newUser] = await this.db.insert(users).values(values).returning();
    return newUser;
  }

  async update(id: string, values: UserUpdate) {
    const [updatedUser] = await this.db
      .update(users)
      .set({ ...values, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }
}
