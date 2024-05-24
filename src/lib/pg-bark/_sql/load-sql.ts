import { dbLoadSql } from "../../data/db-load-sql";

export function loadSql(queryName: string): string {
  return dbLoadSql(`src/lib/pg-bark/_sql/${queryName}.sql`);
}
