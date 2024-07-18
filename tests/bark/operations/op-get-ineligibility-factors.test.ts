import { opGetIneligibilityFactors } from "@/lib/bark/operations/op-get-ineligibility-factors";
import { withBarkContext } from "../_context";
import { CODE } from "@/lib/utilities/bark-code";
import { givenDate, givenDog, givenReport } from "../_given";
import { YES_NO_UNKNOWN } from "@/lib/bark/enums/yes-no-unknown";
import { IneligibilityFactors } from "@/lib/bark/models/ineligibility-factors";
import { POS_NEG_NIL } from "@/lib/bark/enums/pos-neg-nil";
import { REPORTED_INELIGIBILITY } from "@/lib/bark/enums/reported-ineligibility";

describe("opGetIneligibilityFactors", () => {
  it("returns ERROR_DOG_NOT_FOUND when dog does not exist", async () => {
    await withBarkContext(async ({ context }) => {
      const dogId = "123";
      const { result, error } = await opGetIneligibilityFactors(context, {
        dogId,
      });
      expect(error).toEqual(CODE.ERROR_DOG_NOT_FOUND);
      expect(result).toBeUndefined();
    });
  });
  it("returns factors from dog profile", async () => {
    await withBarkContext(async ({ context }) => {
      const dogWeightKg = 88;
      const dogBirthday = givenDate({ yearsAgo: 3 });
      const dogEverPregnant = YES_NO_UNKNOWN.NO;
      const dogEverReceivedTransfusion = YES_NO_UNKNOWN.NO;
      const { dogId } = await givenDog(context, {
        dogOverrides: {
          dogWeightKg,
          dogBirthday,
          dogEverPregnant,
          dogEverReceivedTransfusion,
        },
      });
      const { result, error } = await opGetIneligibilityFactors(context, {
        dogId,
      });
      expect(error).toBeUndefined();
      const factors: IneligibilityFactors = result!.factors;

      // These should be resolved from the dog profile
      expect(factors.dogBirthday).toEqual(dogBirthday);
      expect(factors.dogEverPregnant).toEqual(dogEverPregnant);
      expect(factors.dogEverReceivedTransfusion).toEqual(
        dogEverReceivedTransfusion,
      );
      expect(factors.latestDogWeightKg).toEqual(dogWeightKg);

      // These should be null because there are no reports
      expect(factors.latestDogHeartwormResult).toBeNull();
      expect(factors.latestDogHeartwormObservationTime).toBeNull();
      expect(factors.latestDogReportedIneligibility).toBeNull();
      expect(factors.latestDogReportedIneligibilityExpiryTime).toBeNull();
      expect(factors.latestDonationTime).toBeNull();
    });
  });
  it("returns factors from reports", async () => {
    await withBarkContext(async ({ context }) => {
      const referenceDate = new Date();
      const dogWeightKg = 88;
      const dogBirthday = givenDate({ referenceDate, yearsAgo: 3 });
      const dogEverPregnant = YES_NO_UNKNOWN.NO;
      const dogEverReceivedTransfusion = YES_NO_UNKNOWN.NO;

      const visitTime = givenDate({ referenceDate, daysAgo: 6 });
      const latestDogWeightKg = 76;
      const latestDogHeartwormResult = POS_NEG_NIL.POSITIVE;

      const { dogId } = await givenReport(context, {
        dogOverrides: {
          dogWeightKg,
          dogBirthday,
          dogEverPregnant,
          dogEverReceivedTransfusion,
        },
        reportOverrides: {
          visitTime,
          dogWeightKg: latestDogWeightKg,
          dogHeartworm: latestDogHeartwormResult,
        },
      });
      const { result, error } = await opGetIneligibilityFactors(context, {
        dogId,
      });
      expect(error).toBeUndefined();
      const factors: IneligibilityFactors = result!.factors;

      // These should be resolved from the dog profile
      expect(factors.dogBirthday).toEqual(dogBirthday);
      expect(factors.dogEverPregnant).toEqual(dogEverPregnant);
      expect(factors.dogEverReceivedTransfusion).toEqual(
        dogEverReceivedTransfusion,
      );
      expect(factors.latestDogWeightKg).toEqual(dogWeightKg);

      // These should be null because there are no reports
      expect(factors.latestDogHeartwormResult).toEqual(
        latestDogHeartwormResult,
      );
      expect(factors.latestDogHeartwormObservationTime).toEqual(visitTime);
      expect(factors.latestDogReportedIneligibility).toEqual(
        REPORTED_INELIGIBILITY.NIL,
      );
      expect(factors.latestDogReportedIneligibilityExpiryTime).toBeNull();
      expect(factors.latestDonationTime).toBeNull();
    });
  });
});
