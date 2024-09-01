import { DbContext, dbQuery } from "@/lib/data/db-utils";
import {
  AdminIdentifier,
  AdminIdentifierSchema,
  EncryptedAdminAccount,
  EncryptedAdminAccountSchema,
  EncryptedAdminAccountSpec,
} from "../models/admin-models";
import { z } from "zod";

export class EncryptedAdminAccountDao {
  private projection: string = `
  admin_id as "adminId",
  admin_hashed_email as "adminHashedEmail",
  admin_encrypted_pii as "adminEncryptedPii",
  admin_can_manage_admin_accounts as "adminCanManageAdminAccounts",
  admin_can_manage_vet_accounts as "adminCanManageVetAccounts",
  admin_can_manage_user_accounts as "adminCanManageUserAccounts",
  admin_can_manage_donors as "adminCanManageDonors"
  `;

  constructor(private db: DbContext) {}

  async getByAdminId(args: {
    adminId: string;
  }): Promise<EncryptedAdminAccount | null> {
    const { adminId } = args;
    const sql = `
    SELECT ${this.projection}
    FROM admins
    WHERE admin_id = $1
    `;
    const res = await dbQuery<EncryptedAdminAccount>(this.db, sql, [adminId]);
    if (res.rows.length !== 1) {
      return null;
    }
    return EncryptedAdminAccountSchema.parse(res.rows[0]);
  }

  async getAdminIdByAdminHashedEmail(args: {
    adminHashedEmail: string;
  }): Promise<AdminIdentifier | null> {
    const { adminHashedEmail } = args;
    const sql = `
    SELECT admin_id as "adminId"
    FROM admins
    WHERE admin_hashed_email = $1
    `;
    const res = await dbQuery<AdminIdentifier>(this.db, sql, [
      adminHashedEmail,
    ]);
    if (res.rows.length !== 1) {
      return null;
    }
    return AdminIdentifierSchema.parse(res.rows[0]);
  }

  async getList(): Promise<EncryptedAdminAccount[]> {
    const sql = `
    SELECT ${this.projection}
    FROM admins
    ORDER BY admin_id
    `;
    const res = await dbQuery<EncryptedAdminAccount>(this.db, sql, []);
    return z.array(EncryptedAdminAccountSchema).parse(res.rows);
  }

  async insert(args: {
    spec: EncryptedAdminAccountSpec;
  }): Promise<AdminIdentifier> {
    const { spec } = args;
    const sql = `
    INSERT INTO admins (
      admin_hashed_email,
      admin_encrypted_pii,
      admin_can_manage_admin_accounts,
      admin_can_manage_vet_accounts,
      admin_can_manage_user_accounts,
      admin_can_manage_donors
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING admin_id as "adminId"
    `;
    const res = await dbQuery<AdminIdentifier>(this.db, sql, [
      spec.adminHashedEmail,
      spec.adminEncryptedPii,
      spec.adminCanManageAdminAccounts,
      spec.adminCanManageVetAccounts,
      spec.adminCanManageUserAccounts,
      spec.adminCanManageDonors,
    ]);
    return AdminIdentifierSchema.parse(res.rows[0]);
  }

  async update(args: {
    adminId: string;
    spec: EncryptedAdminAccountSpec;
  }): Promise<boolean> {
    const { adminId, spec } = args;
    const sql = `
    UPDATE admins
    SET
      admin_hashed_email = $2,
      admin_encrypted_pii = $3,
      admin_can_manage_admin_accounts = $4,
      admin_can_manage_vet_accounts = $5,
      admin_can_manage_user_accounts = $6,
      admin_can_manage_donors = $7
    WHERE admin_id = $1
    RETURNING 1
    `;
    const res = await dbQuery(this.db, sql, [
      adminId,
      spec.adminHashedEmail,
      spec.adminEncryptedPii,
      spec.adminCanManageAdminAccounts,
      spec.adminCanManageVetAccounts,
      spec.adminCanManageUserAccounts,
      spec.adminCanManageDonors,
    ]);
    const didUpdate = res.rows.length === 1;
    return didUpdate;
  }

  async delete(args: { adminId: string }): Promise<boolean> {
    const { adminId } = args;
    const sql = `
    DELETE FROM admins
    WHERE admin_id = $1
    RETURNING 1
    `;
    const res = await dbQuery(this.db, sql, [adminId]);
    const didDelete = res.rows.length === 1;
    return didDelete;
  }

  async grantPermissionsToManageAdminAccounts(args: {
    adminId: string;
  }): Promise<boolean> {
    const { adminId } = args;
    const sql = `
    UPDATE admins
    SET admin_can_manage_admin_accounts = TRUE
    WHERE admin_id = $1
    AND admin_can_manage_admin_accounts = FALSE
    RETURNING 1
    `;
    const res = await dbQuery(this.db, sql, [adminId]);
    const didUpdate = res.rows.length === 1;
    return didUpdate;
  }
}
