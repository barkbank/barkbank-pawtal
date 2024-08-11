import { Err, Ok, Result } from "@/lib/utilities/result";
import { BarkContext } from "../bark-context";
import {
  UserAccount,
  UserAccountSpec,
  UserIdentifier,
} from "../models/user-models";
import { CODE } from "@/lib/utilities/bark-code";
import { dbBegin, dbCommit, dbRelease } from "@/lib/data/db-utils";
import { EncryptedUserAccountDao } from "../daos/encrypted-user-account-dao";
import {
  toEncryptedUserAccountSpec,
  toUserAccount,
} from "../mappers/user-mappers";
import { LRUCache } from "lru-cache";

export class UserAccountService {
  private idCache: LRUCache<string, UserIdentifier>;

  constructor(private context: BarkContext) {
    this.idCache = new LRUCache({ max: 10 });
  }

  async create(args: {
    spec: UserAccountSpec;
  }): Promise<
    Result<
      UserIdentifier,
      typeof CODE.FAILED | typeof CODE.ERROR_ACCOUNT_ALREADY_EXISTS
    >
  > {
    const { spec } = args;
    const conn = await this.context.dbPool.connect();
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

  async update(args: {
    userId: string;
    spec: UserAccountSpec;
  }): Promise<
    typeof CODE.OK | typeof CODE.FAILED | typeof CODE.ERROR_USER_NOT_FOUND
  > {
    const { userId, spec } = args;
    try {
      const dao = new EncryptedUserAccountDao(this.context.dbPool);
      const encrypted = await toEncryptedUserAccountSpec(this.context, spec);
      const didUpdate = await dao.updateByUserId({ userId, spec: encrypted });
      if (!didUpdate) {
        return CODE.ERROR_USER_NOT_FOUND;
      }
      return CODE.OK;
    } catch (err) {
      console.error(err);
      return CODE.FAILED;
    }
  }

  async getByUserId(args: {
    userId: string;
  }): Promise<
    Result<UserAccount, typeof CODE.FAILED | typeof CODE.ERROR_USER_NOT_FOUND>
  > {
    const { userId } = args;
    try {
      const dao = new EncryptedUserAccountDao(this.context.dbPool);
      const encrypted = await dao.getByUserId({ userId });
      if (encrypted === null) {
        return Err(CODE.ERROR_USER_NOT_FOUND);
      }
      const decrypted = await toUserAccount(this.context, encrypted);
      return Ok(decrypted);
    } catch (err) {
      console.error(err);
      return Err(CODE.FAILED);
    }
  }

  async getUserIdByUserEmail(args: {
    userEmail: string;
  }): Promise<
    Result<
      UserIdentifier,
      typeof CODE.ERROR_USER_NOT_FOUND | typeof CODE.FAILED
    >
  > {
    const { userEmail } = args;
    const { emailHashService, dbPool } = this.context;
    try {
      const userHashedEmail = await emailHashService.getHashHex(userEmail);
      const cached = this.idCache.get(userHashedEmail);
      if (cached !== undefined) {
        return Ok(cached);
      }
      const dao = new EncryptedUserAccountDao(dbPool);
      const identifier = await dao.getUserIdentifierByUserHashedEmail({
        userHashedEmail,
      });
      if (identifier === null) {
        return Err(CODE.ERROR_USER_NOT_FOUND);
      }
      this.idCache.set(userHashedEmail, identifier);
      return Ok(identifier);
    } catch (err) {
      console.error(err);
      return Err(CODE.FAILED);
    }
  }
}
