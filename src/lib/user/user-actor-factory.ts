import { UserActor, UserActorConfig } from "./user-actor";
import { HashService } from "../services/hash";
import { Pool } from "pg";
import { dbSelectUserIdByHashedEmail } from "../data/db-users";

export type UserActorFactoryConfig = {
  dbPool: Pool;
  emailHashService: HashService;
};

/**
 * Responsible for creating user actors
 */
export class UserActorFactory {
  private config: UserActorFactoryConfig;
  private actorConfig: UserActorConfig;

  constructor(config: UserActorFactoryConfig, actorConfig: UserActorConfig) {
    this.config = config;
    this.actorConfig = actorConfig;
  }

  public async getUserActor(userEmail: string): Promise<UserActor | null> {
    const { dbPool, emailHashService } = this.config;
    const userHashedEmail = await emailHashService.getHashHex(userEmail);
    const userId = await dbSelectUserIdByHashedEmail(dbPool, userHashedEmail);
    if (userId === null) {
      return null;
    }
    return new UserActor(userId, this.actorConfig);
  }
}
