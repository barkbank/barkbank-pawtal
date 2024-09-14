import { Pool } from "pg";
import { UserMapper } from "../data/user-mapper";
import { DogMapper } from "../data/dog-mapper";
import { EncryptionService } from "../services/encryption";
import { BarkContext } from "../bark/bark-context";
import { UserAccountService } from "../bark/services/user-account-service";
import { UserAccount, UserAccountUpdate } from "../bark/models/user-models";
import { DogProfileSpec } from "../bark/models/dog-profile-models";
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
}
