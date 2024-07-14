import { VetActor, VetActorConfig } from "./vet-actor";
import { dbSelectVetIdByEmail } from "../data/db-vets";
import { LRUCache } from "lru-cache";
import { BarkContext } from "../bark/bark-context";
import { opGetVetIdByEmail } from "../bark/operations/op-get-vet-id-by-email";

export class VetActorFactory {
  private context: BarkContext;
  private actorConfig: VetActorConfig;
  private idCache: LRUCache<string, string>;

  constructor(
    context: BarkContext,
    args: {
      actorConfig: VetActorConfig;
    },
  ) {
    this.context = context;
    this.actorConfig = args.actorConfig;
    this.idCache = new LRUCache({ max: 10 });
  }

  public async getVetActor(vetEmail: string): Promise<VetActor | null> {
    const vetId = await this.getVetIdByEmail(vetEmail);
    if (vetId === null) {
      return null;
    }
    const actor = new VetActor(vetId, this.actorConfig, { email: vetEmail });
    return actor;
  }

  private async getVetIdByEmail(vetEmail: string): Promise<string | null> {
    const cachedVetId = this.idCache.get(vetEmail);
    if (cachedVetId !== undefined) {
      return cachedVetId;
    }
    const { context } = this;
    const { result, error } = await opGetVetIdByEmail(context, {
      email: vetEmail,
    });
    if (error !== undefined) {
      console.error(error);
      return null;
    }
    const { vetId } = result;
    this.idCache.set(vetEmail, vetId);
    return vetId;
  }
}
