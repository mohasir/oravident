import { Database } from '@/core/db/index.ts';
import {
  BaseRepository,
  type DefaultColumns,
} from '@/core/shared/BaseRepository.ts';
import {
  workers,
  WorkerTable,
  WorkerInsert,
  WorkerUpdate,
} from '@/core/db/schema/workers.ts';
import { eq, and, notInArray, getTableColumns } from 'drizzle-orm';
import { DEMO_IDS } from '@core/db/seeds/fixtures/demo-data.ts';
import { users } from '@/core/db/schema/users.ts';
import { roles } from '@/core/db/schema/roles.ts';
import { WorkerFiltersDTO } from '@modules/workers/workers.schema.ts';

export class WorkersRepository extends BaseRepository<
  WorkerTable,
  WorkerFiltersDTO
> {
  constructor(db: Database) {
    super(db, workers);
  }

  public override select(columns?: DefaultColumns) {
    return this.db
      .select(
        columns || {
          ...getTableColumns(workers),
          user: {
            id: users.id,
            email: users.email,
          },
          role: {
            id: roles.id,
            name: roles.name,
            displayName: roles.displayName,
          },
        },
      )
      .from(workers)
      .innerJoin(users, eq(workers.userId, users.id))
      .innerJoin(roles, eq(workers.roleId, roles.id))
      .$dynamic();
  }

  async create(values: WorkerInsert) {
    const [newWorker] = await this.db
      .insert(workers)
      .values(values)
      .returning();

    return newWorker;
  }

  async update(id: string, values: WorkerUpdate) {
    const [updatedWorker] = await this.db
      .update(workers)
      .set({ ...values, updatedAt: new Date() })
      .where(eq(workers.id, id))
      .returning();

    return updatedWorker;
  }

  async delete(id: string) {
    const demoWorkerIds = [
      DEMO_IDS.WORKER_ADMIN,
      DEMO_IDS.WORKER_DOCTOR,
      DEMO_IDS.WORKER_RECEPTION,
    ];

    const [deletedService] = await this.db
      .update(workers)
      .set({ isActive: false })
      .where(and(eq(workers.id, id), notInArray(workers.id, demoWorkerIds)))
      .returning();
    return !!deletedService;
  }
}
