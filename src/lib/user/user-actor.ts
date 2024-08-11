import { Pool } from "pg";
import { UserRecord } from "../data/db-models";
import { UserPii } from "../data/db-models";
import { UserMapper } from "../data/user-mapper";
import { DogMapper } from "../data/dog-mapper";
import { dbSelectUser } from "../data/db-users";
import { EncryptionService } from "../services/encryption";
import { BarkContext } from "../bark/bark-context";
import { UserAccountService } from "../bark/services/user-account-service";
import { UserAccount } from "../bark/models/user-models";

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

  public async getOwnUserRecord(): Promise<UserRecord | null> {
    const { dbPool } = this.args.config;
    const record = await dbSelectUser(dbPool, this.getUserId());
    return record;
  }

  public async getOwnUserPii(): Promise<UserPii | null> {
    const record = await this.getOwnUserRecord();
    if (record === null) {
      return null;
    }
    const { userMapper } = this.args.config;
    return userMapper.mapUserRecordToUserPii(record);
  }
}
