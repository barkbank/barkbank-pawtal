import { Pool } from "pg";
import { HashService } from "../services/hash";
import { UserRecord } from "../data/db-models";
import { dbSelectUser, dbSelectUserIdByHashedEmail } from "../data/db-users";
import { UserPii } from "../data/db-models";
import { UserMapper } from "../data/user-mapper";

export type UserAccountServiceConfig = {
  dbPool: Pool;
  emailHashService: HashService;
  userMapper: UserMapper;
};

/**
 * Responsible for user account related operations.
 *
 * NOT responsible for authorisation of the operations. That responsibility
 * falls on the actors; i.e. UserActor, VetActor, and AdminActor.
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

  public getUserPii(record: UserRecord): Promise<UserPii> {
    const spec = this.getUserMapper().mapUserRecordToUserSpec(record);
    return this.getUserMapper().mapUserSpecToUserPii(spec);
  }

  private getDbPool(): Pool {
    return this.config.dbPool;
  }

  private getEmailHashService(): HashService {
    return this.config.emailHashService;
  }

  private getUserMapper(): UserMapper {
    return this.config.userMapper;
  }
}
