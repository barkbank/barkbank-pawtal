import { BarkContext } from "@/lib/bark/bark-context";
import { CODE } from "@/lib/utilities/bark-code";
import { Err, Ok, Result } from "@/lib/utilities/result";
import { IneligibilityFactors } from "../models/ineligibility-factors";
import { selectIneligibilityFactors } from "../queries/select-ineligibility-factors";

// WIP: Use this from???
export async function opGetIneligibilityFactors(
  context: BarkContext,
  args: { dogId: string },
): Promise<
  Result<
    { factors: IneligibilityFactors },
    typeof CODE.FAILED | typeof CODE.ERROR_DOG_NOT_FOUND
  >
> {
  const { dbPool } = context;
  const { dogId } = args;
  try {
    const factors = await selectIneligibilityFactors(dbPool, { dogId });
    if (factors === null) {
      return Err(CODE.ERROR_DOG_NOT_FOUND);
    }
    return Ok({ factors });
  } catch (err) {
    console.error(err);
    return Err(CODE.FAILED);
  }
}
