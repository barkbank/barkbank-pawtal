import { UserActor, UserActorConfig } from "./user-actor";
import { HashService } from "../services/hash";
import { Pool } from "pg";
import { dbSelectUserIdByHashedEmail } from "../data/db-users";
import { LRUCache } from "lru-cache";

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
  private idCache: LRUCache<string, string>;

  constructor(config: UserActorFactoryConfig, actorConfig: UserActorConfig) {
    this.config = config;
    this.actorConfig = actorConfig;
    this.idCache = new LRUCache({ max: 10 });
  }

  public async getUserActor(userEmail: string): Promise<UserActor | null> {
    const { emailHashService } = this.config;
    const userHashedEmail = await emailHashService.getHashHex(userEmail);
    const userId = await this.getUserIdByHashedEmail(userHashedEmail);
    if (userId === null) {
      return null;
    }
    return new UserActor(userId, this.actorConfig);
  }

  private async getUserIdByHashedEmail(
    userHashedEmail: string,
  ): Promise<string | null> {
    const cachedUserId = this.idCache.get(userHashedEmail);
    if (cachedUserId !== undefined) {
      return cachedUserId;
    }
    const { dbPool } = this.config;
    const userId = await dbSelectUserIdByHashedEmail(dbPool, userHashedEmail);
    if (userId === null) {
      return null;
    }
    this.idCache.set(userHashedEmail, userId);
    return userId;
  }
}
