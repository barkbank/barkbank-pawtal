import { DbContext, dbQuery } from "@/lib/data/db-utils";


export async function select1AsPing(db: DbContext): Promise<{ping: number}> {
  const sql = `SELECT 1 as "ping"`;
  const res = await dbQuery<{ ping: number }>(db, sql, []);
  return res.rows[0];
}
