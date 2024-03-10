import { Pool } from "pg";
import { EncryptionService } from "../services/encryption";
import { VetActor, VetActorConfig } from "./vet-actor";
import { dbSelectVetIdByEmail } from "../data/db-vets";

export type VetActorFactoryConfig = {
  dbPool: Pool;
  piiEncryptionService: EncryptionService;
};

export class VetActorFactory {
  private config: VetActorFactoryConfig;

  constructor(config: VetActorFactoryConfig) {
    this.config = config;
  }

  public async getVetActor(vetEmail: string): Promise<VetActor | null> {
    const { dbPool, piiEncryptionService } = this.config;
    const vetId = await dbSelectVetIdByEmail(dbPool, vetEmail);
    if (vetId === null) {
      return null;
    }
    const config: VetActorConfig = { dbPool, piiEncryptionService };
    const actor = new VetActor(vetId, config);
    return actor;
  }
}
