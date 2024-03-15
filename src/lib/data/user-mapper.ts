import { EncryptionService } from "../services/encryption";
import { HashService } from "../services/hash";
import { User, UserGen, UserPii, UserRecord, UserSecurePii } from "./db-models";

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

  public mapUserRecordToUserSpec(userRecord: UserRecord): UserSecurePii {
    const { userId, userCreationTime, userModificationTime, ...spec } =
      userRecord;
    return spec;
  }

  public mapUserRecordToUserGen(userRecord: UserRecord): UserGen {
    const { userId, userCreationTime, userModificationTime } = userRecord;
    return { userId, userCreationTime, userModificationTime };
  }

  public async mapUserRecordToUser(userRecord: UserRecord): Promise<User> {
    const userGen = this.mapUserRecordToUserGen(userRecord);
    const userSpec = this.mapUserRecordToUserSpec(userRecord);
    const userPii = await this.mapUserSecurePiiToUserPii(userSpec);
    return { ...userGen, ...userPii };
  }

  public async mapUserRecordToUserPii(
    userRecord: UserRecord,
  ): Promise<UserPii> {
    const userSpec = this.mapUserRecordToUserSpec(userRecord);
    const userPii = await this.mapUserSecurePiiToUserPii(userSpec);
    return userPii;
  }

  public async mapUserSecurePiiToUserPii(
    userSecurePii: UserSecurePii,
  ): Promise<UserPii> {
    const jsonEncoded = await this.piiEncryptionService.getDecryptedData(
      userSecurePii.userEncryptedPii,
    );
    const pii = JSON.parse(jsonEncoded) as UserPii;
    return pii;
  }

  public async mapUserPiiToUserSecurePii(
    userPii: UserPii,
  ): Promise<UserSecurePii> {
    const jsonEncoded = JSON.stringify(userPii);
    const [userHashedEmail, userEncryptedPii] = await Promise.all([
      this.emailHashService.getHashHex(userPii.userEmail),
      this.piiEncryptionService.getEncryptedData(jsonEncoded),
    ]);
    return { userHashedEmail, userEncryptedPii };
  }
}
