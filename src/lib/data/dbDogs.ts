import { DbContext, dbQuery, toCamelCaseRow } from "./dbUtils";
import { Dog, DogGen, DogSpec } from "./models";

export async function dbInsertDog(
  ctx: DbContext,
  userId: string,
  dogSpec: DogSpec,
): Promise<DogGen> {
  const sql = `
    INSERT INTO dogs (
      user_id,
      dog_status,
      dog_encrypted_oii,
      dog_breed,
      dog_birthday,
      dog_gender,
      dog_weight_kg,
      dog_dea1_point1,
      dog_ever_pregnant,
      dog_ever_received_transfusion
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING dog_id, dog_creation_time, dog_modification_time
  `;
  const res = await dbQuery(ctx, sql, [
    userId,
    dogSpec.dogStatus,
    dogSpec.dogEncryptedOii,
    dogSpec.dogBreed,
    dogSpec.dogBirthday,
    dogSpec.dogGender,
    dogSpec.dogWeightKg,
    dogSpec.dogDea1Point1,
    dogSpec.dogEverPregnant,
    dogSpec.dogEverReceivedTransfusion,
  ]);
  return toCamelCaseRow(res.rows[0]);
}

export async function dbSelectDog(
  ctx: DbContext,
  dogId: string,
): Promise<Dog | null> {
  const sql = `
    SELECT
      user_id,
      dog_status,
      dog_encrypted_oii,
      dog_breed,
      dog_birthday,
      dog_gender,
      dog_weight_kg,
      dog_dea1_point1,
      dog_ever_pregnant,
      dog_ever_received_transfusion,

      dog_id,
      dog_creation_time,
      dog_modification_time
    FROM dogs
    WHERE dog_id = $1
  `;
  const res = await dbQuery(ctx, sql, [dogId]);
  if (res.rows.length === 1) {
    return toCamelCaseRow(res.rows[0]);
  }
  return null;
}

/**
 * Inserts a dog_vet_preferences record
 */
export async function dbInsertDogVetPreference(
  ctx: DbContext,
  dogId: string,
  vetId: string,
): Promise<boolean> {
  const sql = `
  WITH mIdentifiers AS (
    SELECT
      user_id,
      dog_id,
      CAST($2 as BIGINT) as vet_id
    FROM dogs
    WHERE dog_id = $1
    AND user_id IS NOT NULL
  )

  INSERT INTO dog_vet_preferences (user_id, dog_id, vet_id)
  SELECT user_id, dog_id, vet_id FROM mIdentifiers
  ON CONFLICT (dog_id, vet_id) DO NOTHING
  RETURNING preference_creation_time
  `;
  const res = await dbQuery(ctx, sql, [dogId, vetId]);
  return res.rows.length === 1;
}

export async function dbDeleteDogVetPreferences(
  ctx: DbContext,
  dogId: string,
): Promise<number> {
  const sql = `
  WITH
  mDeletion AS (
    DELETE FROM dog_vet_preferences WHERE dog_id = $1
    RETURNING *
  )
  SELECT COUNT(*) as num_deleted FROM mDeletion;
  `;
  const res = await dbQuery(ctx, sql, [dogId]);
  return parseInt(res.rows[0].num_deleted);
}

export async function dbSelectPreferredVetIds(
  ctx: DbContext,
  dogId: string,
): Promise<string[]> {
  const sql = `
  SELECT vet_id FROM dog_vet_preferences WHERE dog_id = $1
  `;
  const res = await dbQuery(ctx, sql, [dogId]);
  return res.rows.map((row) => row.vet_id);
}
