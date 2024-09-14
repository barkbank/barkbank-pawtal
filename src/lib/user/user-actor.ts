import { Pool } from "pg";
import { UserMapper } from "../data/user-mapper";
import { DogMapper } from "../data/dog-mapper";
import { EncryptionService } from "../services/encryption";
import { BarkContext } from "../bark/bark-context";
import { UserAccountService } from "../bark/services/user-account-service";
import { UserAccount, UserAccountUpdate } from "../bark/models/user-models";
import { DogProfile, DogProfileSpec } from "../bark/models/dog-profile-models";
import { Err, Result } from "../utilities/result";
import { CODE } from "../utilities/bark-code";
import { DogProfileService } from "../bark/services/dog-profile-service";

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

  getParams(): UserActorConfig & { userId: string } {
    return {
      ...this.args.config,
      userId: this.args.userId,
    };
  }

  getUserId(): string {
    return this.args.userId;
  }

  async getMyAccount(): Promise<UserAccount | null> {
    const { userId, config } = this.args;
    const { userAccountService } = config;
    const { result } = await userAccountService.getByUserId({ userId });
    return result ?? null;
  }

  async updateMyAccount(args: { update: UserAccountUpdate }) {
    const { update } = args;
    const { userId, config } = this.args;
    const { userAccountService } = config;
    const res = await userAccountService.applyUpdate({ userId, update });
    return res;
  }

  async addDogProfile(args: {
    spec: DogProfileSpec;
  }): Promise<Result<{ dogId: string }, typeof CODE.FAILED>> {
    // WIP: Implement addDog
    return Err(CODE.FAILED);
  }

  async getDogProfile(args: {
    dogId: string;
  }): Promise<
    Result<DogProfile, typeof CODE.FAILED | typeof CODE.ERROR_DOG_NOT_FOUND>
  > {
    // WIP: Implement getDog
    return Err(CODE.FAILED);
  }
}
