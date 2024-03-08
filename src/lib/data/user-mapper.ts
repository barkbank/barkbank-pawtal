import { EncryptionService } from "../services/encryption";
import { HashService } from "../services/hash";
import { User, UserGen, UserPii, UserRecord, UserSpec } from "./db-models";

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

  public mapUserRecordToUserGen(userRecord: UserRecord): UserGen {
    const { userId, userCreationTime, userModificationTime } = userRecord;
    return { userId, userCreationTime, userModificationTime };
  }

  public async mapUserRecordToUser(userRecord: UserRecord): Promise<User> {
    const userGen = this.mapUserRecordToUserGen(userRecord);
    const userSpec = this.mapUserRecordToUserSpec(userRecord);
    const userPii = await this.mapUserSpecToUserPii(userSpec);
    return { ...userGen, ...userPii };
  }

  public async mapUserSpecToUserPii(userSpec: UserSpec): Promise<UserPii> {
    const jsonEncoded = await this.piiEncryptionService.getDecryptedData(
      userSpec.userEncryptedPii,
    );
    const pii = JSON.parse(jsonEncoded) as UserPii;
    return pii;
  }

  public async mapUserPiiToUserSpec(userPii: UserPii): Promise<UserSpec> {
    const jsonEncoded = JSON.stringify(userPii);
    const [userHashedEmail, userEncryptedPii] = await Promise.all([
      this.emailHashService.getHashHex(userPii.userEmail),
      this.piiEncryptionService.getEncryptedData(jsonEncoded),
    ]);
    return { userHashedEmail, userEncryptedPii };
  }
}
