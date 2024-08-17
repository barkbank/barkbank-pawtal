import { Err, Ok, Result } from "@/lib/utilities/result";
import { BarkContext } from "../bark-context";
import { VetAccount, VetClinic, VetLogin } from "../models/vet-models";
import { CODE } from "@/lib/utilities/bark-code";
import { VetClinicDao } from "../daos/vet-clinic-dao";
import { SecureVetAccountDao } from "../daos/secure-vet-account-dao";
import { toVetAccount } from "../mappers/to-vet-account";
import { dbRelease } from "@/lib/data/db-utils";

export class VetAccountService {
  constructor(private config: { context: BarkContext }) {}

  async getVetClinics(): Promise<
    Result<{ clinics: VetClinic[] }, typeof CODE.FAILED>
  > {
    const { dbPool } = this.config.context;
    try {
      const vetClinicDao = new VetClinicDao(dbPool);
      const clinics: VetClinic[] = await vetClinicDao.listAll();
      return Ok({ clinics });
    } catch (err) {
      console.error(err);
      return Err(CODE.FAILED);
    }
  }

  async getVetAccountsByVetId(args: {
    vetId: string;
  }): Promise<Result<{ accounts: VetAccount[] }, typeof CODE.FAILED>> {
    const { context } = this.config;
    const { dbPool } = context;
    const { vetId } = args;
    try {
      const secureDao = new SecureVetAccountDao(dbPool);
      const secureAccounts = await secureDao.listByVetId({ vetId });
      const promises = secureAccounts.map((secureAccount) =>
        toVetAccount(context, secureAccount),
      );
      const accounts = await Promise.all(promises);
      return Ok({ accounts });
    } catch (err) {
      console.error(err);
      return Err(CODE.FAILED);
    }
  }

  async getVetLoginByEmail(args: {
    email: string;
  }): Promise<
    Result<
      { vetLogin: VetLogin },
      | typeof CODE.FAILED
      | typeof CODE.ERROR_ACCOUNT_NOT_FOUND
      | typeof CODE.ERROR_MULTIPLE_VET_IDS
    >
  > {
    const { email } = args;
    const { context } = this.config;
    const { emailHashService, dbPool } = context;
    const conn = await dbPool.connect();
    try {
      const hashedEmail = await emailHashService.getHashHex(email);
      const secureAccountDao = new SecureVetAccountDao(conn);
      const clinicDao = new VetClinicDao(conn);
      const secureAccount = await secureAccountDao.getByHashedEmail({
        hashedEmail,
      });
      const clinicByEmail = await clinicDao.getByEmail({ email });
      const clinicByVetId =
        secureAccount === null
          ? null
          : await clinicDao.getByVetId({ vetId: secureAccount.vetId });
      if (clinicByEmail !== null && clinicByVetId !== null) {
        if (clinicByEmail.vetId !== clinicByVetId.vetId) {
          return Err(CODE.ERROR_MULTIPLE_VET_IDS);
        }
      }
      const clinic = clinicByEmail || clinicByVetId;
      if (clinic === null) {
        return Err(CODE.ERROR_ACCOUNT_NOT_FOUND);
      }
      if (secureAccount === null) {
        return Ok({
          vetLogin: { clinic },
        });
      }
      const account = await toVetAccount(context, secureAccount);
      return Ok({
        vetLogin: { clinic, account },
      });
    } catch (err) {
      console.error(err);
      return Err(CODE.FAILED);
    } finally {
      await dbRelease(conn);
    }
  }
}
