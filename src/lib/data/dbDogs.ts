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
