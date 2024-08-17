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
  vetAccountService: VetAccountService;
};

/**
 * Encapsulates all data access for a given vet.
 */
export class VetActor {
  constructor(
    private vetLogin: VetLogin,
    private config: VetActorConfig,
  ) {}

  public getVetId(): string {
    return this.vetLogin.clinic.vetId;
  }

  public getParams(): VetActorConfig & { vetId: string } {
    return {
      vetId: this.getVetId(),
      ...this.config,
    };
  }

  public getLogin(): VetLogin | undefined {
    return this.vetLogin;
  }
}
