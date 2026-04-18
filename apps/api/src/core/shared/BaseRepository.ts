import { Database } from '@core/db/index.ts';
import { and, count, eq, getTableColumns, isNull, SQL, sql } from 'drizzle-orm';
import { PgColumn, PgSelect, AnyPgTable } from 'drizzle-orm/pg-core';

export abstract class BaseRepository<
  TTable extends AnyPgTable,
  TFilters extends Record<string, unknown> = Record<string, unknown>,
> {
  constructor(
    protected readonly db: Database,
    protected readonly table: TTable,
  ) {}

  protected totalQuery() {
    return this.db
      .select({ count: count() })
      .from(this.table as AnyPgTable)
      .$dynamic();
  }

  protected applyFilters<T extends PgSelect, F extends Record<string, unknown>>(
    qb: T,
    filters: F,
  ) {
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

  public async findOne(
    filters: TFilters = {} as TFilters,
  ): Promise<TTable['$inferSelect'] | null> {
    const query = this.db
      .select()
      .from(this.table as AnyPgTable)
      .$dynamic();
    this.applyFilters(query, filters);

    const [result] = await query.limit(1);
    return (result as TTable['$inferSelect']) || null;
  }

  public async exists(filters: TFilters = {} as TFilters): Promise<boolean> {
    const query = this.db
      .select({ id: sql`1` })
      .from(this.table as AnyPgTable)
      .$dynamic();
    this.applyFilters(query, filters);

    const [result] = await query.limit(1);
    return !!result;
  }

  public async findAll(
    filters: TFilters = {} as TFilters,
    pagination?: { page: number; limit: number },
    options: {
      orderBy?: PgColumn | SQL | SQL.Aliased;
      columns?: Record<string, any>;
    } = {},
  ): Promise<{ data: TTable['$inferSelect'][]; total: number }> {
    const countQuery = this.applyFilters(this.totalQuery(), filters);

    const dataQuery = (
      options.columns ? this.db.select(options.columns) : this.db.select()
    )
      .from(this.table as AnyPgTable)
      .$dynamic();

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
    return { data: data as TTable['$inferSelect'][], total };
  }
}
