import { Pool } from "pg";
import { EncryptionService } from "../services/encryption";
import { Vet } from "../data/models";

export type VetActorConfig = {
  dbPool: Pool;

  /**
   * Needed by vet when they want to decrypt user PII for the purposes of
   * contacting them.
   */
  piiEncryptionService: EncryptionService;
};

/**
 * Encapsulates all data access for a given vet.
 */
export class VetActor {
  private vet: Vet;
  private config: VetActorConfig;

  constructor(vet: Vet, config: VetActorConfig) {
    this.vet = vet;
    this.config = config;
  }

  public getOwnId(): string {
    return this.vet.vetId;
  }

  /**
   * Retrieve user contact details.
   *
   * @param userId User ID
   *
   * @returns User name and phone number.
   */
  public async getUserContactDetails(
    userId: string,
  ): Promise<{ userName: string; userPhoneNumber: string }> {
    // TODO: A stub to illustate how VetActor might develop. (Remove if not needed.)
    // TODO: Impl dbSelectUserByUserIdAndVetPreference - Should return null if user does not prefer this vet.
    return {
      userName: "Ms Han",
      userPhoneNumber: "+65 12341234",
    };
  }
}
