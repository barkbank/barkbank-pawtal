import { UserRecord } from "../data/db-models";
import { UserPii } from "../data/db-models";
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

  public getOwnUserRecord(): Promise<UserRecord | null> {
    return this.service.getUserRecord(this.getUserId());
  }

  public async getOwnUserPii(): Promise<UserPii | null> {
    const record = await this.getOwnUserRecord();
    if (record === null) {
      return null;
    }
    const spec = this.service.getUserMapper().mapUserRecordToUserSpec(record);
    const pii = await this.service.getUserMapper().mapUserSpecToUserPii(spec);
    return pii;
  }
}
