import { EncryptionService } from "../services/encryption";
import { HashService } from "../services/hash";
import { UserRecord, UserSpec } from "./db-models";

export class UserMapper {
  private emailHashService: HashService;
  private piiEncryptionService: EncryptionService;

  constructor(config: {
    emailHashService: HashService;
    piiEncryptionService: EncryptionService;
  }) {
    this.emailHashService = config.emailHashService;
    this.piiEncryptionService = config.piiEncryptionService;
  }

  public mapUserRecordToUserSpec(userRecord: UserRecord): UserSpec {
    const { userHashedEmail, userEncryptedPii } = userRecord;
    return { userHashedEmail, userEncryptedPii };
  }
}
