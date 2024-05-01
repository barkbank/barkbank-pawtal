import {
  dbBegin,
  dbCommit,
  dbRelease,
  dbResultQuery,
  dbRollback,
} from "@/lib/data/db-utils";
import { UserActor } from "../user-actor";
import { MyAccountDetailsUpdate } from "../user-models";
import { PoolClient } from "pg";
import { guaranteed } from "@/lib/utilities/bark-utils";
import { CODE } from "@/lib/utilities/bark-code";

type Context = {
  actor: UserActor;
  update: MyAccountDetailsUpdate;
};

export async function updateMyAccountDetails(
  actor: UserActor,
  update: MyAccountDetailsUpdate,
): Promise<
  | typeof CODE.OK
  | typeof CODE.ERROR_USER_NOT_FOUND
  | typeof CODE.DB_QUERY_FAILURE
> {
  const ctx: Context = { actor, update };
  const { dbPool } = actor.getParams();
  const conn = await dbPool.connect();
  try {
    await dbBegin(conn);
    const resUpdate = await updateAccountFields(conn, ctx);
    if (resUpdate !== CODE.OK) {
      return resUpdate;
    }
    await dbCommit(conn);
    return CODE.OK;
  } finally {
    await dbRollback(conn);
    await dbRelease(conn);
  }
}

async function updateAccountFields(
  conn: PoolClient,
  ctx: Context,
): Promise<
  | typeof CODE.OK
  | typeof CODE.ERROR_USER_NOT_FOUND
  | typeof CODE.DB_QUERY_FAILURE
> {
  const { actor, update } = ctx;
  const { userId, userMapper } = actor.getParams();
  const { userName, userPhoneNumber, userResidency } = update;

  // TODO: this query does not use the "conn" and so it is not part of the transaction.
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
  const { result, error } = await dbResultQuery(conn, sql, [
    userId,
    userResidency,
    userEncryptedPii,
  ]);
  if (error !== undefined) {
    return error;
  }
  if (result.rows.length !== 1) {
    return CODE.ERROR_USER_NOT_FOUND;
  }
  return CODE.OK;
}
