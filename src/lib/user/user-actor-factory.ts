import { Pool } from "pg";
import { EncryptionService } from "../services/encryption";
import { HashService } from "../services/hash";
import { UserActor, UserActorConfig } from "./user-actor";

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
    return null;
  }
}
