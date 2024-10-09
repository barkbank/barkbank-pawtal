import { Pool } from "pg";
import { EncryptionService } from "../services/encryption";
import { UserMapper } from "../data/user-mapper";
import { DogMapper } from "../data/dog-mapper";
import { VetClinic, VetLogin } from "../bark/models/vet-models";
import { BarkContext } from "../bark/bark-context";
import { VetAccountService } from "../bark/services/vet-account-service";
import { getOwnerContactDetails } from "./actions/get-owner-contact-details";
import { CALL_OUTCOME } from "../bark/enums/call-outcome";
import { recordCallOutcome } from "./actions/record-call-outcome";

export type VetActorConfig = {
  dbPool: Pool;
  userMapper: UserMapper;
  dogMapper: DogMapper;
  textEncryptionService: EncryptionService;
  context: BarkContext;
  vetAccountService: VetAccountService;
  // STEP: Define a VetService and wire it into VetActorConfig
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

  getVetClinic(): VetClinic {
    return this.args.vetLogin.clinic;
  }

  // TODO: How can this be undefined?
  getLogin(): VetLogin | undefined {
    return this.args.vetLogin;
  }

  getOwnerContactDetails(args: { dogId: string }) {
    const { dogId } = args;
    return getOwnerContactDetails(this, dogId);
    // STEP: Move this into VetService
  }

  recordCallOutcome(args: {
    dogId: string;
    callOutcome: typeof CALL_OUTCOME.APPOINTMENT | typeof CALL_OUTCOME.DECLINED;
  }) {
    const { dogId, callOutcome } = args;
    return recordCallOutcome(this, { dogId, callOutcome });
    // STEP: Move this into VetService
  }
}
