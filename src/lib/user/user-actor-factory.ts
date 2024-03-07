import { UserActor } from "./user-actor";
import { UserAccountService } from "./user-account-service";

/**
 * Responsible for creating user actors
 *
 * NOTE: Including a getUserActor in UserAccountService would introduce a
 * circular dependency because UserActor depends on UserAccountService.
 */
export class UserActorFactory {
  private service: UserAccountService;

  constructor(service: UserAccountService) {
    this.service = service;
  }

  public async getUserActor(userEmail: string): Promise<UserActor | null> {
    const userId = await this.service.getUserIdByEmail(userEmail);
    if (userId === null) {
      return null;
    }
    return new UserActor(userId, this.service);
  }
}
