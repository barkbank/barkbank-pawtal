import { Pool } from "pg";
import { EncryptionService } from "../services/encryption";
import { Vet } from "../data/models";

export type VetActorConfig = {
  dbPool: Pool;

  /**
   * Needed by vet when they want to decrypt user PII for the purposes of
   * contacting them.
   */
  piiEncryptionService: EncryptionService;
};

/**
 * Encapsulates all data access for a given vet.
 */
export class VetActor {
  private vet: Vet;
  private config: VetActorConfig;

  constructor(vet: Vet, config: VetActorConfig) {
    this.vet = vet;
    this.config = config;
  }

  public getVetId(): string {
    return this.vet.vetId;
  }
}
