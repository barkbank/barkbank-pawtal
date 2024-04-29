import {
  dbBegin,
  dbCommit,
  dbQuery,
  dbRelease,
  dbRollback,
} from "@/lib/data/db-utils";
import { UserActor } from "../user-actor";
import { MyAccountDetailsUpdate } from "../user-models";
import { PoolClient } from "pg";
import { guaranteed } from "@/lib/utilities/bark-utils";

type Context = {
  actor: UserActor;
  update: MyAccountDetailsUpdate;
};

// WIP: Define the return type
export async function updateMyAccountDetails(
  actor: UserActor,
  update: MyAccountDetailsUpdate,
) {
  const ctx: Context = { actor, update };
  const { dbPool } = actor.getParams();
  const conn = await dbPool.connect();
  try {
    await dbBegin(conn);
    const resUpdate = await updateAccountFields(conn, ctx);
    if (resUpdate !== "OK") {
      return resUpdate;
    }
    await dbCommit(conn);
    return "OK_UPDATED";
  } finally {
    await dbRollback(conn);
    await dbRelease(conn);
  }
}

async function updateAccountFields(
  conn: PoolClient,
  ctx: Context,
): Promise<"OK" | "FAILURE_DB_UPDATE"> {
  const { actor, update } = ctx;
  const { userId, userMapper } = actor.getParams();
  const { userName, userPhoneNumber, userResidency } = update;

  const userPii = guaranteed(await actor.getOwnUserPii());
  const userEmail = userPii.userEmail;

  const { userEncryptedPii } = await userMapper.mapUserPiiToUserSecurePii({
    userName,
    userPhoneNumber,
    userEmail,
  });

  const sql = `
    UPDATE users
    SET
      user_residency = $2,
      user_encrypted_pii = $3
    WHERE 
      user_id = $1
    RETURNING
      1
  `;
  const res = await dbQuery(conn, sql, [
    userId,
    userResidency,
    userEncryptedPii,
  ]);

  if (res.rows.length !== 1) {
    return "FAILURE_DB_UPDATE";
  }
  return "OK";
}
