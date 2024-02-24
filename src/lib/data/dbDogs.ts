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
      dog_birth_month,
      dog_gender,
      dog_dea1_point1,

      dog_creation_time
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP)
    RETURNING dog_id, dog_creation_time
  `;
  const res = await dbQuery(ctx, sql, [
    userId,
    dogSpec.dogStatus,
    dogSpec.dogEncryptedOii,
    dogSpec.dogBreed,
    dogSpec.dogBirthMonth,
    dogSpec.dogGender,
    dogSpec.dogDea1Point1,
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
      dog_birth_month,
      dog_gender,
      dog_dea1_point1,

      dog_id,
      dog_creation_time
    FROM dogs
    WHERE dog_id = $1
  `;
  const res = await dbQuery(ctx, sql, [dogId]);
  if (res.rows.length === 1) {
    return toCamelCaseRow(res.rows[0]);
  }
  return null;
}
