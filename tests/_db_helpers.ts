import path from "path";
import fs from "fs";
import pg from "pg";

function getPoolConfig(dbName?: string): pg.PoolConfig {
  const theDbName = dbName || "postgres";
  return {
    host: "localhost",
    port: 5999,
    user: "postgres",
    password: "password",
    database: theDbName,
  };
}

async function readFile(filePath: string): Promise<string> {
  const rootDir = path.dirname(path.resolve(process.cwd(), "package.json"));
  const absPath = path.resolve(rootDir, filePath);
  const fileContent = fs.readFileSync(absPath, "utf-8");
  return fileContent;
}

async function migrate(db: pg.Pool, filePath: string): Promise<void> {
  const dbSchema = await readFile(filePath);
  await db.query(dbSchema);
}

const getDbName = (() => {
  let count = 0;
  return (prefix: string) => {
    count += 1;
    return `${prefix}${count}`;
  };
})();

async function createDatabase(): Promise<string> {
  const db = new pg.Pool(getPoolConfig());
  const ts = new Date().getTime();
  const nonce = Math.floor(Math.random() * 1000000);
  const dbName = getDbName(`testdb_${ts}_${nonce}`);
  await db.query(`CREATE DATABASE ${dbName}`);
  await db.end();
  return dbName;
}

async function dropDatabase(dbName: string): Promise<void> {
  const db = new pg.Pool(getPoolConfig());
  await db.query(`DROP DATABASE ${dbName}`);
  await db.end();
}

export async function withDb(testBody: (db: pg.Pool) => Promise<void>) {
  const dbName = await createDatabase();
  const db = new pg.Pool(getPoolConfig(dbName));
  await migrate(db, "db/V1__ref_types.sql");
  await migrate(db, "db/V2__ref_tables.sql");
  await migrate(db, "db/V2_1__enable_rls.sql");
  await migrate(db, "db/V3__ref_triggers.sql");
  await migrate(db, "db/V4__ref_latest_values.sql");
  await migrate(db, "db/V5__ref_dog_statuses.sql");
  try {
    await testBody(db);
  } finally {
    await db.end();
    await dropDatabase(dbName);
  }
}
