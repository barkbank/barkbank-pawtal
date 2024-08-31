import { Err, Ok, Result } from "@/lib/utilities/result";
import { BarkContext } from "../bark-context";
import { AdminAccountSpec, AdminIdentifier } from "../models/admin-models";
import { CODE } from "@/lib/utilities/bark-code";
import { EncryptedAdminAccountDao } from "../daos/encrypted-admin-account-dao";
import { toEncryptedAdminAccountSpec } from "../mappers/admin-mappers";

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
}
