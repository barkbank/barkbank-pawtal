import { Err, Ok, Result } from "@/lib/utilities/result";
import { BarkContext } from "../bark-context";
import { CODE } from "@/lib/utilities/bark-code";
import { VetLogin } from "../models/vet-login";
import { dbRelease } from "@/lib/data/db-utils";
import { selectVetLoginClinicByEmail } from "../queries/select-vet-login-clinic-by-email";
import { selectVetLoginByAccountEmail } from "../queries/select-vet-login-by-account-email";

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
  const { dbPool } = context;
  const conn = await dbPool.connect();
  try {
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
