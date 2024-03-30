import { Pool } from "pg";
import { UserRecord } from "../data/db-models";
import { UserPii } from "../data/db-models";
import { UserMapper } from "../data/user-mapper";
import { DogMapper } from "../data/dog-mapper";
import { dbSelectUser } from "../data/db-users";

export type UserActorConfig = {
  dbPool: Pool;
  userMapper: UserMapper;
  dogMapper: DogMapper;
};

/**
 * Actor for user accounts
 *
 * Responsible for ensuring users only take actions for which they have proper
 * authorisation. E.g. view own PII and not that of another user.
 */
export class UserActor {
  private userId: string;
  private config: UserActorConfig;

  constructor(userId: string, config: UserActorConfig) {
    this.userId = userId;
    this.config = config;
  }

  public getParams(): UserActorConfig & { userId: string } {
    return {
      ...this.config,
      userId: this.userId,
    };
  }

  public getUserId(): string {
    return this.userId;
  }

  public async getOwnUserRecord(): Promise<UserRecord | null> {
    const { dbPool } = this.config;
    const record = await dbSelectUser(dbPool, this.getUserId());
    return record;
  }

  public async getOwnUserPii(): Promise<UserPii | null> {
    const record = await this.getOwnUserRecord();
    if (record === null) {
      return null;
    }
    const { userMapper } = this.config;
    return userMapper.mapUserRecordToUserPii(record);
  }
}
