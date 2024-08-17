import { Err, Ok, Result } from "@/lib/utilities/result";
import { BarkContext } from "../bark-context";
import { VetAccount, VetClinic } from "../models/vet-models";
import { CODE } from "@/lib/utilities/bark-code";
import { VetClinicDao } from "../daos/vet-clinic-dao";
import { SecureVetAccountDao } from "../daos/secure-vet-account-dao";
import { toVetAccount } from "../mappers/to-vet-account";

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
}
