import { Pool } from "pg";
import { UserRecord } from "../data/db-models";
import { UserPii } from "../data/db-models";
import { UserMapper } from "../data/user-mapper";
import { DogMapper } from "../data/dog-mapper";
import { dbSelectUser } from "../data/db-users";
import { EncryptionService } from "../services/encryption";
import { BarkContext } from "../bark/bark-context";
import { UserAccountService } from "../bark/services/user-account-service";
import { UserAccount, UserAccountUpdate } from "../bark/models/user-models";

export type UserActorConfig = {
  dbPool: Pool;
  userMapper: UserMapper;
  dogMapper: DogMapper;
  textEncryptionService: EncryptionService;
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
      context: BarkContext;
      userAccountService: UserAccountService;
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
    const { userId, userAccountService } = this.args;
    const { result } = await userAccountService.getByUserId({ userId });
    return result ?? null;
  }

  async updateMyAccount(args: { update: UserAccountUpdate }) {
    const { update } = args;
    const { userId, userAccountService } = this.args;
    const res = await userAccountService.applyUpdate({ userId, update });
    return res;
  }
}
