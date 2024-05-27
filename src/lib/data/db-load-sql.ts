import { readFileSync } from "fs";
import { join } from "path";

const cachedSql: Record<string, string> = {};

export function dbLoadSql(sqlPath: string): string {
  if (cachedSql[sqlPath] !== undefined) {
    return cachedSql[sqlPath];
  }
  console.log(`Loading SQL: ${sqlPath}`);
  const fullPath = join(process.cwd(), sqlPath);
  const content = readFileSync(fullPath, "utf-8");
  cachedSql[sqlPath] = content;
  return content;
}
