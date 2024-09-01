import { Err, Ok, Result } from "@/lib/utilities/result";
import { BarkContext } from "../bark-context";
import {
  AdminAccount,
  AdminAccountSpec,
  AdminIdentifier,
} from "../models/admin-models";
import { CODE } from "@/lib/utilities/bark-code";
import { EncryptedAdminAccountDao } from "../daos/encrypted-admin-account-dao";
import {
  toAdminAccount,
  toEncryptedAdminAccountSpec,
} from "../mappers/admin-mappers";

export class AdminAccountService {
  constructor(private config: { context: BarkContext }) {}

  private getContext(): BarkContext {
    return this.config.context;
  }

  private getDao(): EncryptedAdminAccountDao {
    return new EncryptedAdminAccountDao(this.config.context.dbPool);
  }

  async createAdminAccount(args: {
    spec: AdminAccountSpec;
  }): Promise<Result<AdminIdentifier, typeof CODE.FAILED>> {
    try {
      const { spec } = args;
      const encryptedSpec = await toEncryptedAdminAccountSpec(
        this.getContext(),
        spec,
      );
      const dao = this.getDao();
      const id = await dao.insert({ spec: encryptedSpec });
      return Ok(id);
    } catch (err) {
      console.error(err);
      return Err(CODE.FAILED);
    }
  }

  async updateAdminAccount(args: {
    adminId: string;
    spec: AdminAccountSpec;
  }): Promise<
    typeof CODE.OK | typeof CODE.FAILED | typeof CODE.ERROR_ACCOUNT_NOT_FOUND
  > {
    try {
      const { adminId, spec } = args;
      const encryptedSpec = await toEncryptedAdminAccountSpec(
        this.getContext(),
        spec,
      );
      const dao = this.getDao();
      const didUpdate = await dao.update({ adminId, spec: encryptedSpec });
      if (!didUpdate) {
        return CODE.ERROR_ACCOUNT_NOT_FOUND;
      }
      return CODE.OK;
    } catch (err) {
      console.error(err);
      return CODE.FAILED;
    }
  }

  async getAllAdminAccounts(): Promise<
    Result<AdminAccount[], typeof CODE.FAILED>
  > {
    try {
      const context = this.getContext();
      const dao = this.getDao();
      const encryptedAccounts = await dao.getList();
      const futureAccounts = encryptedAccounts.map(async (encrypted) => {
        return toAdminAccount(context, encrypted);
      });
      const accounts = await Promise.all(futureAccounts);
      return Ok(accounts);
    } catch (err) {
      console.error(err);
      return Err(CODE.FAILED);
    }
  }

  // TODO: Cache this lookup using LRUCache. UserAccountService has an example.
  async getAdminIdByAdminEmail(args: {
    adminEmail: string;
  }): Promise<
    Result<
      AdminIdentifier,
      typeof CODE.FAILED | typeof CODE.ERROR_ACCOUNT_NOT_FOUND
    >
  > {
    try {
      const { emailHashService } = this.getContext();
      const { adminEmail } = args;
      const adminHashedEmail = await emailHashService.getHashHex(adminEmail);
      const dao = this.getDao();
      const id = await dao.getAdminIdByAdminHashedEmail({ adminHashedEmail });
      if (id === null) {
        return Err(CODE.ERROR_ACCOUNT_NOT_FOUND);
      }
      return Ok(id);
    } catch (err) {
      console.error(err);
      return Err(CODE.FAILED);
    }
  }

  async getAdminAccountByAdminId(args: {
    adminId: string;
  }): Promise<
    Result<
      AdminAccount,
      typeof CODE.FAILED | typeof CODE.ERROR_ACCOUNT_NOT_FOUND
    >
  > {
    try {
      const { adminId } = args;
      const context = this.getContext();
      const dao = this.getDao();
      const encryptedAccount = await dao.getByAdminId({ adminId });
      if (encryptedAccount === null) {
        return Err(CODE.ERROR_ACCOUNT_NOT_FOUND);
      }
      const account = await toAdminAccount(context, encryptedAccount);
      return Ok(account);
    } catch (err) {
      console.error(err);
      return Err(CODE.FAILED);
    }
  }

  async grantPermissionsToManageAdminAccounts(args: {
    adminId: string;
  }): Promise<Result<boolean, typeof CODE.FAILED>> {
    try {
      const { adminId } = args;
      const didUpdate =
        await this.getDao().grantPermissionsToManageAdminAccounts({ adminId });
      return Ok(didUpdate);
    } catch (err) {
      console.error(err);
      return Err(CODE.FAILED);
    }
  }
}
