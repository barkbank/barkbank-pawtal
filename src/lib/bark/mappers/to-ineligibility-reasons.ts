import { IneligibilityReason } from "../enums/ineligibility-reason";
import { IneligibilityFactors } from "../models/ineligibility-factors";

/**
 * Maps factors into ineligibility reasons.
 *
 * One of the factors is age, which is derived from birthday against an optional
 * referenceTime that if left unspecified defaults to the current time.
 */
export function toIneligibilityReasons(
  factors: IneligibilityFactors,
  options?: {
    referenceTime?: Date;
  },
): IneligibilityReason[] {
  // WIP: Impl toIneligibilityReasons
  return [];
}
