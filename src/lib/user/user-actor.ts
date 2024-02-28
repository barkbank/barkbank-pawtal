import { EncryptionService } from "../services/encryption";

export type UserActorConfig = {
  /**
   * For user to decrypt their own PII
   */
  piiEncryptionService: EncryptionService;
}

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
}
