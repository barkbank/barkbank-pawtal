import { User } from "../data/db-models";
import { UserPii } from "./user-pii";
import { UserAccountService } from "./user-account-service";

/**
 * Actor for user accounts
 *
 * Responsible for ensuring users only take actions for which they have proper
 * authorisation. E.g. view own PII and not that of another user.
 */
export class UserActor {
  private userId: string;
  private service: UserAccountService;

  constructor(userId: string, service: UserAccountService) {
    this.userId = userId;
    this.service = service;
  }

  public getUserId(): string {
    return this.userId;
  }

  public getOwnUser(): Promise<User | null> {
    return this.service.getUser(this.getUserId());
  }

  public async getOwnPii(): Promise<UserPii | null> {
    const user = await this.getOwnUser();
    if (user === null) {
      return null;
    }
    return this.service.getUserPii(user);
  }
}
