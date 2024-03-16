import { Pool } from "pg";
import { HashService } from "../services/hash";
import { DogRecord } from "../data/db-models";
import { dbSelectUser, dbSelectUserIdByHashedEmail } from "../data/db-users";
import { dbSelectDogListByUserId } from "../data/db-dogs";
import { UserRecord } from "../data/db-models";
import { UserMapper } from "../data/user-mapper";
import { DogMapper } from "../data/dog-mapper";

export type UserAccountServiceConfig = {
  dbPool: Pool;
  emailHashService: HashService;
  userMapper: UserMapper;
  dogMapper: DogMapper;
};

/**
 * Responsible for user account related operations.
 *
 * NOT responsible for authorisation of the operations. That responsibility
 * falls on the actors; i.e. UserActor, VetActor, and AdminActor.
 *
 * TODO: Remove UserAccountService move createUserAccount into a register user action.
 */
export class UserAccountService {
  private config: UserAccountServiceConfig;

  constructor(config: UserAccountServiceConfig) {
    this.config = config;
  }

  public async getUserIdByEmail(userEmail: string): Promise<string | null> {
    const userHashedEmail =
      await this.getEmailHashService().getHashHex(userEmail);
    const userId = await dbSelectUserIdByHashedEmail(
      this.getDbPool(),
      userHashedEmail,
    );
    return userId;
  }

  public getUserRecord(userId: string): Promise<UserRecord | null> {
    return dbSelectUser(this.getDbPool(), userId);
  }

  public getUserDogRecords(userId: string): Promise<DogRecord[]> {
    return dbSelectDogListByUserId(this.getDbPool(), userId);
  }

  private getDbPool(): Pool {
    return this.config.dbPool;
  }

  private getEmailHashService(): HashService {
    return this.config.emailHashService;
  }

  public getUserMapper(): UserMapper {
    return this.config.userMapper;
  }

  public getDogMapper(): DogMapper {
    return this.config.dogMapper;
  }
}
