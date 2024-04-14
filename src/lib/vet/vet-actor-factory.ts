import { Pool } from "pg";
import { VetActor, VetActorConfig } from "./vet-actor";
import { dbSelectVetIdByEmail } from "../data/db-vets";
import { LRUCache } from "lru-cache";

export type VetActorFactoryConfig = {
  dbPool: Pool;
};

export class VetActorFactory {
  private factoryConfig: VetActorFactoryConfig;
  private actorConfig: VetActorConfig;
  private idCache: LRUCache<string, string>;

  constructor(args: {
    factoryConfig: VetActorFactoryConfig;
    actorConfig: VetActorConfig;
  }) {
    this.factoryConfig = args.factoryConfig;
    this.actorConfig = args.actorConfig;
    this.idCache = new LRUCache({ max: 10 });
  }

  public async getVetActor(vetEmail: string): Promise<VetActor | null> {
    const vetId = await this.getVetIdByEmail(vetEmail);
    if (vetId === null) {
      return null;
    }
    const actor = new VetActor(vetId, this.actorConfig);
    return actor;
  }

  private async getVetIdByEmail(vetEmail: string): Promise<string | null> {
    const cachedVetId = this.idCache.get(vetEmail);
    if (cachedVetId !== undefined) {
      return cachedVetId;
    }
    const { dbPool } = this.factoryConfig;
    const vetId = await dbSelectVetIdByEmail(dbPool, vetEmail);
    if (vetId === null) {
      return null;
    }
    this.idCache.set(vetEmail, vetId);
    return vetId;
  }
}
