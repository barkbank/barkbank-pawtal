import { updateMyDogRegistration } from "@/lib/user/actions/update-my-dog-registration";
import { withDb } from "../_db_helpers";
import { getUserActor, insertDog, insertUser } from "../_fixtures";
import { MyDogRegistrationUpdate } from "@/lib/user/user-models";
import { UTC_DATE_OPTION, parseDateTime } from "@/lib/utilities/bark-time";
import {
  DogAntigenPresence,
  DogGender,
  PARTICIPATION_STATUS,
  YesNoUnknown,
} from "@/lib/data/db-enums";

describe("updateMyDogRegistration", () => {
  it("should return OK_UPDATED when update was successful", async () => {
    await withDb(async (dbPool) => {});
  });
  it("should return ERROR_REPORT_EXISTS when there is an existing report for the dog", async () => {
    await withDb(async (dbPool) => {});
  });
  it("should return ERROR_UNAUTHORIZED when the user is not the dog owner", async () => {
    await withDb(async (dbPool) => {
      // GIVEN users u1 and u2
      const u1 = await insertUser(1, dbPool);
      const u2 = await insertUser(2, dbPool);

      // AND dog d2 belonging to u2
      const d2 = await insertDog(2, u2.userId, dbPool);

      // WHEN u1 attempts to update d2
      const actor1 = getUserActor(dbPool, u1.userId);
      const res = await updateMyDogRegistration(
        actor1,
        registrationUpdate(d2.dogId),
      );

      // THEN
      expect(res).toEqual("ERROR_UNAUTHORIZED");
    });
  });
});

function registrationUpdate(dogId: string): MyDogRegistrationUpdate {
  const update: MyDogRegistrationUpdate = {
    dogId,
    dogName: "updated name",
    dogBreed: "updated breed",
    dogBirthday: parseDateTime("1970-01-01", UTC_DATE_OPTION),
    dogGender: DogGender.MALE,
    dogWeightKg: 50,
    dogDea1Point1: DogAntigenPresence.UNKNOWN,
    dogEverPregnant: YesNoUnknown.NO,
    dogEverReceivedTransfusion: YesNoUnknown.NO,
    dogPreferredVetId: null,
    dogParticipationStatus: PARTICIPATION_STATUS.PARTICIPATING,
    // TODO: dogPauseEndReason: string; When the schema supports it
    dogPauseDurationWeeks: null,
  };
  return update;
}
