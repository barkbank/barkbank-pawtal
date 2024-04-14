import { Pool } from "pg";
import { EncryptionService } from "../services/encryption";

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
  private vetId: string;
  private config: VetActorConfig;

  constructor(vetId: string, config: VetActorConfig) {
    this.vetId = vetId;
    this.config = config;
  }

  public getVetId(): string {
    return this.vetId;
  }
}
