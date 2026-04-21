import { Database } from '@core/db/index.ts';
import { and, count, eq, getTableColumns, isNull, SQL, sql } from 'drizzle-orm';
import { PgColumn, PgSelect, AnyPgTable } from 'drizzle-orm/pg-core';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DefaultColumns = Record<string, any>;

export abstract class BaseRepository<
  TTable extends AnyPgTable = AnyPgTable,
  TFilters extends Record<string, unknown> = Record<string, unknown>,
> {
  protected defaultColumns?: DefaultColumns;

  constructor(
    protected readonly db: Database,
    protected readonly table?: TTable,
  ) {}

  public async findOne<T = TTable['$inferSelect']>(
    filters: TFilters = {} as TFilters,
    options: {
      columns?: DefaultColumns;
    } = {},
  ): Promise<T | null> {
    const query = this.select(options.columns || this.defaultColumns);

    this.applyFilters(query, filters);

    const [result] = await query.limit(1);
    return (result as T) || null;
  }

  public async exists(filters: TFilters = {} as TFilters): Promise<boolean> {
    const query = this.select({ id: sql`1` });

    this.applyFilters(query, filters);

    const [result] = await query.limit(1);
    return !!result;
  }

  public async findAll<T = TTable['$inferSelect']>(
    filters: TFilters = {} as TFilters,
    pagination?: { page: number; limit: number },
    options: {
      orderBy?: PgColumn | SQL | SQL.Aliased;
      columns?: DefaultColumns;
    } = {},
  ): Promise<{ data: T[]; total: number }> {
    const countQuery = this.applyFilters(this.totalQuery(), filters);

    const dataQuery = this.select(options.columns || this.defaultColumns);

    this.applyFilters(dataQuery, filters);

    const orderBy = options.orderBy || sql`created_at desc`;

    if (pagination) {
      this.withPagination(
        dataQuery,
        orderBy,
        pagination.page,
        pagination.limit,
      );
    } else {
      dataQuery.orderBy(orderBy);
    }

    const [totalCountResult, data] = await Promise.all([countQuery, dataQuery]);

    const total = Number(totalCountResult[0]?.count ?? 0);
    return { data: data as T[], total };
  }

  protected select(columns?: DefaultColumns) {
    if (!this.table) {
      throw new Error('Table not defined in repository');
    }

    return (columns ? this.db.select(columns) : this.db.select())
      .from(this.table as AnyPgTable)
      .$dynamic();
  }

  protected totalQuery() {
    return this.select({ count: count() });
  }

  protected applyFilters<T extends PgSelect, F extends Record<string, unknown>>(
    qb: T,
    filters: F,
  ) {
    if (!this.table) {
      throw new Error('Table not defined in repository');
    }
    const conditions: SQL[] = [];
    const columns = getTableColumns(this.table);

    for (const key in filters) {
      const value = filters[key];

      if (value === undefined) continue;

      const column = columns[key as keyof typeof columns];

      if (!column) continue;

      if (value === null) {
        conditions.push(isNull(column));
      } else {
        conditions.push(eq(column, value));
      }
    }

    if ('isActive' in columns && filters['isActive'] === undefined) {
      conditions.push(eq(columns['isActive'] as PgColumn, true));
    }

    return conditions.length > 0 ? qb.where(and(...conditions)) : qb;
  }

  protected withPagination<T extends PgSelect>(
    qb: T,
    orderByColumn: PgColumn | SQL | SQL.Aliased,
    page = 1,
    pageSize = 3,
  ) {
    return qb
      .orderBy(orderByColumn)
      .limit(pageSize)
      .offset((page - 1) * pageSize);
  }

  protected getPaginationConfig(page: number, limit: number) {
    return {
      limit,
      offset: (page - 1) * limit,
    };
  }
}
