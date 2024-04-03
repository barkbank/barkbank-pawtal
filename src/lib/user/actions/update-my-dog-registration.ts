import { dbBegin, dbCommit, dbQuery, dbRelease } from "@/lib/data/db-utils";
import { UserActor } from "../user-actor";
import { MyDogRegistrationUpdate } from "../user-models";
import { PoolClient } from "pg";

type Result =
  | "OK_UPDATED"
  | "ERROR_REPORT_EXISTS"
  | "ERROR_UNAUTHORIZED"
  | "ERROR_MISSING_DOG";

type Context = {
  actor: UserActor;
  update: MyDogRegistrationUpdate;
};

export async function updateMyDogRegistration(
  actor: UserActor,
  update: MyDogRegistrationUpdate,
): Promise<Result> {
  const { dbPool } = actor.getParams();
  const ctx: Context = { actor, update };
  const conn = await dbPool.connect();
  try {
    await dbBegin(conn);
    const ownershipCheck = await checkOwnership(conn, ctx);
    if (ownershipCheck != "OK") {
      return ownershipCheck;
    }
    const reportCheck = await checkExistingReport(conn, ctx);
    if (reportCheck != "OK") {
      return reportCheck;
    }
    await dbCommit(conn);
    return "OK_UPDATED";
  } finally {
    await dbRelease(conn);
  }
}

async function checkOwnership(
  conn: PoolClient,
  ctx: Context,
): Promise<"OK" | "ERROR_MISSING_DOG" | "ERROR_UNAUTHORIZED"> {
  const { actor, update } = ctx;
  const sql = `SELECT user_id as "ownerUserId" FROM dogs WHERE dog_id = $1`;
  const res = await dbQuery(conn, sql, [update.dogId]);
  if (res.rows.length === 0) {
    return "ERROR_MISSING_DOG";
  }
  const { ownerUserId } = res.rows[0];
  const isOwner = actor.getUserId() === ownerUserId;
  if (!isOwner) {
    return "ERROR_UNAUTHORIZED";
  }
  return "OK";
}

async function checkExistingReport(
  conn: PoolClient,
  ctx: Context,
): Promise<"OK" | "ERROR_REPORT_EXISTS"> {
  const { actor, update } = ctx;
  const sql = `SELECT COUNT(1) as "numReports" FROM reports WHERE dog_id = $1`;
  const res = await dbQuery(conn, sql, [update.dogId]);
  const { numReports } = res.rows[0];
  if (numReports > 0) {
    return "ERROR_REPORT_EXISTS";
  }
  return "OK";
}
