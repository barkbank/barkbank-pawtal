import { Pool } from "pg";
import { HashService } from "../services/hash";
import { EncryptionService } from "../services/encryption";
import { User } from "../data/db-models";
import { dbSelectUser, dbSelectUserIdByHashedEmail } from "../data/db-users";
import { UserPii, decryptUserPii } from "./user-pii";

export type UserAccountServiceConfig = {
  dbPool: Pool;
  emailHashService: HashService;
  piiEncryptionService: EncryptionService;
};

export class UserAccountService {
  private config: UserAccountServiceConfig;

  constructor(config: UserAccountServiceConfig) {
    this.config = config;
  }

  private getDbPool(): Pool {
    return this.config.dbPool;
  }

  private getPiiEncryptionService(): EncryptionService {
    return this.config.piiEncryptionService;
  }

  private getEmailHashService(): HashService {
    return this.config.emailHashService;
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

  public getUser(userId: string): Promise<User | null> {
    return dbSelectUser(this.getDbPool(), userId);
  }

  public getUserPii(user: User): Promise<UserPii> {
    return decryptUserPii(
      user.userEncryptedPii,
      this.getPiiEncryptionService(),
    );
  }
}
