import { Err, Ok, Result } from "@/lib/utilities/result";
import { VetAccount, VetAccountSpec } from "../models/vet-models";
import { CODE } from "@/lib/utilities/bark-code";
import { BarkContext } from "../bark-context";
import { toSecureVetAccountSpec } from "../mappers/to-secure-vet-account-spec";
import { SecureVetAccountDao } from "../queries/secure-vet-account-dao";
import { toVetAccount } from "../mappers/to-vet-account";

export async function opAddVetAccount(
  context: BarkContext,
  args: { spec: VetAccountSpec },
): Promise<Result<{ account: VetAccount }, typeof CODE.FAILED>> {
  const { dbPool } = context;
  const { spec } = args;
  try {
    const dao = new SecureVetAccountDao(dbPool);
    const secureSpec = await toSecureVetAccountSpec(context, spec);
    const secureAccount = await dao.insert({ secureSpec });
    const account = await toVetAccount(context, secureAccount);
    return Ok({ account });
  } catch (err) {
    console.error(err);
    return Err(CODE.FAILED);
  }
}
