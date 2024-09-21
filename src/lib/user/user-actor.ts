import { Pool } from "pg";
import { UserMapper } from "../data/user-mapper";
import { DogMapper } from "../data/dog-mapper";
import { EncryptionService } from "../services/encryption";
import { BarkContext } from "../bark/bark-context";
import { UserAccountService } from "../bark/services/user-account-service";
import { UserAccount, UserAccountUpdate } from "../bark/models/user-models";
import {
  DogProfileSpec,
  SubProfileSpec,
} from "../bark/models/dog-profile-models";
import { DogProfileService } from "../bark/services/dog-profile-service";
import { getMyPets } from "./actions/get-my-pets";
import { opFetchReportsByDogId } from "../bark/operations/op-fetch-reports-by-dog-id";
import { ReportDao } from "../bark/daos/report-dao";
import { opFetchDogReportCount } from "../bark/operations/op-fetch-dog-report-count";
import { Err, Ok, Result } from "../utilities/result";
import { CODE } from "../utilities/bark-code";
import { BarkReport } from "../bark/models/report-models";

export type UserActorConfig = {
  dbPool: Pool;
  userMapper: UserMapper;
  dogMapper: DogMapper;
  textEncryptionService: EncryptionService;
  context: BarkContext;
  userAccountService: UserAccountService;
  dogProfileService: DogProfileService;
};

/**
 * Actor for user accounts
 *
 * Responsible for ensuring users only take actions for which they have proper
 * authorisation. E.g. view own PII and not that of another user.
 */
export class UserActor {
  constructor(
    private args: {
      userId: string;
      config: UserActorConfig;
    },
  ) {}

  getParams() {
    return {
      ...this.args.config,
      userId: this.args.userId,
    };
  }

  getUserId(): string {
    return this.args.userId;
  }

  async getMyAccount(): Promise<UserAccount | null> {
    const { userId, userAccountService } = this.getParams();
    const { result } = await userAccountService.getByUserId({ userId });
    return result ?? null;
  }

  async updateMyAccount(args: { update: UserAccountUpdate }) {
    const { update } = args;
    const { userId, userAccountService } = this.getParams();
    const res = await userAccountService.applyUpdate({ userId, update });
    return res;
  }

  async addDogProfile(args: { spec: DogProfileSpec }) {
    const { spec } = args;
    const { userId, dogProfileService } = this.getParams();
    const res = await dogProfileService.addDogProfile({ userId, spec });
    return res;
  }

  async getDogProfile(args: { dogId: string }) {
    const { dogId } = args;
    const { userId, dogProfileService } = this.getParams();
    const res = await dogProfileService.getDogProfile({ userId, dogId });
    return res;
  }

  async updateDogProfile(args: { dogId: string; spec: DogProfileSpec }) {
    const { dogId, spec } = args;
    const { userId, dogProfileService } = this.getParams();
    const res = await dogProfileService.updateDogProfile({
      userId,
      dogId,
      spec,
    });
    return res;
  }

  // TODO: Write a test for this when VetActor can schedule appoints and write reports.
  async updateSubProfile(args: { dogId: string; spec: SubProfileSpec }) {
    const { dogId, spec } = args;
    const { userId, dogProfileService } = this.getParams();
    const res = await dogProfileService.updateSubProfile({
      userId,
      dogId,
      spec,
    });
    return res;
  }

  async getMyDogs() {
    // TODO: dogProfileService.getMyDogs - there is also a listDogProfiles
    return getMyPets(this);
  }

  async getDogStatuses(args: { dogId: string }) {
    const { dogId } = args;
    const { userId, dogProfileService } = this.getParams();
    return dogProfileService.getDogStatuses({ userId, dogId });
  }

  async getDogPreferredVet(args: { dogId: string }) {
    const { dogId } = args;
    const { userId, dogProfileService } = this.getParams();
    return dogProfileService.getDogPreferredVet({ userId, dogId });
  }

  async getDogAppointments(args: { dogId: string }) {
    const { dogId } = args;
    const { userId, dogProfileService } = this.getParams();
    return dogProfileService.getDogAppointments({ userId, dogId });
  }

  // TODO: Test UserActor::getDogReports when VetActor can create them so that
  //     the tests can be written using user and vet actors with minimal
  //     mocking. In the meantime, this behaviour is covered by the "user can
  //     view report and edit sub-profile" UI Test.
  async getDogReports(args: {
    dogId: string;
  }): Promise<
    Result<BarkReport[], typeof CODE.FAILED | typeof CODE.ERROR_DOG_NOT_FOUND>
  > {
    const { dogId } = args;
    const { context, userId } = this.getParams();
    // TODO: Impl DogProfileService::getDogReports it should check dog ownership
    const { result, error } = await opFetchReportsByDogId(context, {
      dogId,
      actorUserId: userId,
    });
    if (error === CODE.FAILED) {
      return Err(CODE.FAILED);
    }
    if (error !== undefined) {
      return Err(CODE.ERROR_DOG_NOT_FOUND);
    }
    return Ok(result.reports);
  }

  async getDogReportCount(args: { dogId: string }) {
    const { dogId } = args;
    const { context } = this.getParams();
    // TODO: Impl DogProfileService::getDogReportCount it should check dog ownership
    return opFetchDogReportCount(context, { dogId });
  }
}
