import { Database } from '@core/db/index.ts';

export abstract class BaseRepository {
  constructor(protected readonly db: Database) {}

  protected getPaginationConfig(page: number, limit: number) {
    return {
      limit,
      offset: (page - 1) * limit,
    };
  }
}