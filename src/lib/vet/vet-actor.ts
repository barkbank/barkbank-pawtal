import { Pool } from "pg";
import { EncryptionService } from "../services/encryption";
import { UserMapper } from "../data/user-mapper";
import { DogMapper } from "../data/dog-mapper";
import { VetLogin } from "../bark/models/vet-models";
import { BarkContext } from "../bark/bark-context";
import { VetAccountService } from "../bark/services/vet-account-service";

export type VetActorConfig = {
  dbPool: Pool;
  userMapper: UserMapper;
  dogMapper: DogMapper;
  textEncryptionService: EncryptionService;
  context: BarkContext;
  // TODO: At some point there should only be services in VetActorConfig and the above should be removed.

  vetAccountService: VetAccountService;
};

/**
 * Encapsulates all data access for a given vet.
 */
export class VetActor {
  constructor(
    private args: {
      vetLogin: VetLogin;
      config: VetActorConfig;
    },
  ) {}

  getVetId(): string {
    return this.args.vetLogin.clinic.vetId;
  }

  getParams() {
    return {
      vetId: this.getVetId(),
      ...this.args.config,
    };
  }

  getLogin(): VetLogin | undefined {
    return this.args.vetLogin;
  }
}
