import { Pool } from "pg";
import { EncryptionService } from "../services/encryption";
import { HashService } from "../services/hash";
import { UserActor, UserActorConfig } from "./user-actor";
import { dbSelectUserIdByHashedEmail } from "../data/dbUsers";

export type UserActorFactoryConfig = {
  dbPool: Pool;
  emailHashService: HashService;
  piiEncryptionService: EncryptionService;
};

export class UserActorFactory {
  private config: UserActorFactoryConfig;

  constructor(config: UserActorFactoryConfig) {
    this.config = config;
  }

  public async getUserActor(userEmail: string): Promise<UserActor | null> {
    const { dbPool, emailHashService, piiEncryptionService } = this.config;
    const userHashedEmail = await emailHashService.getHashHex(userEmail);
    const userId = await dbSelectUserIdByHashedEmail(dbPool, userHashedEmail);
    if (userId === null) {
      return null;
    }
    const config: UserActorConfig = {
      dbPool,
      piiEncryptionService,
    };
    const actor = new UserActor(userId, config);
    return actor;
  }
}
