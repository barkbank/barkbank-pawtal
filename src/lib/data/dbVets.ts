import { DbContext, dbQuery, toCamelCaseRow } from "./dbUtils";
import { Vet, VetGen, VetSpec } from "./models";

export async function dbInsertVet(
  ctx: DbContext,
  vetSpec: VetSpec,
): Promise<VetGen> {
  const sql = `
    INSERT INTO vets (
      vet_email,
      vet_name,
      vet_phone_number,
      vet_address
    )
    VALUES ($1, $2, $3, $4)
    RETURNING vet_id, vet_creation_time, vet_modification_time
  `;
  const res = await dbQuery(ctx, sql, [
    vetSpec.vetEmail,
    vetSpec.vetName,
    vetSpec.vetPhoneNumber,
    vetSpec.vetAddress,
  ]);
  return toCamelCaseRow(res.rows[0]);
}

export async function dbSelectVet(
  ctx: DbContext,
  vetId: string,
): Promise<Vet | null> {
  const sql = `
    SELECT
      vet_email,
      vet_name,
      vet_phone_number,
      vet_address,
      vet_id,
      vet_creation_time,
      vet_modification_time
    FROM vets
    WHERE vet_id = $1
  `;
  const res = await dbQuery(ctx, sql, [vetId]);
  if (res.rows.length === 1) {
    return toCamelCaseRow(res.rows[0]);
  }
  return null;
}

export async function dbSelectVetIdByEmail(
  ctx: DbContext,
  vetEmail: string,
): Promise<string | null> {
  const sql = `
    SELECT vet_id
    FROM vets
    WHERE vet_email = $1
  `;
  const res = await dbQuery(ctx, sql, [vetEmail]);
  if (res.rows.length === 1) {
    return res.rows[0].vet_id;
  }
  return null;
}
