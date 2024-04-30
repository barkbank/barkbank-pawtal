import { Pool, PoolClient, QueryResult, QueryResultRow } from "pg";
import { SlowQueryService } from "./db-slow-query";
import { Err, Ok, Result } from "../utilities/result";
import { CODE } from "../utilities/bark-code";

export type DbContext = Pool | PoolClient;

export async function dbBegin(conn: PoolClient): Promise<void> {
  await conn.query("BEGIN");
}

export async function dbCommit(conn: PoolClient): Promise<void> {
  await conn.query("COMMIT");
}

export async function dbRollback(conn: PoolClient): Promise<void> {
  await conn.query("ROLLBACK");
}

export async function dbRollbackAndRelease(conn: PoolClient): Promise<void> {
  await conn.query("ROLLBACK");
  conn.release();
}

export async function dbRelease(conn: PoolClient): Promise<void> {
  conn.release();
}

const _SLOW_QUERY_SINGLETON = new SlowQueryService();

async function timedDbQuery<T extends QueryResultRow>(
  ctx: DbContext,
  sql: string,
  params: any[],
): Promise<QueryResult<T>> {
  try {
    const t0 = _SLOW_QUERY_SINGLETON.getTs();
    const res = await ctx.query<T>(sql, params);
    const t1 = _SLOW_QUERY_SINGLETON.getTs();
    _SLOW_QUERY_SINGLETON.submit(sql, t1 - t0);
    return res;
  } catch (error) {
    console.error(`SQL: ${sql}`, error);
    throw error;
  }
}

export async function dbQuery<T extends QueryResultRow = any>(
  ctx: DbContext,
  sql: string,
  params: any[],
): Promise<QueryResult<T>> {
  if (process.env.NODE_ENV === "development") {
    return timedDbQuery<T>(ctx, sql, params);
  }
  try {
    return await ctx.query<T>(sql, params);
  } catch (error) {
    console.error(`SQL: ${sql}`, error);
    throw error;
  }
}

export async function dbResultQuery<T extends QueryResultRow = any>(
  ctx: DbContext,
  sql: string,
  params: any[],
): Promise<Result<QueryResult<T>, typeof CODE.DB_QUERY_FAILURE>> {
  try {
    const result = await dbQuery<T>(ctx, sql, params);
    return Ok(result);
  } catch {
    return Err(CODE.DB_QUERY_FAILURE);
  }
}

function convertToCamelCase(columnName: string): string {
  return columnName.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

// TODO: remove all usage of toCamelCaseRow. Safer to explicitly specify the column names in query.
export function toCamelCaseRow(row: any): any {
  const result: { [key: string]: any } = {};
  for (const key of Object.keys(row)) {
    const camelCaseKey = convertToCamelCase(key);
    result[camelCaseKey] = row[key];
  }
  return result;
}
