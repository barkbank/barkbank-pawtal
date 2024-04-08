import { PoolClient } from "pg";
import { UserActor } from "../user-actor";
import { MyDogDetailsUpdate } from "../user-models";
import {
  dbBegin,
  dbCommit,
  dbQuery,
  dbRelease,
  dbRollback,
} from "@/lib/data/db-utils";
import {
  dbDeleteDogVetPreferences,
  dbInsertDogVetPreference,
} from "@/lib/data/db-dogs";

type Response =
  | "OK_UPDATED"
  | "ERROR_UNAUTHORIZED"
  | "ERROR_MISSING_DOG"
  | "ERROR_MISSING_REPORT"
  | "FAILURE_DB_UPDATE";

type Context = {
  actor: UserActor;
  update: MyDogDetailsUpdate;
};

export async function updateMyDogDetails(
  actor: UserActor,
  update: MyDogDetailsUpdate,
): Promise<Response> {
  const ctx: Context = { actor, update };
  const { dbPool } = actor.getParams();
  const conn = await dbPool.connect();
  try {
    await dbBegin(conn);
    const resOwnership = await checkOwnership(conn, ctx);
    if (resOwnership !== "OK") {
      return resOwnership;
    }
    const resCheckReports = await checkExistingReport(conn, ctx);
    if (resCheckReports !== "OK") {
      return resCheckReports;
    }
    const resUpdate = await updateDogFields(conn, ctx);
    if (resUpdate !== "OK") {
      return resUpdate;
    }
    await updateVetPreference(conn, ctx);
    await dbCommit(conn);
    return "OK_UPDATED";
  } finally {
    await dbRollback(conn);
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
): Promise<"OK" | "ERROR_MISSING_REPORT"> {
  const { update } = ctx;
  const { dogId } = update;
  const sql = `
  SELECT COUNT(1)::integer as "numReports"
  FROM reports
  WHERE dog_id = $1
  `;
  const res = await dbQuery(conn, sql, [dogId]);
  const { numReports } = res.rows[0];
  if (numReports === 0) {
    return "ERROR_MISSING_REPORT";
  }
  return "OK";
}

async function updateDogFields(
  conn: PoolClient,
  ctx: Context,
): Promise<"OK" | "FAILURE_DB_UPDATE"> {
  const { actor, update } = ctx;
  const { dogMapper } = actor.getParams();
  const {
    dogId,
    dogName,
    dogWeightKg,
    dogEverPregnant,
    dogEverReceivedTransfusion,
    dogParticipationStatus,
    dogPauseExpiryTime,
  } = update;
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
    dog_participation_status = $6,
    dog_pause_expiry_time = $7
  WHERE
    dog_id = $1
  RETURNING 1
  `;
  const res = await dbQuery(conn, sql, [
    dogId,
    dogEncryptedOii,
    dogWeightKg,
    dogEverPregnant,
    dogEverReceivedTransfusion,
    dogParticipationStatus,
    dogPauseExpiryTime,
  ]);
  if (res.rows.length !== 1) {
    return "FAILURE_DB_UPDATE";
  }
  return "OK";
}

async function updateVetPreference(
  conn: PoolClient,
  ctx: Context,
): Promise<"OK"> {
  const { update } = ctx;
  const { dogId, dogPreferredVetId: vetId } = update;
  await dbDeleteDogVetPreferences(conn, dogId);
  if (vetId !== null) {
    await dbInsertDogVetPreference(conn, dogId, vetId);
  }
  return "OK";
}
