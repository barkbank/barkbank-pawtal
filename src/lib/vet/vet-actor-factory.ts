import { Pool } from "pg";
import { EncryptionService } from "../services/encryption";
import { VetActor, VetActorConfig } from "./vet-actor";
import { dbSelectVetIdByEmail } from "../data/db-vets";
import { LRUCache } from "lru-cache";

export type VetActorFactoryConfig = {
  dbPool: Pool;
  piiEncryptionService: EncryptionService;
};

export class VetActorFactory {
  private config: VetActorFactoryConfig;
  private idCache: LRUCache<string, string>;

  constructor(config: VetActorFactoryConfig) {
    this.config = config;
    this.idCache = new LRUCache({ max: 10 });
  }

  public async getVetActor(vetEmail: string): Promise<VetActor | null> {
    const { dbPool, piiEncryptionService } = this.config;
    const vetId = await this.getVetIdByEmail(vetEmail);
    if (vetId === null) {
      return null;
    }
    const config: VetActorConfig = { dbPool, piiEncryptionService };
    const actor = new VetActor(vetId, config);
    return actor;
  }

  private async getVetIdByEmail(vetEmail: string): Promise<string | null> {
    const cachedVetId = this.idCache.get(vetEmail);
    if (cachedVetId !== undefined) {
      return cachedVetId;
    }
    const { dbPool } = this.config;
    const vetId = await dbSelectVetIdByEmail(dbPool, vetEmail);
    if (vetId === null) {
      return null;
    }
    this.idCache.set(vetEmail, vetId);
    return vetId;
  }
}
