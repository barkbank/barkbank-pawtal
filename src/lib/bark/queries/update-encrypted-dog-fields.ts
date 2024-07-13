import { DbContext, dbQuery } from "@/lib/data/db-utils";
import { EncryptedDogFields } from "../models/encrypted-dog-fields";

export async function updateEncryptedDogFields(
  dbContext: DbContext,
  args: {
    encryptedDogFields: EncryptedDogFields;
  },
): Promise<void> {
  const { dogId, dogEncryptedOii } = args.encryptedDogFields;
  const sql = `
  UPDATE dogs
  SET dog_encrypted_oii = $2
  WHERE dog_id = $1
  RETURNING 1
  `;
  const res = await dbQuery(dbContext, sql, [dogId, dogEncryptedOii]);
  if (res.rows.length !== 1) {
    throw new Error(`Failed to update dogs (dogId=${dogId})`);
  }
}
