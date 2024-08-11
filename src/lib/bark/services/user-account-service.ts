import { Err, Ok, Result } from "@/lib/utilities/result";
import { BarkContext } from "../bark-context";
import {
  UserAccount,
  UserAccountSpec,
  UserIdentifier,
} from "../models/user-models";
import { CODE } from "@/lib/utilities/bark-code";
import { dbBegin, dbCommit, dbRelease } from "@/lib/data/db-utils";
import { PoolClient } from "pg";
import { EncryptedUserAccountDao } from "../daos/encrypted-user-account-dao";
import {
  toEncryptedUserAccountSpec,
  toUserAccount,
} from "../mappers/user-mappers";

export class UserAccountService {
  constructor(private context: BarkContext) {}

  async create(args: {
    spec: UserAccountSpec;
  }): Promise<
    Result<
      UserIdentifier,
      typeof CODE.FAILED | typeof CODE.ERROR_ACCOUNT_ALREADY_EXISTS
    >
  > {
    const { spec } = args;
    const conn = await this.getDbConnection();
    try {
      await dbBegin(conn);
      const encrypted = await toEncryptedUserAccountSpec(this.context, spec);
      const { userHashedEmail } = encrypted;
      const dao = new EncryptedUserAccountDao(conn);
      const existing = await dao.getByUserHashedEmail({ userHashedEmail });
      if (existing !== null) {
        return Err(CODE.ERROR_ACCOUNT_ALREADY_EXISTS);
      }
      const identifier = await dao.insert({ spec: encrypted });
      await dbCommit(conn);
      return Ok(identifier);
    } catch (err) {
      console.error(err);
      return Err(CODE.FAILED);
    } finally {
      await dbRelease(conn);
    }
  }

  async getByUserId(args: {
    userId: string;
  }): Promise<
    Result<UserAccount, typeof CODE.FAILED | typeof CODE.ERROR_USER_NOT_FOUND>
  > {
    const { userId } = args;
    const dao = new EncryptedUserAccountDao(this.context.dbPool);
    const encrypted = await dao.getByUserId({ userId });
    if (encrypted === null) {
      return Err(CODE.ERROR_USER_NOT_FOUND);
    }
    const decrypted = await toUserAccount(this.context, encrypted);
    return Ok(decrypted);
  }

  private getDbConnection(): Promise<PoolClient> {
    return this.context.dbPool.connect();
  }
}
