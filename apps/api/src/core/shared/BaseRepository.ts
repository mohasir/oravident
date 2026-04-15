import { Database } from '@core/db/index.ts';

export abstract class BaseRepository {
  constructor(protected readonly db: Database) {}
}