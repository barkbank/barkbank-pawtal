import { Pool } from "pg";
import { withDb } from "../_db_helpers";
import { RegistrationRequest } from "@/lib/services/registration";
import { RegistrationServiceConfig } from "@/lib/services/registration";
import { RegistrationService } from "@/lib/services/registration";
import { DOG_ANTIGEN_PRESENCE, YES_NO_UNKNOWN } from "@/lib/data/db-enums";
import { DOG_GENDER } from "@/lib/bark/models/dog-gender";
import { USER_RESIDENCY } from "@/lib/data/db-enums";
import { guaranteed } from "@/lib/utilities/bark-utils";
import { BARK_UTC } from "@/lib/utilities/bark-time";
import {
  getDogMapper,
  getEmailHashService,
  getOtpService,
  getUserMapper,
  insertUser,
  insertVet,
} from "../_fixtures";
import { dbSelectUser, dbSelectUserIdByHashedEmail } from "@/lib/data/db-users";
import {
  dbSelectDogListByUserId,
  dbSelectPreferredVetIds,
} from "@/lib/data/db-dogs";
import { HarnessOtpService } from "../_harness";
import { dbQuery } from "@/lib/data/db-utils";

describe("RegistrationHandler", () => {
  it("should return OK when user account is successfully created", async () => {
    await withDb(async (dbPool) => {
      // GIVEN a standard request
      const preferredVet = await insertVet(42, dbPool);
      const request = getRegistrationRequest(preferredVet.vetId);

      // WHEN
      const config = getConfig(dbPool);
      const handler = new RegistrationService(config);
      const response = await handler.handle(request);

      // THEN
      expect(response).toEqual("OK");

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

  it("should return ERROR_INVALID_OTP when OTP is invalid", async () => {
    await withDb(async (dbPool) => {
      // GIVEN a request with invalid OTP
      const preferredVet = await insertVet(42, dbPool);
      const request = getRegistrationRequest(preferredVet.vetId, {
        emailOtp: HarnessOtpService.INVALID_OTP,
      });

      // WHEN
      const config = getConfig(dbPool);
      const handler = new RegistrationService(config);
      const response = await handler.handle(request);

      // THEN
      expect(response).toEqual("ERROR_INVALID_OTP");

      // AND no records created
      const resUsers = await dbQuery(dbPool, `SELECT 1 FROM users`, []);
      expect(resUsers.rows.length).toEqual(0);
      const resDogs = await dbQuery(dbPool, "SELECT 1 FROM dogs", []);
      expect(resDogs.rows.length).toEqual(0);
      const resPrefs = await dbQuery(
        dbPool,
        "SELECT 1 FROM dog_vet_preferences",
        [],
      );
      expect(resPrefs.rows.length).toEqual(0);
    });
  });

  it("should return ERROR_ACCOUNT_ALREADY_EXISTS when user already exists", async () => {
    await withDb(async (dbPool) => {
      // GIVEN a request for a user that already exists
      const preferredVet = await insertVet(42, dbPool);
      const existingUser = await insertUser(86, dbPool);
      const existingUserPii =
        await getUserMapper().mapUserRecordToUserPii(existingUser);
      const request = getRegistrationRequest(preferredVet.vetId, {
        userEmail: existingUserPii.userEmail,
      });

      // WHEN
      const config = getConfig(dbPool);
      const handler = new RegistrationService(config);
      const response = await handler.handle(request);

      // THEN
      expect(response).toEqual("ERROR_ACCOUNT_ALREADY_EXISTS");
    });
  });
});

describe("RegistrationHandler without vet id", () => {
  it("should return OK when user account is successfully created", async () => {
    await withDb(async (dbPool) => {
      // GIVEN a standard request
      const request = getRegistrationRequest(undefined);

      // WHEN
      const config = getConfig(dbPool);
      const handler = new RegistrationService(config);
      const response = await handler.handle(request);

      // THEN
      expect(response).toEqual("OK");

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

      // AND NO preferred vet should be set as dog is not tagged with any preferred vet.
      const preferredVetIds = await dbSelectPreferredVetIds(dbPool, dog.dogId);
      expect(preferredVetIds).toEqual([]);
    });
  });
});

function getConfig(dbPool: Pool): RegistrationServiceConfig {
  return {
    dbPool,
    otpService: getOtpService(),
    emailHashService: getEmailHashService(),
    userMapper: getUserMapper(),
    dogMapper: getDogMapper(),
  };
}

function getRegistrationRequest(
  preferredVetId?: string,
  overrides?: Partial<RegistrationRequest>,
): RegistrationRequest {
  const base: RegistrationRequest = {
    emailOtp: HarnessOtpService.CURRENT_OTP,
    userName: "John Chong",
    userEmail: "john@chong.org",
    userPhoneNumber: "98765432",
    userResidency: USER_RESIDENCY.SINGAPORE,
    dogName: "Tarik",
    dogBreed: "Teh",
    dogBirthday: BARK_UTC.getDate(2019, 7, 4),
    dogGender: DOG_GENDER.MALE,
    dogWeightKg: 23,
    dogDea1Point1: DOG_ANTIGEN_PRESENCE.NEGATIVE,
    dogEverPregnant: YES_NO_UNKNOWN.NO,
    dogEverReceivedTransfusion: YES_NO_UNKNOWN.NO,
    dogPreferredVetId: preferredVetId,
  };
  return { ...base, ...overrides };
}
