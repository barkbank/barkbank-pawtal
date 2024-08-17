import { Pool, PoolClient } from "pg";
import { dbInsertDog, dbInsertDogVetPreference } from "@/lib/data/db-dogs";
import {
  DogGen,
  DogOii,
  DogDetails,
  DogSecureOii,
  DogSpec,
} from "@/lib/data/db-models";
import { dbBegin, dbRollback, dbCommit, dbRelease } from "@/lib/data/db-utils";
import { DogMapper } from "@/lib/data/dog-mapper";
import { OtpService } from "@/lib/services/otp";
import { CODE } from "../../utilities/bark-code";
import { RegistrationRequest } from "../models/registration-models";
import { UserAccountSpecSchema } from "../models/user-models";
import { BarkContext } from "../bark-context";
import { UserAccountService } from "./user-account-service";

export type RegistrationServiceConfig = {
  dbPool: Pool;
  dogMapper: DogMapper;
  otpService: OtpService;
  context: BarkContext;
  userAccountService: UserAccountService;
};

export class RegistrationService {
  private config: RegistrationServiceConfig;

  constructor(config: RegistrationServiceConfig) {
    this.config = config;
  }

  public async handle(
    request: RegistrationRequest,
  ): Promise<
    | typeof CODE.OK
    | typeof CODE.ERROR_INVALID_OTP
    | typeof CODE.ERROR_ACCOUNT_ALREADY_EXISTS
    | typeof CODE.FAILED
  > {
    const isValidOtp = await this.isValidOtp(request);
    if (!isValidOtp) {
      return CODE.ERROR_INVALID_OTP;
    }

    const conn = await this.config.dbPool.connect();
    try {
      await dbBegin(conn);
      const { hasExistingUser, userId } = await this.registerUser(
        conn,
        request,
      );
      if (hasExistingUser) {
        await dbRollback(conn);
        return CODE.ERROR_ACCOUNT_ALREADY_EXISTS;
      }
      const dogGen = await this.registerDog(conn, request, userId);
      const allInserted = await this.registerVetPreference(
        conn,
        request,
        dogGen.dogId,
      );
      if (!allInserted) {
        await dbRollback(conn);
        return CODE.FAILED;
      }
      await dbCommit(conn);
      return CODE.OK;
    } catch (error: unknown) {
      await dbRollback(conn);
      return CODE.FAILED;
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
    | { hasExistingUser: false; userId: string }
    | { hasExistingUser: true; userId?: undefined }
  > {
    const { userAccountService } = this.config;
    const spec = UserAccountSpecSchema.parse(request);
    const { result, error } = await userAccountService.create({ spec, conn });
    if (error === CODE.ERROR_ACCOUNT_ALREADY_EXISTS) {
      return { hasExistingUser: true };
    }
    if (error !== undefined) {
      throw new Error(error);
    }
    const { userId } = result;
    return { hasExistingUser: false, userId };
  }

  // TODO: Update this to use DogProfileService in future.
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

  // TODO: This should be part of registerDog once it uses DogProfileService
  private async registerVetPreference(
    conn: PoolClient,
    request: RegistrationRequest,
    dogId: string,
  ): Promise<boolean> {
    const { dogPreferredVetId } = request;
    if (dogPreferredVetId === undefined || dogPreferredVetId === "") {
      return true;
    }
    return dbInsertDogVetPreference(conn, dogId, dogPreferredVetId);
  }
}
