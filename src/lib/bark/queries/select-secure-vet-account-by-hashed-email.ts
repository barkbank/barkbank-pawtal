import { DbContext, dbQuery } from "@/lib/data/db-utils";
import { SecureVetAccount, SecureVetAccountSchema } from "../models/vet-models";

export async function selectSecureVetAccountByHashedEmail(
  db: DbContext,
  args: { hashedEmail: string },
): Promise<SecureVetAccount | null> {
  const { hashedEmail } = args;
  const sql = `
  SELECT
    vet_id as "vetId",
    vet_account_id as "vetAccountId",
    vet_account_hashed_email as "vetAccountHashedEmail",
    vet_account_encrypted_name as "vetAccountEncryptedName",
    vet_account_encrypted_email as "vetAccountEncryptedEmail"
  FROM vet_accounts
  WHERE vet_account_hashed_email = $1
  `;
  const res = await dbQuery<SecureVetAccount>(db, sql, [hashedEmail]);
  if (res.rows.length !== 1) {
    return null;
  }
  return SecureVetAccountSchema.parse(res.rows[0]);
}
