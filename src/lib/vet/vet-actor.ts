import { Pool } from "pg";
import { EncryptionService } from "../services/encryption";
import { UserMapper } from "../data/user-mapper";
import { DogMapper } from "../data/dog-mapper";

export type VetActorConfig = {
  dbPool: Pool;
  userMapper: UserMapper;
  dogMapper: DogMapper;
  textEncryptionService: EncryptionService;
};

/**
 * Encapsulates all data access for a given vet.
 */
export class VetActor {
  private vetId: string;
  private config: VetActorConfig;
  private loginEmail: string | undefined;

  constructor(
    vetId: string,
    config: VetActorConfig,
    args?: { email?: string },
  ) {
    this.vetId = vetId;
    this.config = config;
    this.loginEmail = args?.email;
  }

  public getVetId(): string {
    return this.vetId;
  }

  public getParams(): VetActorConfig & { vetId: string } {
    return {
      vetId: this.vetId,
      ...this.config,
    };
  }

  // TODO: Guarantee this; i.e. return type should be string.
  public getLoginEmail(): string | undefined {
    return this.loginEmail;
  }
}
