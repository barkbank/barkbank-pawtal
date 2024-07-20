import { DbContext, dbQuery } from "@/lib/data/db-utils";
import {
  SecureVetAccount,
  SecureVetAccountSchema,
  SecureVetAccountSpec,
  SecureVetAccountSpecSchema,
} from "../models/vet-models";
import { QueryResult } from "pg";
import { z } from "zod";

export class SecureVetAccountDao {
  private selectFromVetAccounts = `
  SELECT
    vet_id as "vetId",
    vet_account_id as "vetAccountId",
    vet_account_hashed_email as "vetAccountHashedEmail",
    vet_account_encrypted_name as "vetAccountEncryptedName",
    vet_account_encrypted_email as "vetAccountEncryptedEmail"
  FROM vet_accounts
  `;
  constructor(private db: DbContext) {}

  async getByHashedEmail(args: {
    hashedEmail: string;
  }): Promise<SecureVetAccount | null> {
    const { hashedEmail } = args;
    const sql = this.getSql("WHERE vet_account_hashed_email = $1");
    const res = await dbQuery<SecureVetAccount>(this.db, sql, [hashedEmail]);
    return this.toRecordOrNull(res);
  }

  async listByVetId(args: { vetId: string }): Promise<SecureVetAccount[]> {
    const { vetId } = args;
    const sql = this.getSql("WHERE vet_id = $1");
    const res = await dbQuery<SecureVetAccount>(this.db, sql, [vetId]);
    return this.toList(res);
  }

  async insert(args: {
    spec: SecureVetAccountSpec;
  }): Promise<SecureVetAccount> {
    const { spec } = args;
    const {
      vetId,
      vetAccountHashedEmail,
      vetAccountEncryptedEmail,
      vetAccountEncryptedName,
    } = SecureVetAccountSpecSchema.parse(spec);
    const sql = `
    INSERT INTO vet_accounts (
      vet_id,
      vet_account_hashed_email,
      vet_account_encrypted_email,
      vet_account_encrypted_name
    )
    VALUES ($1, $2, $3, $4)
    RETURNING
      vet_id as "vetId",
      vet_account_id as "vetAccountId",
      vet_account_hashed_email as "vetAccountHashedEmail",
      vet_account_encrypted_name as "vetAccountEncryptedName",
      vet_account_encrypted_email as "vetAccountEncryptedEmail"
    `;
    const res = await dbQuery<SecureVetAccount>(this.db, sql, [
      vetId,
      vetAccountHashedEmail,
      vetAccountEncryptedEmail,
      vetAccountEncryptedName,
    ]);
    return this.toRecord(res);
  }

  private toList(res: QueryResult<SecureVetAccount>): SecureVetAccount[] {
    return z.array(SecureVetAccountSchema).parse(res.rows);
  }

  private toRecordOrNull(
    res: QueryResult<SecureVetAccount>,
  ): SecureVetAccount | null {
    if (res.rows.length !== 1) {
      return null;
    }
    return SecureVetAccountSchema.parse(res.rows[0]);
  }

  private toRecord(res: QueryResult<SecureVetAccount>): SecureVetAccount {
    return SecureVetAccountSchema.parse(res.rows[0]);
  }

  private getSql(clauses: string): string {
    return `${this.selectFromVetAccounts} ${clauses}`;
  }
}
