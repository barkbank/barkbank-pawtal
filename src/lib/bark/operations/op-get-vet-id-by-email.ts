import { Err, Ok, Result } from "@/lib/utilities/result";
import { BarkContext } from "../bark-context";
import { CODE } from "@/lib/utilities/bark-code";
import { selectVetIdListByEmail } from "../queries/select-vet-id-list-by-email";

export async function opGetVetIdByEmail(
  context: BarkContext,
  args: { email: string },
): Promise<
  Result<
    { vetId: string },
    | typeof CODE.FAILED
    | typeof CODE.ERROR_ACCOUNT_NOT_FOUND
    | typeof CODE.ERROR_MULTIPLE_VET_IDS
  >
> {
  const { email } = args;
  const { dbPool } = context;
  try {
    const vetIdList = await selectVetIdListByEmail(dbPool, { email });
    if (vetIdList.length === 0) {
      return Err(CODE.ERROR_ACCOUNT_NOT_FOUND);
    }
    if (vetIdList.length > 1) {
      return Err(CODE.ERROR_MULTIPLE_VET_IDS);
    }
    return Ok(vetIdList[0]);
  } catch (err) {
    console.error(err);
    return Err(CODE.FAILED);
  }
}
