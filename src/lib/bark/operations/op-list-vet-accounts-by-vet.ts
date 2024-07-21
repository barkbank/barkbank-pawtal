import { Err, Ok, Result } from "@/lib/utilities/result";
import { BarkContext } from "../bark-context";
import { CODE } from "@/lib/utilities/bark-code";
import { SecureVetAccountDao } from "../daos/secure-vet-account-dao";
import { toVetAccount } from "../mappers/to-vet-account";
import { VetAccount } from "../models/vet-models";

export async function opListVetAccountsByVet(
  context: BarkContext,
  args: { vetId: string },
): Promise<Result<{ accounts: VetAccount[] }, typeof CODE.FAILED>> {
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
