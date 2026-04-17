import { Database } from './index.ts';

export interface ITransactionManager {
  run<T>(callback: (tx: Database) => Promise<T>): Promise<T>;
}

export class DrizzleTransactionManager implements ITransactionManager {
  constructor(private db: Database) {}

  async run<T>(callback: (tsx: Database) => Promise<T>): Promise<T> {
    return await this.db.transaction(callback);
  }
}
