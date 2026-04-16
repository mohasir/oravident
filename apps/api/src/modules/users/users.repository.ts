import { Database } from '@core/db/index.ts';
import { BaseRepository } from '@/core/shared/BaseRepository.ts';
import { UserFilters } from '@modules/users/users.schema.ts';

export class UserRepository extends BaseRepository {
  private readonly defaultUserFilters: UserFilters = { isActive: true };
  private readonly defaultHiddenColumns = { passwordHash: false } as const;

  constructor(db: Database) {
    super(db);
  }

  async findOne(filters: UserFilters) {
    const finalFilters = { ...this.defaultUserFilters, ...filters };

    const result = await this.db.query.users.findFirst({
      where: (userTable, { eq, and }) => {
        const conditions = (
          Object.keys(finalFilters) as Array<keyof typeof userTable>
        )
          .filter((key) => finalFilters[key as keyof UserFilters] !== undefined)
          .map((key) =>
            eq(userTable[key], finalFilters[key as keyof UserFilters]!),
          );

        return conditions.length > 0 ? and(...conditions) : undefined;
      },
      columns: this.defaultHiddenColumns,
    });

    return result;
  }
}
