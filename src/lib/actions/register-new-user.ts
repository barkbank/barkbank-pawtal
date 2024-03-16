import { Pool } from "pg";
import APP from "../app";
import {
  DogAntigenPresence,
  DogGender,
  UserResidency,
  YesNoUnknown,
} from "../data/db-models";
import { HashService } from "../services/hash";

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
  const [dbPool, emailHashService] = await Promise.all([
    APP.getDbPool(),
    APP.getEmailHashService(),
  ]);
  return _handleRegistration(request, { dbPool, emailHashService });
}

// VisibleForTesting
export type _RegistrationHandlerConfig = {
  dbPool: Pool;
  emailHashService: HashService;
};

// VisibleForTesting
export async function _handleRegistration(
  request: RegistrationRequest,
  config: _RegistrationHandlerConfig,
): Promise<RegistrationResponse> {
  const { dbPool } = config;
  return "OK";
}
