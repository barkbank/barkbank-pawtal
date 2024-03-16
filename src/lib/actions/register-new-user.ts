import { Pool } from "pg";
import APP from "../app";
import {
  DogAntigenPresence,
  DogGender,
  UserResidency,
  YesNoUnknown,
} from "../data/db-models";

export type RegistrationRequest = {
  userName: string;
  userEmail: string;
  userPhoneNumber: string;
  userResidency: UserResidency;

  dogName: string;
  dogBreed: string;
  dogBirthday: Date;
  dogGender: DogGender;
  dogWeightKg: number | null;
  dogDea1Point1: DogAntigenPresence;
  dogEverPregnant: YesNoUnknown;
  dogEverReceivedTransfusion: YesNoUnknown;
  dogPreferredVetIdList: string[];
};

export type RegistrationResponse = "OK" | "ERR_USER_EXISTS";

export async function registerNewUser(
  request: RegistrationRequest,
): Promise<RegistrationResponse> {
  const [dbPool] = await Promise.all([APP.getDbPool()]);
  return _registerNewUser(request, { dbPool });
}

// VisibleForTesting
export async function _registerNewUser(
  request: RegistrationRequest,
  config: {
    dbPool: Pool;
  },
): Promise<RegistrationResponse> {
  const { dbPool } = config;
  return "OK";
}
