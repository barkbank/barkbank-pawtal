import { Pool } from "pg";
import { EncryptionService } from "../services/encryption";
import { UserMapper } from "../data/user-mapper";
import { DogMapper } from "../data/dog-mapper";
import { VetLogin } from "../bark/models/vet-models";

// TODO: Replace VetActorConfig with BarkContext
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
  private vetLogin: VetLogin | undefined;

  constructor(
    vetId: string,
    config: VetActorConfig,
    args?: { vetLogin?: VetLogin },
  ) {
    this.vetId = vetId;
    this.config = config;
    this.vetLogin = args?.vetLogin;
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

  public getLogin(): VetLogin | undefined {
    return this.vetLogin;
  }
}
