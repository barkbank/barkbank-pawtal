import { getAgeMonths } from "@/lib/utilities/bark-age";
import {
  INELIGIBILITY_REASON,
  IneligibilityReason,
  IneligibilityReasonSchema,
} from "../enums/ineligibility-reason";
import { IneligibilityFactors } from "../models/ineligibility-factors";
import { z } from "zod";
import { MILLIS_PER_DAY } from "@/lib/utilities/bark-millis";
import { YES_NO_UNKNOWN } from "../enums/yes-no-unknown";
import { POS_NEG_NIL } from "../enums/pos-neg-nil";
import { REPORTED_INELIGIBILITY } from "../enums/reported-ineligibility";

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
  const refTime = options?.referenceTime ?? new Date();
  const ageMonths = getAgeMonths(factors.dogBirthday, refTime);
  const daysAgo90 = new Date(refTime.getTime() - 90 * MILLIS_PER_DAY);
  const daysAgo180 = new Date(refTime.getTime() - 180 * MILLIS_PER_DAY);
  const result: IneligibilityReason[] = [];
  if (ageMonths < 12) {
    result.push(INELIGIBILITY_REASON.UNDER_ONE_YEAR_OLD);
  }
  if (ageMonths >= 8 * 12) {
    result.push(INELIGIBILITY_REASON.EIGHT_YEARS_OR_OLDER);
  }
  if (factors.latestDogWeightKg !== null && factors.latestDogWeightKg < 20) {
    result.push(INELIGIBILITY_REASON.UNDER_20_KGS);
  }
  if (factors.dogEverPregnant === YES_NO_UNKNOWN.YES) {
    result.push(INELIGIBILITY_REASON.EVER_PREGNANT);
  }
  if (factors.dogEverReceivedTransfusion === YES_NO_UNKNOWN.YES) {
    result.push(INELIGIBILITY_REASON.EVER_RECEIVED_BLOOD);
  }
  if (
    factors.latestDogHeartwormResult === POS_NEG_NIL.POSITIVE &&
    factors.latestDogHeartwormObservationTime !== null &&
    factors.latestDogHeartwormObservationTime.getTime() > daysAgo180.getTime()
  ) {
    result.push(INELIGIBILITY_REASON.HEARTWORM_IN_LAST_6_MONTHS);
  }
  if (
    factors.latestDogReportedIneligibility ===
    REPORTED_INELIGIBILITY.PERMANENTLY_INELIGIBLE
  ) {
    result.push(INELIGIBILITY_REASON.REPORTED_BY_VET);
  }
  if (
    factors.latestDogReportedIneligibility ===
      REPORTED_INELIGIBILITY.TEMPORARILY_INELIGIBLE &&
    factors.latestDogReportedIneligibilityExpiryTime !== null &&
    factors.latestDogReportedIneligibilityExpiryTime.getTime() >
      refTime.getTime()
  ) {
    result.push(INELIGIBILITY_REASON.REPORTED_BY_VET);
  }
  if (
    factors.latestDonationTime !== null &&
    factors.latestDonationTime.getTime() > daysAgo90.getTime()
  ) {
    result.push(INELIGIBILITY_REASON.DONATED_IN_LAST_3_MONTHS);
  }
  return z.array(IneligibilityReasonSchema).parse(result);
}
