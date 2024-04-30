import { PoolClient } from "pg";
import { UserActor } from "../user-actor";
import { SubProfile } from "../user-models";
import {
  dbBegin,
  dbCommit,
  dbRelease,
  dbResultQuery,
  dbRollback,
} from "@/lib/data/db-utils";
import {
  dbDeleteDogVetPreferences,
  dbInsertDogVetPreference,
} from "@/lib/data/db-dogs";
import { CODE } from "@/lib/utilities/bark-code";

type Context = {
  actor: UserActor;
  dogId: string;
  subProfile: SubProfile;
};

export async function updateSubProfile(
  actor: UserActor,
  dogId: string,
  subProfile: SubProfile,
): Promise<
  | typeof CODE.OK
  | typeof CODE.DB_QUERY_FAILURE
  | typeof CODE.ERROR_WRONG_OWNER
  | typeof CODE.ERROR_DOG_NOT_FOUND
  | typeof CODE.ERROR_SHOULD_UPDATE_FULL_PROFILE
  | typeof CODE.EXCEPTION
> {
  const ctx: Context = { actor, dogId, subProfile };
  const { dbPool } = actor.getParams();
  const conn = await dbPool.connect();
  try {
    await dbBegin(conn);
    const resOwnership = await checkOwnership(conn, ctx);
    if (resOwnership !== CODE.OK) {
      return resOwnership;
    }
    const resCheckReports = await checkExistingReport(conn, ctx);
    if (resCheckReports !== CODE.OK) {
      return resCheckReports;
    }
    const resUpdate = await updateDogFields(conn, ctx);
    if (resUpdate !== CODE.OK) {
      return resUpdate;
    }
    const resPref = await updateVetPreference(conn, ctx);
    if (resPref !== CODE.OK) {
      return resPref;
    }
    await dbCommit(conn);
    return CODE.OK;
  } finally {
    await dbRollback(conn);
    await dbRelease(conn);
  }
}

async function checkOwnership(
  conn: PoolClient,
  ctx: Context,
): Promise<
  | typeof CODE.OK
  | typeof CODE.DB_QUERY_FAILURE
  | typeof CODE.ERROR_DOG_NOT_FOUND
  | typeof CODE.ERROR_WRONG_OWNER
> {
  const { actor, dogId, subProfile } = ctx;
  const sql = `SELECT user_id as "ownerUserId" FROM dogs WHERE dog_id = $1`;
  const { result, error } = await dbResultQuery<{ ownerUserId: string }>(
    conn,
    sql,
    [dogId],
  );
  if (error !== undefined) {
    return error;
  }
  if (result.rows.length === 0) {
    return CODE.ERROR_DOG_NOT_FOUND;
  }
  const { ownerUserId } = result.rows[0];
  const isOwner = actor.getUserId() === ownerUserId;
  if (!isOwner) {
    return CODE.ERROR_WRONG_OWNER;
  }
  return CODE.OK;
}

async function checkExistingReport(
  conn: PoolClient,
  ctx: Context,
): Promise<
  | typeof CODE.OK
  | typeof CODE.DB_QUERY_FAILURE
  | typeof CODE.ERROR_SHOULD_UPDATE_FULL_PROFILE
> {
  const { dogId, subProfile } = ctx;
  const sql = `
  SELECT COUNT(1)::integer as "numReports"
  FROM reports
  WHERE dog_id = $1
  `;
  const { result, error } = await dbResultQuery<{ numReports: number }>(
    conn,
    sql,
    [dogId],
  );
  if (error !== undefined) {
    return error;
  }
  const { numReports } = result.rows[0];
  if (numReports === 0) {
    return CODE.ERROR_SHOULD_UPDATE_FULL_PROFILE;
  }
  return CODE.OK;
}

async function updateDogFields(
  conn: PoolClient,
  ctx: Context,
): Promise<
  | typeof CODE.OK
  | typeof CODE.DB_QUERY_FAILURE
  | typeof CODE.ERROR_DOG_NOT_FOUND
> {
  const { dogId, subProfile, actor } = ctx;
  const { dogMapper } = actor.getParams();
  const { dogName, dogWeightKg, dogEverPregnant, dogEverReceivedTransfusion } =
    subProfile;
  const { dogEncryptedOii } = await dogMapper.mapDogOiiToDogSecureOii({
    dogName,
  });
  const sql = `
  UPDATE dogs
  SET
    dog_encrypted_oii = $2,
    dog_weight_kg = $3,
    dog_ever_pregnant = $4,
    dog_ever_received_transfusion = $5,
    profile_modification_time = CURRENT_TIMESTAMP
  WHERE
    dog_id = $1
  RETURNING 1
  `;
  const { result, error } = await dbResultQuery(conn, sql, [
    dogId,
    dogEncryptedOii,
    dogWeightKg,
    dogEverPregnant,
    dogEverReceivedTransfusion,
  ]);
  if (error !== undefined) {
    return error;
  }
  if (result.rows.length !== 1) {
    return CODE.ERROR_DOG_NOT_FOUND;
  }
  return CODE.OK;
}

async function updateVetPreference(
  conn: PoolClient,
  ctx: Context,
): Promise<typeof CODE.OK | typeof CODE.EXCEPTION> {
  try {
    const { dogId, subProfile } = ctx;
    const { dogPreferredVetId: vetId } = subProfile;
    await dbDeleteDogVetPreferences(conn, dogId);
    if (vetId !== "") {
      await dbInsertDogVetPreference(conn, dogId, vetId);
    }
    return CODE.OK;
  } catch {
    return CODE.EXCEPTION;
  }
}
