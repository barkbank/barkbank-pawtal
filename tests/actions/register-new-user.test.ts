import { Pool } from "pg";
import { withDb } from "../_db_helpers";
import {
  _RegistrationHandler,
  _RegistrationHandlerConfig,
  RegistrationRequest,
} from "@/lib/actions/register-new-user";
import {
  DogAntigenPresence,
  DogGender,
  UserResidencies,
  YesNoUnknown,
} from "@/lib/data/db-models";
import { BARK_UTC, guaranteed } from "@/lib/bark-utils";
import {
  getDogMapper,
  getEmailHashService,
  getUserMapper,
  insertVet,
} from "../_fixtures";
import { dbSelectUser, dbSelectUserIdByHashedEmail } from "@/lib/data/db-users";
import {
  dbSelectDogListByUserId,
  dbSelectPreferredVetIds,
} from "@/lib/data/db-dogs";

describe("_RegistrationHandler", () => {
  it("should return STATUS_201_CREATED when user account is successfully created", async () => {
    await withDb(async (dbPool) => {
      // GIVEN a standard request
      const preferredVet = await insertVet(42, dbPool);
      const request = getRegistrationRequest({
        dogPreferredVetIdList: [preferredVet.vetId],
      });

      // WHEN handle
      const config = getConfig(dbPool);
      const handler = new _RegistrationHandler(config);
      const response = await handler.handle(request);

      // THEN the response should be STATUS_201_CREATED
      expect(response).toEqual("STATUS_201_CREATED");

      // AND a user should be created
      const userHashedEmail = await config.emailHashService.getHashHex(
        request.userEmail,
      );
      const userId = await dbSelectUserIdByHashedEmail(dbPool, userHashedEmail);
      expect(userId).not.toBeNull();
      const user = await dbSelectUser(dbPool, guaranteed(userId));
      expect(user).not.toBeNull();
      const userPii = await getUserMapper().mapUserRecordToUserPii(
        guaranteed(user),
      );
      expect(userPii.userEmail).toEqual(request.userEmail);
      expect(userPii.userName).toEqual(request.userName);
      expect(userPii.userPhoneNumber).toEqual(request.userPhoneNumber);
      expect(user?.userResidency).toEqual(request.userResidency);

      // AND a dog should be created
      const dogs = await dbSelectDogListByUserId(dbPool, guaranteed(userId));
      expect(dogs.length).toEqual(1);
      const dog = dogs[0];
      expect(dog.dogBreed).toEqual(request.dogBreed);
      expect(dog.dogBirthday).toEqual(request.dogBirthday);
      expect(dog.dogGender).toEqual(request.dogGender);
      expect(dog.dogWeightKg).toEqual(request.dogWeightKg);
      expect(dog.dogDea1Point1).toEqual(request.dogDea1Point1);
      expect(dog.dogEverPregnant).toEqual(request.dogEverPregnant);
      expect(dog.dogEverReceivedTransfusion).toEqual(
        request.dogEverReceivedTransfusion,
      );

      // AND the preferred vet should be set.
      const preferredVetIds = await dbSelectPreferredVetIds(dbPool, dog.dogId);
      expect(preferredVetIds).toEqual([preferredVet.vetId]);
    });
  });

  it("should return STATUS_401_INVALID_OTP when OTP is invalid", async () => {
    await withDb(async (dbPool) => {
      const config = getConfig(dbPool);
      fail("WIP: implement this test");
    });
  });

  it("should return STATUS_409_USER_EXISTS when user already exists", async () => {
    await withDb(async (dbPool) => {
      const config = getConfig(dbPool);
      fail("WIP: implement this test");
    });
  });
});

function getConfig(dbPool: Pool): _RegistrationHandlerConfig {
  return {
    dbPool,
    emailHashService: getEmailHashService(),
    userMapper: getUserMapper(),
    dogMapper: getDogMapper(),
  };
}

function getRegistrationRequest(
  overrides?: Partial<RegistrationRequest>,
): RegistrationRequest {
  const base: RegistrationRequest = {
    userName: "John Chong",
    userEmail: "john@chong.org",
    userPhoneNumber: "98765432",
    userResidency: UserResidencies.SINGAPORE,
    dogName: "Tarik",
    dogBreed: "Teh",
    dogBirthday: BARK_UTC.getDate(2019, 7, 4),
    dogGender: DogGender.MALE,
    dogWeightKg: 23,
    dogDea1Point1: DogAntigenPresence.NEGATIVE,
    dogEverPregnant: YesNoUnknown.NO,
    dogEverReceivedTransfusion: YesNoUnknown.NO,
    dogPreferredVetIdList: [],
  };
  return { ...base, ...overrides };
}
