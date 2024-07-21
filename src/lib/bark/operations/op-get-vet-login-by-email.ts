import { Err, Ok, Result } from "@/lib/utilities/result";
import { BarkContext } from "../bark-context";
import { CODE } from "@/lib/utilities/bark-code";
import { VetLogin } from "../models/vet-models";
import { dbRelease } from "@/lib/data/db-utils";
import { VetClinicDao } from "../daos/vet-clinic-dao";
import { SecureVetAccountDao } from "../daos/secure-vet-account-dao";
import { toVetAccount } from "../mappers/to-vet-account";

export async function opGetVetLoginByEmail(
  context: BarkContext,
  args: { email: string },
): Promise<
  Result<
    { vetLogin: VetLogin },
    | typeof CODE.FAILED
    | typeof CODE.ERROR_ACCOUNT_NOT_FOUND
    | typeof CODE.ERROR_MULTIPLE_VET_IDS
  >
> {
  const { email } = args;
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
