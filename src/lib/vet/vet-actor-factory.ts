import { VetActor, VetActorConfig } from "./vet-actor";
import { LRUCache } from "lru-cache";
import { BarkContext } from "../bark/bark-context";
import { opGetVetLoginByEmail } from "../bark/operations/op-get-vet-login-by-email";
import { VetLogin } from "../bark/models/vet-models";

export class VetActorFactory {
  private context: BarkContext;
  private actorConfig: VetActorConfig;
  private cache: LRUCache<string, VetLogin>;

  constructor(
    context: BarkContext,
    args: {
      actorConfig: VetActorConfig;
    },
  ) {
    this.context = context;
    this.actorConfig = args.actorConfig;
    this.cache = new LRUCache({ max: 10 });
  }

  public async getVetActor(vetEmail: string): Promise<VetActor | null> {
    const vetLogin = await this.getVetLoginByEmail(vetEmail);
    if (vetLogin === null) {
      return null;
    }
    const actor = new VetActor(vetLogin.clinic.vetId, this.actorConfig, {
      vetLogin,
    });
    return actor;
  }

  private async getVetLoginByEmail(vetEmail: string): Promise<VetLogin | null> {
    const cached = this.cache.get(vetEmail);
    if (cached !== undefined) {
      return cached;
    }
    const { context } = this;
    const { result, error } = await opGetVetLoginByEmail(context, {
      email: vetEmail,
    });
    if (error !== undefined) {
      console.error(error);
      return null;
    }
    const { vetLogin } = result;
    this.cache.set(vetEmail, vetLogin);
    return vetLogin;
  }
}
