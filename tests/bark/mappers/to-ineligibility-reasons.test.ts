import {
  IneligibilityFactors,
  IneligibilityFactorsSchema,
} from "@/lib/bark/models/ineligibility-factors";
import { givenDate } from "../_given";
import { YES_NO_UNKNOWN } from "@/lib/bark/enums/yes-no-unknown";
import { toIneligibilityReasons } from "@/lib/bark/mappers/to-ineligibility-reasons";
import { POS_NEG_NIL } from "@/lib/bark/enums/pos-neg-nil";
import { REPORTED_INELIGIBILITY } from "@/lib/bark/enums/reported-ineligibility";
import { INELIGIBILITY_REASON } from "@/lib/bark/enums/ineligibility-reason";
import { MILLIS_PER_DAY } from "@/lib/utilities/bark-millis";

describe("toIneligibilityReasons", () => {
  it("returns empty list when eligible", () => {
    const factors = _givenFactors();
    expect(toIneligibilityReasons(factors)).toEqual([]);
  });
  it("returns UNDER_ONE_YEAR_OLD when...", () => {
    const factors = _givenFactors({
      overrides: {
        dogBirthday: givenDate({ daysAgo: 364 }),
      },
    });
    expect(toIneligibilityReasons(factors)).toEqual([
      INELIGIBILITY_REASON.UNDER_ONE_YEAR_OLD,
    ]);
  });
  it("returns EIGHT_YEARS_OR_OLDER when...", () => {
    const factors = _givenFactors({
      overrides: {
        dogBirthday: givenDate({ yearsAgo: 8 }),
      },
    });
    expect(toIneligibilityReasons(factors)).toEqual([
      INELIGIBILITY_REASON.EIGHT_YEARS_OR_OLDER,
    ]);
  });
  it("returns UNDER_20_KGS when...", () => {
    const factors = _givenFactors({
      overrides: {
        latestDogWeightKg: 19.9,
      },
    });
    expect(toIneligibilityReasons(factors)).toEqual([
      INELIGIBILITY_REASON.UNDER_20_KGS,
    ]);
  });
  it("returns EVER_PREGNANT when...", () => {
    const factors = _givenFactors({
      overrides: {
        dogEverPregnant: YES_NO_UNKNOWN.YES,
      },
    });
    expect(toIneligibilityReasons(factors)).toEqual([
      INELIGIBILITY_REASON.EVER_PREGNANT,
    ]);
  });
  it("returns EVER_RECEIVED_BLOOD when...", () => {
    const factors = _givenFactors({
      overrides: {
        dogEverReceivedTransfusion: YES_NO_UNKNOWN.YES,
      },
    });
    expect(toIneligibilityReasons(factors)).toEqual([
      INELIGIBILITY_REASON.EVER_RECEIVED_BLOOD,
    ]);
  });
  it("returns HEARTWORM_IN_LAST_6_MONTHS when less than 180 days ago", () => {
    const now = new Date();
    const factors = _givenFactors({
      overrides: {
        latestDogHeartwormResult: POS_NEG_NIL.POSITIVE,
        latestDogHeartwormObservationTime: new Date(
          now.getTime() - 179 * MILLIS_PER_DAY,
        ),
      },
    });
    expect(toIneligibilityReasons(factors, { referenceTime: now })).toEqual([
      INELIGIBILITY_REASON.HEARTWORM_IN_LAST_6_MONTHS,
    ]);
  });
  it("does not return HEARTWORM_IN_LAST_6_MONTHS when more than 180 days or more ago.", () => {
    const now = new Date();
    const factors = _givenFactors({
      overrides: {
        latestDogHeartwormResult: POS_NEG_NIL.POSITIVE,
        latestDogHeartwormObservationTime: new Date(
          now.getTime() - 180 * MILLIS_PER_DAY,
        ),
      },
    });
    expect(toIneligibilityReasons(factors, { referenceTime: now })).toEqual([]);
  });
  it("returns DONATED_IN_LAST_3_MONTHS when less than 90 days ago", () => {
    const now = new Date();
    const factors = _givenFactors({
      overrides: {
        latestDonationTime: new Date(now.getTime() - 89 * MILLIS_PER_DAY),
      },
    });
    expect(toIneligibilityReasons(factors, { referenceTime: now })).toEqual([
      INELIGIBILITY_REASON.DONATED_IN_LAST_3_MONTHS,
    ]);
  });
  it("does not return DONATED_IN_LAST_3_MONTHS when 90 or more days ago", () => {
    const now = new Date();
    const factors = _givenFactors({
      overrides: {
        latestDonationTime: new Date(now.getTime() - 90 * MILLIS_PER_DAY),
      },
    });
    expect(toIneligibilityReasons(factors, { referenceTime: now })).toEqual([]);
  });
  it("returns REPORTED_BY_VET when PERMANENTLY_INELIGIBLE", () => {
    const factors = _givenFactors({
      overrides: {
        latestDogReportedIneligibility:
          REPORTED_INELIGIBILITY.PERMANENTLY_INELIGIBLE,
      },
    });
    expect(toIneligibilityReasons(factors)).toEqual([
      INELIGIBILITY_REASON.REPORTED_BY_VET,
    ]);
  });
  it("returns REPORTED_BY_VET when TEMPORARILY_INELIGIBLE and not expired", () => {
    const now = new Date();
    const factors = _givenFactors({
      overrides: {
        latestDogReportedIneligibility:
          REPORTED_INELIGIBILITY.TEMPORARILY_INELIGIBLE,
        latestDogReportedIneligibilityExpiryTime: new Date(
          now.getTime() + 1 * MILLIS_PER_DAY,
        ),
      },
    });
    expect(toIneligibilityReasons(factors, { referenceTime: now })).toEqual([
      INELIGIBILITY_REASON.REPORTED_BY_VET,
    ]);
  });
  it("does not return REPORTED_BY_VET when TEMPORARILY_INELIGIBLE but expired", () => {
    const now = new Date();
    const factors = _givenFactors({
      overrides: {
        latestDogReportedIneligibility:
          REPORTED_INELIGIBILITY.TEMPORARILY_INELIGIBLE,
        latestDogReportedIneligibilityExpiryTime: now,
      },
    });
    expect(toIneligibilityReasons(factors, { referenceTime: now })).toEqual([]);
  });
});

/**
 * Helper function to create IneligibilityFactors. Default behaviour with no
 * overrides returns factors that map to no ineligibility reasons.
 */
function _givenFactors(options?: {
  overrides?: Partial<IneligibilityFactors>;
}): IneligibilityFactors {
  const dogBirthday = givenDate({ yearsAgo: 3 });
  const base: IneligibilityFactors = {
    dogBirthday: givenDate({ yearsAgo: 3 }),
    dogEverPregnant: YES_NO_UNKNOWN.NO,
    dogEverReceivedTransfusion: YES_NO_UNKNOWN.NO,
    latestDogWeightKg: 20,
    latestDogHeartwormResult: POS_NEG_NIL.NIL,
    latestDogHeartwormObservationTime: null,
    latestDogReportedIneligibility: REPORTED_INELIGIBILITY.NIL,
    latestDogReportedIneligibilityExpiryTime: null,
    latestDonationTime: null,
  };
  const factors = { ...base, ...options?.overrides };
  return IneligibilityFactorsSchema.parse(factors);
}
