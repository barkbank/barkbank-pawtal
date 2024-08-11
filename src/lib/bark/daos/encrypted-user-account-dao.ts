import { DbContext, dbQuery } from "@/lib/data/db-utils";
import {
  EncryptedUserAccount,
  EncryptedUserAccountSchema,
  EncryptedUserAccountSpec,
  UserIdentifier,
  UserIdentifierSchema,
} from "../models/user-models";

export class EncryptedUserAccountDao {
  private projection: string = `
  user_id as "userId",
  user_encrypted_pii as "userEncryptedPii",
  user_residency as "userResidency",
  user_creation_time as "userCreationTime"
  `;

  constructor(private db: DbContext) {}

  async insert(args: {
    spec: EncryptedUserAccountSpec;
  }): Promise<UserIdentifier> {
    const { spec } = args;
    const sql = `
    INSERT INTO users (
      user_hashed_email,
      user_encrypted_pii,
      user_residency
    ) VALUES (
      $1, $2, $3
    )
    RETURNING user_id as "userId"
    `;
    const res = await dbQuery<UserIdentifier>(this.db, sql, [
      spec.userHashedEmail,
      spec.userEncryptedPii,
      spec.userResidency,
    ]);
    if (res.rows.length !== 1) {
      throw new Error("Failed to insert encrypted user account");
    }
    return UserIdentifierSchema.parse(res.rows[0]);
  }

  async getByUserId(args: {
    userId: string;
  }): Promise<EncryptedUserAccount | null> {
    const { userId } = args;
    const sql = `
    SELECT ${this.projection}
    FROM users
    WHERE user_id = $1
    `;
    const res = await dbQuery<EncryptedUserAccount>(this.db, sql, [userId]);
    if (res.rows.length !== 1) {
      return null;
    }
    return EncryptedUserAccountSchema.parse(res.rows[0]);
  }
}
