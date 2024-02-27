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

async function getSchema(): Promise<string> {
  const rootDir = path.dirname(path.resolve(process.cwd(), "package.json"));
  const filePath = path.resolve(rootDir, "db/schema.sql");
  const fileContent = fs.readFileSync(filePath, "utf-8");
  return fileContent;
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
  const dbSchema = await getSchema();
  await db.query(dbSchema);
  try {
    await testBody(db);
  } finally {
    await db.end();
    await dropDatabase(dbName);
  }
}
