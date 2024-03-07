import { Pool } from "pg";
import { HashService } from "../services/hash";
import { EncryptionService } from "../services/encryption";
import { User } from "../data/db-models";
import { dbSelectUser, dbSelectUserIdByHashedEmail } from "../data/db-users";
import { UserPii } from "./user-models";

export type UserAccountServiceConfig = {
  dbPool: Pool;
  emailHashService: HashService;
  piiEncryptionService: EncryptionService;
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

  public getUser(userId: string): Promise<User | null> {
    return dbSelectUser(this.getDbPool(), userId);
  }

  public getUserPii(user: User): Promise<UserPii> {
    return this.decryptUserPii(user.userEncryptedPii);
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

  private encryptUserPii(userPii: UserPii): Promise<string> {
    const data = JSON.stringify(userPii);
    return this.getPiiEncryptionService().getEncryptedData(data);
  }

  private async decryptUserPii(userEncryptedPii: string): Promise<UserPii> {
    const service = this.getPiiEncryptionService();
    const data = await service.getDecryptedData(userEncryptedPii);
    return JSON.parse(data) as UserPii;
  }
}
