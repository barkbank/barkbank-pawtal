import { VetActor, VetActorConfig } from "./vet-actor";
import { BarkContext } from "../bark/bark-context";
import { VetAccountService } from "../bark/services/vet-account-service";

export class VetActorFactory {
  constructor(
    private config: {
      context: BarkContext;
      vetAccountService: VetAccountService;
      actorConfig: VetActorConfig;
    },
  ) {}

  public async getVetActor(vetEmail: string): Promise<VetActor | null> {
    const { result, error } =
      await this.config.vetAccountService.getVetLoginByEmail({
        email: vetEmail,
      });
    if (error !== undefined) {
      console.error(error);
      return null;
    }
    const { vetLogin } = result;
    const actor = new VetActor(vetLogin, this.config.actorConfig);
    return actor;
  }
}
