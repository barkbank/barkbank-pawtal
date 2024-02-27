import { Pool } from "pg";
import { EncryptionService } from "../services/encryption";
import { VetActor, VetActorConfig } from "./vet-actor";
import { dbSelectVetByEmail } from "../data/dbVets";

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
    const vet = await dbSelectVetByEmail(dbPool, vetEmail);
    if (vet === null) {
      return null;
    }
    const config: VetActorConfig = { dbPool, piiEncryptionService };
    const actor = new VetActor(vet, config);
    return actor;
  }
}
