import { Pool, PoolClient, QueryResult } from "pg";

export type DbContext = Pool | PoolClient;

export async function dbBegin(conn: PoolClient): Promise<void> {
  await conn.query("BEGIN");
}

export async function dbCommit(conn: PoolClient): Promise<void> {
  await conn.query("COMMIT");
}

export async function dbRollbackAndRelease(conn: PoolClient): Promise<void> {
  await conn.query("ROLLBACK");
  conn.release();
}

export async function dbRelease(conn: PoolClient): Promise<void> {
  conn.release();
}

export async function dbQuery(
  ctx: DbContext,
  sql: string,
  params: any[],
): Promise<QueryResult<any>> {
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
