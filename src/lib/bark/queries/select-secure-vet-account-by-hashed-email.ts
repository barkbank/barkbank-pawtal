import { DbContext, dbQuery } from "@/lib/data/db-utils";
import { SecureVetAccount, SecureVetAccountSchema } from "../models/vet-models";
import { SecureVetAccountDao } from "./secure-vet-account-dao";

// WIP: Deprecate
export async function selectSecureVetAccountByHashedEmail(
  db: DbContext,
  args: { hashedEmail: string },
): Promise<SecureVetAccount | null> {
  const { hashedEmail } = args;
  const dao = new SecureVetAccountDao(db);
  return dao.getByHashedEmail({ hashedEmail });
}
