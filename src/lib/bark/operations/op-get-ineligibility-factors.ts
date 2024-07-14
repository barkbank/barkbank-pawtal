import { BarkContext } from "@/lib/bark/bark-context";
import { CODE } from "@/lib/utilities/bark-code";
import { Err, Result } from "@/lib/utilities/result";
import { IneligibilityFactors } from "../models/ineligibility-factors";

export async function opGetIneligibilityFactors(
  context: BarkContext,
  args: { dogId: string },
): Promise<
  Result<
    { factors: IneligibilityFactors },
    typeof CODE.FAILED | typeof CODE.ERROR_DOG_NOT_FOUND
  >
> {
  // WIP: Impl opGetIneligibilityFactors
  return Err(CODE.ERROR_DOG_NOT_FOUND);
}
