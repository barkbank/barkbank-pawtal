import { Pool, PoolClient } from "pg";
import { dbInsertDog, dbInsertDogVetPreference } from "@/lib/data/db-dogs";
import {
  UserGen,
  UserSpec,
  DogGen,
  DogOii,
  DogDetails,
  DogSecureOii,
  DogSpec,
  DogAntigenPresence,
  DogGender,
  YesNoUnknown,
} from "@/lib/data/db-models";
import { UserResidency } from "../data/db-enums";
import { dbSelectUserIdByHashedEmail, dbInsertUser } from "@/lib/data/db-users";
import { dbBegin, dbRollback, dbCommit, dbRelease } from "@/lib/data/db-utils";
import { DogMapper } from "@/lib/data/dog-mapper";
import { UserMapper } from "@/lib/data/user-mapper";
import { HashService } from "@/lib/services/hash";
import { OtpService } from "@/lib/services/otp";

export type RegistrationHandlerConfig = {
  dbPool: Pool;
  emailHashService: HashService;
  userMapper: UserMapper;
  dogMapper: DogMapper;
  otpService: OtpService;
};

export type RegistrationRequest = {
  emailOtp: string;
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
  dogPreferredVetId?: string;
};

export type RegistrationResponse =
  | "STATUS_201_CREATED"
  | "STATUS_401_INVALID_OTP"
  | "STATUS_409_USER_EXISTS"
  | "STATUS_500_INTERNAL_SERVER_ERROR"
  | "STATUS_503_DB_CONTENTION";

export class RegistrationHandler {
  private config: RegistrationHandlerConfig;
  constructor(config: RegistrationHandlerConfig) {
    this.config = config;
  }

  public async handle(
    request: RegistrationRequest,
  ): Promise<RegistrationResponse> {
    const isValidOtp = await this.isValidOtp(request);
    if (!isValidOtp) {
      return "STATUS_401_INVALID_OTP";
    }

    const conn = await this.config.dbPool.connect();
    try {
      await dbBegin(conn);
      const { hasExistingUser, userGen } = await this.registerUser(
        conn,
        request,
      );
      if (hasExistingUser) {
        await dbRollback(conn);
        return "STATUS_409_USER_EXISTS";
      }
      const dogGen = await this.registerDog(conn, request, userGen.userId);
      const allInserted = await this.registerVetPreference(
        conn,
        request,
        dogGen.dogId,
      );
      if (!allInserted) {
        await dbRollback(conn);
        return "STATUS_503_DB_CONTENTION";
      }
      await dbCommit(conn);
      return "STATUS_201_CREATED";
    } catch (error: unknown) {
      await dbRollback(conn);
      return "STATUS_500_INTERNAL_SERVER_ERROR";
    } finally {
      await dbRelease(conn);
    }
  }

  private async isValidOtp(request: RegistrationRequest): Promise<boolean> {
    const { userEmail, emailOtp } = request;
    const recentOtps: string[] =
      await this.config.otpService.getRecentOtps(userEmail);
    return recentOtps.includes(emailOtp);
  }

  private async registerUser(
    conn: PoolClient,
    request: RegistrationRequest,
  ): Promise<
    | { hasExistingUser: false; userGen: UserGen }
    | { hasExistingUser: true; userGen: null }
  > {
    const userDetails = this.config.userMapper.toUserDetails(request);
    const userPii = this.config.userMapper.toUserPii(request);
    const securePii =
      await this.config.userMapper.mapUserPiiToUserSecurePii(userPii);
    const existingId = await dbSelectUserIdByHashedEmail(
      conn,
      securePii.userHashedEmail,
    );
    if (existingId !== null) {
      return { hasExistingUser: true, userGen: null };
    }
    const spec: UserSpec = { ...securePii, ...userDetails };
    const userGen = await dbInsertUser(conn, spec);
    return { hasExistingUser: false, userGen };
  }

  private async registerDog(
    conn: PoolClient,
    request: RegistrationRequest,
    userId: string,
  ): Promise<DogGen> {
    const dogOii: DogOii = this.config.dogMapper.toDogOii(request);
    const dogDetails: DogDetails = this.config.dogMapper.toDogDetails(request);
    const secureOii: DogSecureOii =
      await this.config.dogMapper.mapDogOiiToDogSecureOii(dogOii);
    const spec: DogSpec = { ...secureOii, ...dogDetails };
    const gen = await dbInsertDog(conn, userId, spec);
    return gen;
  }

  private async registerVetPreference(
    conn: PoolClient,
    request: RegistrationRequest,
    dogId: string,
  ): Promise<boolean> {
    if (request.dogPreferredVetId === undefined) {
      return true;
    }

    return dbInsertDogVetPreference(conn, dogId, request.dogPreferredVetId);
  }
}
