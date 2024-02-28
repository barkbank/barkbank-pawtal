import { Pool } from "pg";
import { EncryptionService } from "../services/encryption";
import { HashService } from "../services/hash";
import { UserActor, UserActorConfig } from "./user-actor";
import { dbSelectUserByHashedEmail } from "../data/dbUsers";

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
    const user = await dbSelectUserByHashedEmail(dbPool, userHashedEmail);
    if (user === null) {
      return null;
    }
    const config: UserActorConfig = {
      dbPool,
      piiEncryptionService,
    };
    const actor = new UserActor(user.userId, config);
    return actor;
  }
}
