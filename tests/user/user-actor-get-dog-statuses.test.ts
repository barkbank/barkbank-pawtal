import { givenUserActor, mockDogProfileSpec } from "../_fixtures";
import { DogStatuses } from "@/lib/bark/models/dog-statuses";
import { PARTICIPATION_STATUS } from "@/lib/bark/enums/participation-status";
import { MEDICAL_STATUS } from "@/lib/bark/enums/medical-status";
import { PROFILE_STATUS } from "@/lib/bark/enums/profile-status";
import { SERVICE_STATUS } from "@/lib/bark/enums/service-status";
import { YES_NO_UNKNOWN } from "@/lib/bark/enums/yes-no-unknown";
import { DOG_GENDER } from "@/lib/bark/enums/dog-gender";
import { dateAgo } from "../_time_helpers";
import { CODE } from "@/lib/utilities/bark-code";
import { withBarkContext } from "../bark/_context";

describe("UserActor::getDogStatuses", () => {
  it("should return ERROR_DOG_NOT_FOUND when the user does not own the requested dog", async () => {
    await withBarkContext(async ({ context }) => {
      // Given u2 owner of d3
      const u2 = await givenUserActor({ idx: 2, context });
      const d3 = (await u2.addDogProfile({ spec: mockDogProfileSpec() }))
        .result!;

      // When u1 attempts to retrieve statuses for d3
      const u1 = await givenUserActor({ idx: 1, context });
      const { result, error } = await u1.getDogStatuses({ dogId: d3.dogId });

      // Then...
      expect(result).toBeUndefined();
      expect(error).toEqual(CODE.ERROR_DOG_NOT_FOUND);
    });
  });
  it("should return ERROR_DOG_NOT_FOUND when the requested dog does not exist", async () => {
    await withBarkContext(async ({ context }) => {
      // Given user u1
      const u1 = await givenUserActor({ idx: 1, context });

      // When u1 attempts to retrieve statuses for a dog that does not exist
      const noSuchDogId = "1234567";
      const { result, error } = await u1.getDogStatuses({
        dogId: noSuchDogId,
      });

      // Then...
      expect(result).toBeUndefined();
      expect(error).toEqual(CODE.ERROR_DOG_NOT_FOUND);
    });
  });
  it("should return statuses of the requested dog", async () => {
    await withBarkContext(async ({ context }) => {
      // Given u1 with dog d2
      const u1 = await givenUserActor({ idx: 1, context });
      const spec = mockDogProfileSpec({
        dogBreed: "Happy Dog",
        dogBirthday: dateAgo({ numYears: 3 }),
        dogGender: DOG_GENDER.MALE,
        dogEverPregnant: YES_NO_UNKNOWN.NO,
        dogEverReceivedTransfusion: YES_NO_UNKNOWN.NO,
        dogWeightKg: 28.88,
      });
      const d2 = (await u1.addDogProfile({ spec })).result!;

      // When u2 calls getDogStatuses
      const { result, error } = await u1.getDogStatuses({ dogId: d2.dogId });

      // Then...
      const expected: DogStatuses = {
        dogServiceStatus: SERVICE_STATUS.AVAILABLE,
        dogMedicalStatus: MEDICAL_STATUS.ELIGIBLE,
        dogParticipationStatus: PARTICIPATION_STATUS.PARTICIPATING,
        dogProfileStatus: PROFILE_STATUS.COMPLETE,
        numPendingReports: 0,
      };
      expect(result).toEqual(expected);
      expect(error).toBeUndefined();
    });
  });
});
