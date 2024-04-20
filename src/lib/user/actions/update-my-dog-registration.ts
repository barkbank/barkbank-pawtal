import {
  dbBegin,
  dbCommit,
  dbQuery,
  dbRelease,
  dbRollback,
} from "@/lib/data/db-utils";
import { UserActor } from "../user-actor";
import { MyDogRegistration } from "../user-models";
import { PoolClient } from "pg";
import {
  dbDeleteDogVetPreferences,
  dbInsertDogVetPreference,
} from "@/lib/data/db-dogs";
import { PARTICIPATION_STATUS } from "@/lib/data/db-enums";

type Response =
  | "OK_UPDATED"
  | "ERROR_REPORT_EXISTS"
  | "ERROR_UNAUTHORIZED"
  | "ERROR_MISSING_DOG"
  | "ERROR_UNEXPECTED_NON_PARTICIPATION_REASON"
  | "FAILURE_DB_UPDATE";

type Context = {
  actor: UserActor;
  update: MyDogRegistration;
};

// WIP: Change updateMyDogRegistration params to actor, dogId, MyDogRegistration
export async function updateMyDogRegistration(
  actor: UserActor,
  update: MyDogRegistration,
): Promise<Response> {
  const validUpdateCheck = checkValidUpdate(update);
  if (validUpdateCheck !== "OK") {
    return validUpdateCheck;
  }
  const { dbPool } = actor.getParams();
  const ctx: Context = { actor, update };
  const conn = await dbPool.connect();
  try {
    await dbBegin(conn);
    const ownershipCheck = await checkOwnership(conn, ctx);
    if (ownershipCheck !== "OK") {
      return ownershipCheck;
    }
    const reportCheck = await checkExistingReport(conn, ctx);
    if (reportCheck !== "OK") {
      return reportCheck;
    }
    const updateFields = await updateDogFields(conn, ctx);
    if (updateFields !== "OK") {
      return updateFields;
    }
    updateVetPreference(conn, ctx);
    await dbCommit(conn);
    return "OK_UPDATED";
  } finally {
    await dbRollback(conn);
    await dbRelease(conn);
  }
}

function checkValidUpdate(
  update: MyDogRegistration,
): "OK" | "ERROR_UNEXPECTED_NON_PARTICIPATION_REASON" {
  const { dogParticipationStatus, dogNonParticipationReason } = update;
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
  const { actor, update } = ctx;
  const sql = `SELECT user_id as "ownerUserId" FROM dogs WHERE dog_id = $1`;
  const res = await dbQuery<{ ownerUserId: string }>(conn, sql, [update.dogId]);
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
  const { update } = ctx;
  const sql = `SELECT COUNT(1)::integer as "numReports" FROM reports WHERE dog_id = $1`;
  const res = await dbQuery<{ numReports: number }>(conn, sql, [update.dogId]);
  const { numReports } = res.rows[0];
  if (numReports > 0) {
    return "ERROR_REPORT_EXISTS";
  }
  return "OK";
}

async function updateDogFields(
  conn: PoolClient,
  ctx: Context,
): Promise<"OK" | "FAILURE_DB_UPDATE"> {
  const { actor, update } = ctx;
  const {
    dogId,
    dogBreed,
    dogBirthday,
    dogGender,
    dogWeightKg,
    dogDea1Point1,
    dogEverPregnant,
    dogEverReceivedTransfusion,
    dogParticipationStatus,
    dogPauseExpiryTime,
  } = update;
  const [dogEncryptedOii, dogEncryptedReason] = await Promise.all([
    getDogEncryptedOii(ctx),
    getDogEncryptedReason(ctx),
  ]);
  const sql = `
  UPDATE dogs
  SET
    dog_encrypted_oii = $2,
    dog_breed = $3,
    dog_birthday = $4,
    dog_gender = $5,
    dog_weight_kg = $6,
    dog_dea1_point1 = $7,
    dog_ever_pregnant = $8,
    dog_ever_received_transfusion = $9,
    dog_participation_status = $10,
    dog_encrypted_reason = $11,
    dog_pause_expiry_time = $12
  WHERE
    dog_id = $1
  RETURNING 1
  `;
  const res = await dbQuery(conn, sql, [
    dogId,
    dogEncryptedOii,
    dogBreed,
    dogBirthday,
    dogGender,
    dogWeightKg,
    dogDea1Point1,
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
  const { update } = ctx;
  const { dogId, dogPreferredVetId: vetId } = update;
  await dbDeleteDogVetPreferences(conn, dogId);
  if (vetId !== null) {
    await dbInsertDogVetPreference(conn, dogId, vetId);
  }
  return "OK";
}

async function getDogEncryptedOii(ctx: Context): Promise<string> {
  const { actor, update } = ctx;
  const { dogMapper } = actor.getParams();
  const { dogName } = update;
  const { dogEncryptedOii } = await dogMapper.mapDogOiiToDogSecureOii({
    dogName,
  });
  return dogEncryptedOii;
}

async function getDogEncryptedReason(ctx: Context): Promise<string> {
  const { actor, update } = ctx;
  const { textEncryptionService } = actor.getParams();
  const { dogParticipationStatus, dogNonParticipationReason } = update;
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
