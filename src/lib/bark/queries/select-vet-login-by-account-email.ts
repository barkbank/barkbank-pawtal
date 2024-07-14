import { DbContext, dbQuery } from "@/lib/data/db-utils";
import {
  VetLogin,
  VetLoginAccountSchema,
  VetLoginClinicSchema,
  VetLoginSchema,
} from "../models/vet-login";
import { z } from "zod";

export async function selectVetLoginByAccountEmail(
  db: DbContext,
  args: { email: string },
): Promise<VetLogin | null> {
  const { email } = args;
  const RowSchema = VetLoginAccountSchema.merge(VetLoginClinicSchema);
  type Row = z.infer<typeof RowSchema>;
  const sql = `
  SELECT
    tAccount.vet_account_id as "vetAccountId",
    tAccount.vet_account_email as "vetAccountEmail",
    tAccount.vet_account_name as "vetAccountName",
    tVet.vet_id as "vetId",
    tVet.vet_email as "vetEmail",
    tVet.vet_name as "vetName"
  FROM vet_accounts as tAccount
  LEFT JOIN vets as tVet on tAccount.vet_id = tVet.vet_id
  WHERE tAccount.vet_account_email = $1
  `;
  const res = await dbQuery<Row>(db, sql, [email]);
  if (res.rows.length !== 1) {
    return null;
  }
  const {
    vetAccountId,
    vetAccountEmail,
    vetAccountName,
    vetId,
    vetEmail,
    vetName,
  } = RowSchema.parse(res.rows[0]);
  const out: VetLogin = {
    clinic: { vetId, vetEmail, vetName },
    account: { vetAccountId, vetAccountEmail, vetAccountName },
  };
  return VetLoginSchema.parse(out);
}
