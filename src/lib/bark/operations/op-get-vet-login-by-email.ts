import { Err, Ok, Result } from "@/lib/utilities/result";
import { BarkContext } from "../bark-context";
import { CODE } from "@/lib/utilities/bark-code";
import { VetLogin } from "../models/vet-models";
import { dbRelease } from "@/lib/data/db-utils";
import { selectVetLoginClinicByEmail } from "../queries/select-vet-login-clinic-by-email";
import { selectVetLoginByAccountEmail } from "../queries/select-vet-login-by-account-email";
import { selectSecureVetAccountByHashedEmail } from "../queries/select-secure-vet-account-by-hashed-email";
import { selectVetClinicByEmail } from "../queries/select-vet-clinic-by-email";
import { VetClinicDao } from "../queries/vet-clinic-dao";

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
    const secureAccount = await selectSecureVetAccountByHashedEmail(conn, {
      hashedEmail,
    });
    // WIP Impl selectVetClinicById

    // WIP: Use selectVetAccountByHashedEmail to get a VetAccount | null
    // WIP: If account is available, use selectVetClinicById to get VetClinic | null - should not be null
    // WIP: If account is null, use selectVetClinicByEmail to get VetClinic | null

    // WIP: If clinic is not available, return ERROR_ACCOUNT_NOT_FOUND
    // WIP: Otherwise return a VetLogin.

    const [clinic, vetLogin] = await Promise.all([
      selectVetLoginClinicByEmail(conn, { email }),
      selectVetLoginByAccountEmail(conn, { email }),
    ]);
    if (clinic !== null && vetLogin !== null) {
      if (clinic.vetId !== vetLogin.clinic.vetId) {
        return Err(CODE.ERROR_MULTIPLE_VET_IDS);
      }
    }
    if (vetLogin !== null) {
      return Ok({ vetLogin });
    }
    if (clinic !== null) {
      // WIP: Fix this type error
      return Ok({ vetLogin: { clinic } });
    }
    return Err(CODE.ERROR_ACCOUNT_NOT_FOUND);
  } catch (err) {
    console.error(err);
    return Err(CODE.FAILED);
  } finally {
    await dbRelease(conn);
  }
}
