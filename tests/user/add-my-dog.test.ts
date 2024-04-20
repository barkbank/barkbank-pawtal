import { MyDogRegistration } from "@/lib/user/user-models";
import { withDb } from "../_db_helpers";
import {
  fetchDogInfo,
  getUserActor,
  insertUser,
  insertVet,
} from "../_fixtures";
import { UTC_DATE_OPTION, parseDateTime } from "@/lib/utilities/bark-time";
import {
  DOG_ANTIGEN_PRESENCE,
  DOG_GENDER,
  YES_NO_UNKNOWN,
} from "@/lib/data/db-enums";
import { addMyDog } from "@/lib/user/actions/add-my-dog";

describe("addMyDog", () => {
  it("should register a new dog to the user", async () => {
    await withDb(async (dbPool) => {
      // GIVEN user u1
      const u1 = await insertUser(1, dbPool);

      // AND vet v1
      const v1 = await insertVet(1, dbPool);

      // AND dog registration r1
      const r1: MyDogRegistration = {
        ...MY_DOG_REG_WITH_NO_VET,
        dogPreferredVetId: v1.vetId,
      };

      // WHEN addMyDog
      const actor = getUserActor(dbPool, u1.userId);
      const { result, error } = await addMyDog(actor, r1);

      // THEN expect dog belonging to user
      expect(error).toBeUndefined();
      const { dogId } = result!;
      const { registration, userId } = await fetchDogInfo(dbPool, dogId);
      expect(registration).toEqual(r1);
      expect(userId).toEqual(u1.userId);
    });
  });

  it("should support empty-string vet ID", async () => {
    await withDb(async (dbPool) => {
      // GIVEN user u1
      const u1 = await insertUser(1, dbPool);

      // AND vet v1
      const v1 = await insertVet(1, dbPool);

      // AND dog registration r1
      const r1: MyDogRegistration = {
        ...MY_DOG_REG_WITH_NO_VET,
        dogPreferredVetId: "",
      };

      // WHEN addMyDog
      const actor = getUserActor(dbPool, u1.userId);
      const { result, error } = await addMyDog(actor, r1);

      // THEN expect dog belonging to user
      expect(error).toBeUndefined();
      const { dogId } = result!;
      const { registration, userId } = await fetchDogInfo(dbPool, dogId);
      expect(registration).toEqual(r1);
      expect(userId).toEqual(u1.userId);
    });
  });
});

const MY_DOG_REG_WITH_NO_VET: MyDogRegistration = {
  dogName: "Hippo",
  dogBreed: "Greyhound",
  dogBirthday: parseDateTime("2023-01-01", UTC_DATE_OPTION),
  dogGender: DOG_GENDER.MALE,
  dogWeightKg: 68,
  dogEverPregnant: YES_NO_UNKNOWN.NO,
  dogEverReceivedTransfusion: YES_NO_UNKNOWN.NO,
  dogDea1Point1: DOG_ANTIGEN_PRESENCE.POSITIVE,
  dogPreferredVetId: "",
};
