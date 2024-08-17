import { Err, Ok, Result } from "@/lib/utilities/result";
import { BarkContext } from "../bark-context";
import {
  UserAccount,
  UserAccountSpec,
  UserAccountSpecSchema,
  UserAccountUpdate,
  UserIdentifier,
} from "../models/user-models";
import { CODE } from "@/lib/utilities/bark-code";
import { dbBegin, dbCommit, dbRelease, dbRollback } from "@/lib/data/db-utils";
import { EncryptedUserAccountDao } from "../daos/encrypted-user-account-dao";
import {
  toEncryptedUserAccountSpec,
  toUserAccount,
} from "../mappers/user-mappers";
import { LRUCache } from "lru-cache";
import { PoolClient } from "pg";

export class UserAccountService {
  private idCache: LRUCache<string, UserIdentifier>;

  constructor(private context: BarkContext) {
    this.idCache = new LRUCache({ max: 10 });
  }

  async create(args: {
    spec: UserAccountSpec;
    conn?: PoolClient | undefined;
  }): Promise<
    Result<
      UserIdentifier,
      typeof CODE.FAILED | typeof CODE.ERROR_ACCOUNT_ALREADY_EXISTS
    >
  > {
    const { spec } = args;
    if (args.conn !== undefined) {
      return this._create({ spec, conn: args.conn });
    }
    const conn = await this.context.dbPool.connect();
    try {
      await dbBegin(conn);
      const res = await this._create({ spec, conn });
      await dbCommit(conn);
      return res;
    } catch (err) {
      console.error(err);
      return Err(CODE.FAILED);
    } finally {
      await dbRelease(conn);
    }
  }

  private async _create(args: {
    spec: UserAccountSpec;
    conn: PoolClient;
  }): Promise<
    Result<UserIdentifier, typeof CODE.ERROR_ACCOUNT_ALREADY_EXISTS>
  > {
    const { spec, conn } = args;
    const encrypted = await toEncryptedUserAccountSpec(this.context, spec);
    const { userHashedEmail } = encrypted;
    const dao = new EncryptedUserAccountDao(conn);
    const existing = await dao.getByUserHashedEmail({ userHashedEmail });
    if (existing !== null) {
      return Err(CODE.ERROR_ACCOUNT_ALREADY_EXISTS);
    }
    const identifier = await dao.insert({ spec: encrypted });
    return Ok(identifier);
  }

  async applyUpdate(args: {
    userId: string;
    update: UserAccountUpdate;
  }): Promise<
    typeof CODE.OK | typeof CODE.FAILED | typeof CODE.ERROR_USER_NOT_FOUND
  > {
    const { context } = this;
    const { dbPool } = context;
    const { userId, update } = args;
    const conn = await dbPool.connect();
    try {
      await dbBegin(conn);
      const dao = new EncryptedUserAccountDao(conn);
      const encryptedAccount = await dao.getByUserId({ userId });
      if (encryptedAccount === null) {
        return CODE.ERROR_USER_NOT_FOUND;
      }
      const account = await toUserAccount(context, encryptedAccount);
      const merged = { ...account, ...update };
      const spec = UserAccountSpecSchema.parse(merged);
      const encryptedSpec = await toEncryptedUserAccountSpec(context, spec);
      const didUpdate = await dao.updateByUserId({
        userId,
        spec: encryptedSpec,
      });
      if (!didUpdate) {
        return CODE.ERROR_USER_NOT_FOUND;
      }
      await dbCommit(conn);
      return CODE.OK;
    } catch (err) {
      console.error(err);
      await dbRollback(conn);
      return CODE.FAILED;
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
