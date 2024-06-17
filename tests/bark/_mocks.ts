import { DOG_GENDER } from "@/lib/bark/enums/dog-gender";
import { YES_NO_UNKNOWN } from "@/lib/bark/enums/yes-no-unknown";
import { BarkReportData } from "@/lib/bark/models/bark-report-data";
import { REPORTED_INELIGIBILITY } from "@/lib/data/db-enums";
import { POS_NEG_NIL } from "@/lib/bark/enums/pos-neg-nil";
import { DogSpec } from "@/lib/data/db-models";
import { MILLIS_PER_WEEK } from "@/lib/utilities/bark-millis";
import { weeksAgo } from "../_time_helpers";

export function mockEligibleDogOverrides(): Partial<DogSpec> {
  return {
    dogBreed: "Great Elidog",
    dogBirthday: weeksAgo(3 * 52), // about 3 years old
    dogGender: DOG_GENDER.FEMALE,
    dogWeightKg: 25,
    dogEverPregnant: YES_NO_UNKNOWN.NO,
    dogEverReceivedTransfusion: YES_NO_UNKNOWN.NO,
  };
}

export function mockReportData(): BarkReportData {
  return {
    visitTime: new Date(Date.now() - MILLIS_PER_WEEK),
    dogWeightKg: 25,
    dogBodyConditioningScore: 9,
    dogHeartworm: POS_NEG_NIL.NEGATIVE,
    dogDea1Point1: POS_NEG_NIL.NEGATIVE,
    ineligibilityStatus: REPORTED_INELIGIBILITY.NIL,
    ineligibilityReason: "",
    ineligibilityExpiryTime: null,
    dogDidDonateBlood: true,
  };
}
