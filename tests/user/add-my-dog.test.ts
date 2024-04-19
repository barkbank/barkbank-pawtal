import { MyDogRegistration } from "@/lib/user/user-models";
import { withDb } from "../_db_helpers";
import {
  getDogMapper,
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
import { dbQuery } from "@/lib/data/db-utils";
import { Pool } from "pg";

describe("addMyDog", () => {
  it("should register a new dog to the user", async () => {
    await withDb(async (dbPool) => {
      // GIVEN user u1
      const u1 = await insertUser(1, dbPool);

      // AND vet v1
      const v1 = await insertVet(1, dbPool);

      // AND dog registration r1
      const r1: MyDogRegistration = {
        dogName: "Hippo",
        dogBreed: "Greyhound",
        dogBirthday: parseDateTime("2023-01-01", UTC_DATE_OPTION),
        dogGender: DOG_GENDER.MALE,
        dogWeightKg: 68,
        dogEverPregnant: YES_NO_UNKNOWN.NO,
        dogEverReceivedTransfusion: YES_NO_UNKNOWN.NO,
        dogDea1Point1: DOG_ANTIGEN_PRESENCE.POSITIVE,
        dogPreferredVetId: v1.vetId,
      };

      // WHEN addMyDog
      const actor = getUserActor(dbPool, u1.userId);
      const { result, error } = await addMyDog(actor, r1);

      // THEN expect dog belonging to user
      expect(error).toBeUndefined();
      const { dogId } = result!;
      const dog = await fetchRecord(dbPool, dogId);
      expect(dog).toEqual({
        userId: u1.userId,
        ...r1,
      });
    });
  });
});

type Record = MyDogRegistration & {
  userId: string;
};

async function fetchRecord(dbPool: Pool, dogId: string): Promise<Record> {
  const sql = `
  SELECT
    tDog.user_id as "userId",
    tDog.dog_encrypted_oii as "dogEncryptedOii",
    tDog.dog_breed as "dogBreed",
    tDog.dog_birthday as "dogBirthday",
    tDog.dog_gender as "dogGender",
    tDog.dog_weight_kg as "dogWeightKg",
    tDog.dog_ever_pregnant as "dogEverPregnant",
    tDog.dog_ever_received_transfusion as "dogEverReceivedTransfusion",
    tDog.dog_dea1_point1 as "dogDea1Point1",
    tPref.vet_id as "dogPreferredVetId"
  FROM dogs as tDog
  LEFT JOIN (
    SELECT dog_id, vet_id
    FROM dog_vet_preferences
    WHERE dog_id = $1
  ) as tPref on tDog.dog_id = tPref.vet_id
  WHERE tDog.dog_id = $1
  `;
  const res = await dbQuery(dbPool, sql, [dogId]);
  const { dogEncryptedOii, ...otherFields } = res.rows[0];
  const { dogName } = await getDogMapper().mapDogSecureOiiToDogOii({
    dogEncryptedOii,
  });
  return { dogName, ...otherFields };
}
