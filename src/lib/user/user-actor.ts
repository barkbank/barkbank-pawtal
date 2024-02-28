import { EncryptionService } from "../services/encryption";

export type UserActorConfig = {
  userId: string;

  /**
   * For user to decrypt their own PII
   */
  piiEncryptionService: EncryptionService;
}

/**
 * Actor for user accounts
 */
export class UserActor {
  private config: UserActorConfig;

  constructor(config: UserActorConfig) {
    this.config = config;
  }

  public getUserId(): string {
    return this.config.userId;
  }
}
