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

  constructor(vetId: string, config: VetActorConfig) {
    this.vetId = vetId;
    this.config = config;
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
}
