import { getDogStatuses } from "@/lib/user/actions/get-dog-statuses";
import { withDb } from "../_db_helpers";
import { getUserActor, insertDog, insertUser } from "../_fixtures";
import { DogStatuses } from "@/lib/user/user-models";
import {
  DOG_GENDER,
  MEDICAL_STATUS,
  PARTICIPATION_STATUS,
  PROFILE_STATUS,
  SERVICE_STATUS,
  YES_NO_UNKNOWN,
} from "@/lib/data/db-enums";
import { dateAgo } from "../_time_helpers";

describe("getDogStatuses", () => {
  it("should return ERROR_UNAUTHORIZED when the user does not own the requested dog", async () => {
    await withDb(async (dbPool) => {
      const u1 = await insertUser(1, dbPool);
      const u2 = await insertUser(2, dbPool);
      const d3 = await insertDog(3, u2.userId, dbPool);
      const actor = getUserActor(dbPool, u1.userId);
      const { result, error } = await getDogStatuses(actor, d3.dogId);
      expect(result).toBeUndefined();
      expect(error).toEqual("ERROR_UNAUTHORIZED");
    });
  });
  it("should return ERROR_MISSING_DOG when the requested dog does not exist", async () => {
    await withDb(async (dbPool) => {
      const u1 = await insertUser(1, dbPool);
      const noSuchDogId = "1234567";
      const actor = getUserActor(dbPool, u1.userId);
      const { result, error } = await getDogStatuses(actor, noSuchDogId);
      expect(result).toBeUndefined();
      expect(error).toEqual("ERROR_MISSING_DOG");
    });
  });
  it("should return statuses of the requested dog", async () => {
    await withDb(async (dbPool) => {
      const u1 = await insertUser(1, dbPool);
      const d2 = await insertDog(2, u1.userId, dbPool, {
        dogBreed: "Happy Dog",
        dogBirthday: dateAgo({ numYears: 3 }),
        dogGender: DOG_GENDER.MALE,
        dogEverPregnant: YES_NO_UNKNOWN.NO,
        dogEverReceivedTransfusion: YES_NO_UNKNOWN.NO,
        dogWeightKg: 28.88,
      });
      const actor = getUserActor(dbPool, u1.userId);
      const { result, error } = await getDogStatuses(actor, d2.dogId);
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