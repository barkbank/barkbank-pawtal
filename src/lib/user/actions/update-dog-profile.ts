import {
  dbBegin,
  dbCommit,
  dbRelease,
  dbResultQuery,
  dbRollback,
} from "@/lib/data/db-utils";
import { UserActor } from "../user-actor";
import { DogProfile } from "../user-models";
import { PoolClient } from "pg";
import {
  dbDeleteDogVetPreferences,
  dbInsertDogVetPreference,
} from "@/lib/data/db-dogs";
import { CODE } from "@/lib/utilities/bark-code";

type Context = {
  actor: UserActor;
  dogId: string;
  dogProfile: DogProfile;
};

export async function updateDogProfile(
  actor: UserActor,
  dogId: string,
  dogProfile: DogProfile,
): Promise<
  | typeof CODE.OK
  | typeof CODE.ERROR_CANNOT_UPDATE_FULL_PROFILE
  | typeof CODE.ERROR_WRONG_OWNER
  | typeof CODE.ERROR_DOG_NOT_FOUND
  | typeof CODE.DB_QUERY_FAILURE
  | typeof CODE.EXCEPTION
> {
  const { dbPool } = actor.getParams();
  const ctx: Context = { actor, dogId, dogProfile };
  const conn = await dbPool.connect();
  try {
    await dbBegin(conn);
    const ownershipCheck = await checkOwnership(conn, ctx);
    if (ownershipCheck !== CODE.OK) {
      return ownershipCheck;
    }
    const reportCheck = await checkExistingReport(conn, ctx);
    if (reportCheck !== CODE.OK) {
      return reportCheck;
    }
    const updateFields = await updateDogFields(conn, ctx);
    if (updateFields !== CODE.OK) {
      return updateFields;
    }
    const updatePreference = await updateVetPreference(conn, ctx);
    if (updatePreference !== CODE.OK) {
      return updatePreference;
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
  | typeof CODE.ERROR_DOG_NOT_FOUND
  | typeof CODE.ERROR_WRONG_OWNER
  | typeof CODE.DB_QUERY_FAILURE
> {
  const { actor, dogId, dogProfile: update } = ctx;
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
  | typeof CODE.ERROR_CANNOT_UPDATE_FULL_PROFILE
> {
  const { dogId, dogProfile: update } = ctx;
  const sql = `SELECT COUNT(1)::integer as "numReports" FROM reports WHERE dog_id = $1`;
  const { result, error } = await dbResultQuery<{ numReports: number }>(
    conn,
    sql,
    [dogId],
  );
  if (error !== undefined) {
    return error;
  }
  const { numReports } = result.rows[0];
  if (numReports > 0) {
    return CODE.ERROR_CANNOT_UPDATE_FULL_PROFILE;
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
  const { result, error } = await dbResultQuery(conn, sql, [
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
    const { dogId, dogProfile } = ctx;
    const { dogPreferredVetId: vetId } = dogProfile;
    await dbDeleteDogVetPreferences(conn, dogId);
    if (vetId !== "") {
      await dbInsertDogVetPreference(conn, dogId, vetId);
    }
    return CODE.OK;
  } catch {
    return CODE.EXCEPTION;
  }
}
