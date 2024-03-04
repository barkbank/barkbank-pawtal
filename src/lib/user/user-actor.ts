import { Pool } from "pg";
import { User } from "../data/db-models";
import { EncryptionService } from "../services/encryption";
import { UserPii, decryptUserPii } from "./user-pii";
import { dbSelectUser } from "../data/db-users";

export type UserActorConfig = {
  /**
   * For user actor to access the database
   */
  dbPool: Pool;

  /**
   * For user actor to decrypt their own PII
   */
  piiEncryptionService: EncryptionService;
};

/**
 * Actor for user accounts
 */
export class UserActor {
  private userId: string;
  private config: UserActorConfig;

  constructor(userId: string, config: UserActorConfig) {
    this.userId = userId;
    this.config = config;
  }

  public getUserId(): string {
    return this.userId;
  }

  private getDbPool(): Pool {
    return this.config.dbPool;
  }

  private getPiiEncryptionService(): EncryptionService {
    return this.config.piiEncryptionService;
  }

  public async getOwnUser(): Promise<User | null> {
    return dbSelectUser(this.getDbPool(), this.getUserId());
  }

  public async getOwnPii(): Promise<UserPii | null> {
    const user = await this.getOwnUser();
    if (user === null) {
      return null;
    }
    return decryptUserPii(
      user.userEncryptedPii,
      this.getPiiEncryptionService(),
    );
  }
}
