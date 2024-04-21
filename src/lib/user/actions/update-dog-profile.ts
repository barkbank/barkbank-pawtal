import {
  dbBegin,
  dbCommit,
  dbQuery,
  dbRelease,
  dbRollback,
} from "@/lib/data/db-utils";
import { UserActor } from "../user-actor";
import { DogProfile } from "../user-models";
import { PoolClient } from "pg";
import {
  dbDeleteDogVetPreferences,
  dbInsertDogVetPreference,
} from "@/lib/data/db-dogs";

type Response =
  | "OK_UPDATED"
  | "ERROR_REPORT_EXISTS"
  | "ERROR_UNAUTHORIZED"
  | "ERROR_MISSING_DOG"
  | "FAILURE_DB_UPDATE";

type Context = {
  actor: UserActor;
  dogId: string;
  dogProfile: DogProfile;
};

export async function updateDogProfile(
  actor: UserActor,
  dogId: string,
  dogProfile: DogProfile,
): Promise<Response> {
  const { dbPool } = actor.getParams();
  const ctx: Context = { actor, dogId, dogProfile };
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

async function checkOwnership(
  conn: PoolClient,
  ctx: Context,
): Promise<"OK" | "ERROR_MISSING_DOG" | "ERROR_UNAUTHORIZED"> {
  const { actor, dogId, dogProfile: update } = ctx;
  const sql = `SELECT user_id as "ownerUserId" FROM dogs WHERE dog_id = $1`;
  const res = await dbQuery<{ ownerUserId: string }>(conn, sql, [dogId]);
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
  const { dogId, dogProfile: update } = ctx;
  const sql = `SELECT COUNT(1)::integer as "numReports" FROM reports WHERE dog_id = $1`;
  const res = await dbQuery<{ numReports: number }>(conn, sql, [dogId]);
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
  const { actor, dogId, dogProfile } = ctx;
  const { dogMapper } = actor.getParams();
  const {
    dogName,
    dogBreed,
    dogBirthday,
    dogGender,
    dogWeightKg,
    dogDea1Point1,
    dogEverPregnant,
    dogEverReceivedTransfusion,
  } = dogProfile;
  const { dogEncryptedOii } = await dogMapper.mapDogOiiToDogSecureOii({
    dogName,
  });
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
    profile_modification_time = CURRENT_TIMESTAMP
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
  const { dogId, dogProfile } = ctx;
  const { dogPreferredVetId: vetId } = dogProfile;
  await dbDeleteDogVetPreferences(conn, dogId);
  if (vetId !== "") {
    await dbInsertDogVetPreference(conn, dogId, vetId);
  }
  return "OK";
}
