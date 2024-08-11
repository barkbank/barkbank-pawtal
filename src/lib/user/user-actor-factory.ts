import { UserActor, UserActorConfig } from "./user-actor";
import { HashService } from "../services/hash";
import { Pool } from "pg";
import { dbSelectUserIdByHashedEmail } from "../data/db-users";
import { LRUCache } from "lru-cache";
import { BarkContext } from "../bark/bark-context";
import { UserAccountService } from "../bark/services/user-account-service";

/**
 * Responsible for creating user actors
 */
export class UserActorFactory {
  private idCache: LRUCache<string, string>;

  constructor(
    private args: {
      actorConfig: UserActorConfig;
      context: BarkContext;
      userAccountService: UserAccountService;
    },
  ) {
    this.idCache = new LRUCache({ max: 10 });
  }

  public async getUserActor(userEmail: string): Promise<UserActor | null> {
    // WIP: There should be a getUserIdByEmail() method in UserAccountService
    const { context, actorConfig, userAccountService } = this.args;
    const { emailHashService } = context;
    const userHashedEmail = await emailHashService.getHashHex(userEmail);
    const userId = await this.getUserIdByHashedEmail(userHashedEmail);
    if (userId === null) {
      return null;
    }
    return new UserActor({
      userId,
      config: actorConfig,
      context,
      userAccountService,
    });
  }

  private async getUserIdByHashedEmail(
    userHashedEmail: string,
  ): Promise<string | null> {
    const cachedUserId = this.idCache.get(userHashedEmail);
    if (cachedUserId !== undefined) {
      return cachedUserId;
    }
    const { dbPool } = this.args.context;
    const userId = await dbSelectUserIdByHashedEmail(dbPool, userHashedEmail);
    if (userId === null) {
      return null;
    }
    this.idCache.set(userHashedEmail, userId);
    return userId;
  }
}
