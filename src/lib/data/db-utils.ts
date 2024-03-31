import { Pool, PoolClient, QueryResult } from "pg";
import { SlowQueryService } from "./db-slow-query";

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

async function timedDbQuery(
  ctx: DbContext,
  sql: string,
  params: any[],
): Promise<QueryResult<any>> {
  try {
    const t0 = _SLOW_QUERY_SINGLETON.getTs();
    const res = await ctx.query(sql, params);
    const t1 = _SLOW_QUERY_SINGLETON.getTs();
    _SLOW_QUERY_SINGLETON.submit(sql, t1 - t0);
    return res;
  } catch (error) {
    console.error(`SQL: ${sql}`, error);
    throw error;
  }
}

export async function dbQuery(
  ctx: DbContext,
  sql: string,
  params: any[],
): Promise<QueryResult<any>> {
  if (process.env.NODE_ENV === "development") {
    return timedDbQuery(ctx, sql, params);
  }
  try {
    return await ctx.query(sql, params);
  } catch (error) {
    console.error(`SQL: ${sql}`, error);
    throw error;
  }
}

function convertToCamelCase(columnName: string): string {
  return columnName.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

export function toCamelCaseRow(row: any): any {
  const result: { [key: string]: any } = {};
  for (const key of Object.keys(row)) {
    const camelCaseKey = convertToCamelCase(key);
    result[camelCaseKey] = row[key];
  }
  return result;
}
