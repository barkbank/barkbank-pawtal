import { UserActor, UserActorConfig } from "./user-actor";
import { UserAccountService } from "../bark/services/user-account-service";

/**
 * Responsible for creating user actors
 */
export class UserActorFactory {
  constructor(
    private args: {
      actorConfig: UserActorConfig;
      userAccountService: UserAccountService;
    },
  ) {}

  public async getUserActor(userEmail: string): Promise<UserActor | null> {
    const { actorConfig, userAccountService } = this.args;
    const { result } = await userAccountService.getUserIdByUserEmail({
      userEmail,
    });
    if (result === undefined) {
      return null;
    }
    const { userId } = result;
    return new UserActor({
      userId,
      config: actorConfig,
    });
  }
}
