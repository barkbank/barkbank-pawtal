import { PoolClient } from "pg";
import { UserActor } from "../user-actor";
import { SubProfile } from "../user-models";
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
import { PARTICIPATION_STATUS } from "@/lib/data/db-enums";

type Response =
  | "OK_UPDATED"
  | "ERROR_UNAUTHORIZED"
  | "ERROR_MISSING_DOG"
  | "ERROR_MISSING_REPORT"
  | "ERROR_UNEXPECTED_NON_PARTICIPATION_REASON"
  | "FAILURE_DB_UPDATE";

type Context = {
  actor: UserActor;
  subProfile: SubProfile;
};

export async function updateSubProfile(
  actor: UserActor,
  // WIP: dogId should be a param.
  subProfile: SubProfile,
): Promise<Response> {
  const validUpdateCheck = checkValidUpdate(subProfile);
  if (validUpdateCheck !== "OK") {
    return validUpdateCheck;
  }
  const ctx: Context = { actor, subProfile };
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

function checkValidUpdate(
  subProfile: SubProfile,
): "OK" | "ERROR_UNEXPECTED_NON_PARTICIPATION_REASON" {
  const { dogParticipationStatus, dogNonParticipationReason } = subProfile;
  if (
    dogParticipationStatus === PARTICIPATION_STATUS.PARTICIPATING &&
    dogNonParticipationReason !== ""
  ) {
    return "ERROR_UNEXPECTED_NON_PARTICIPATION_REASON";
  }
  return "OK";
}

async function checkOwnership(
  conn: PoolClient,
  ctx: Context,
): Promise<"OK" | "ERROR_MISSING_DOG" | "ERROR_UNAUTHORIZED"> {
  const { actor, subProfile } = ctx;
  const sql = `SELECT user_id as "ownerUserId" FROM dogs WHERE dog_id = $1`;
  const res = await dbQuery<{ ownerUserId: string }>(conn, sql, [
    subProfile.dogId,
  ]);
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
  const { subProfile } = ctx;
  const { dogId } = subProfile;
  const sql = `
  SELECT COUNT(1)::integer as "numReports"
  FROM reports
  WHERE dog_id = $1
  `;
  const res = await dbQuery<{ numReports: number }>(conn, sql, [dogId]);
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
  const { subProfile } = ctx;
  const {
    dogId,
    dogWeightKg,
    dogEverPregnant,
    dogEverReceivedTransfusion,
    dogParticipationStatus,
    dogPauseExpiryTime,
  } = subProfile;
  const [dogEncryptedOii, dogEncryptedReason] = await Promise.all([
    getDogEncryptedOii(ctx),
    getDogEncryptedReason(ctx),
  ]);
  const sql = `
  UPDATE dogs
  SET
    dog_encrypted_oii = $2,
    dog_weight_kg = $3,
    dog_ever_pregnant = $4,
    dog_ever_received_transfusion = $5,
    dog_participation_status = $6,
    dog_encrypted_reason = $7,
    dog_pause_expiry_time = $8
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
    dogEncryptedReason,
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
  const { subProfile } = ctx;
  const { dogId, dogPreferredVetId: vetId } = subProfile;
  await dbDeleteDogVetPreferences(conn, dogId);
  if (vetId !== null) {
    await dbInsertDogVetPreference(conn, dogId, vetId);
  }
  return "OK";
}

async function getDogEncryptedOii(ctx: Context): Promise<string> {
  const { actor, subProfile } = ctx;
  const { dogMapper } = actor.getParams();
  const { dogName } = subProfile;
  const { dogEncryptedOii } = await dogMapper.mapDogOiiToDogSecureOii({
    dogName,
  });
  return dogEncryptedOii;
}

async function getDogEncryptedReason(ctx: Context): Promise<string> {
  const { actor, subProfile } = ctx;
  const { textEncryptionService } = actor.getParams();
  const { dogParticipationStatus, dogNonParticipationReason } = subProfile;
  if (dogParticipationStatus === PARTICIPATION_STATUS.PARTICIPATING) {
    return "";
  }
  if (dogNonParticipationReason === "") {
    return "";
  }
  const dogEncryptedReason = await textEncryptionService.getEncryptedData(
    dogNonParticipationReason,
  );
  return dogEncryptedReason;
}
