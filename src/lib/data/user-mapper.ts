import { EncryptionService } from "../services/encryption";
import { HashService } from "../services/hash";
import {
  User,
  UserDetails,
  UserGen,
  UserPii,
  UserRecord,
  UserSecurePii,
} from "./db-models";

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

  public toUserPii(source: UserPii): UserPii {
    const { userEmail, userName, userPhoneNumber } = source;
    return { userEmail, userName, userPhoneNumber };
  }

  public toUserSecurePii(source: UserSecurePii): UserSecurePii {
    const { userHashedEmail, userEncryptedPii } = source;
    return { userHashedEmail, userEncryptedPii };
  }

  public toUserDetails(source: UserDetails): UserDetails {
    const { userResidency } = source;
    return { userResidency };
  }

  public toUserGen(source: UserGen): UserGen {
    const { userId, userCreationTime, userModificationTime } = source;
    return { userId, userCreationTime, userModificationTime };
  }

  public mapUserRecordToUserSpec(userRecord: UserRecord): UserSecurePii {
    const { userId, userCreationTime, userModificationTime, ...spec } =
      userRecord;
    return spec;
  }

  public async mapUserRecordToUser(userRecord: UserRecord): Promise<User> {
    const userGen = this.toUserGen(userRecord);
    const userDetails = this.toUserDetails(userRecord);
    const userSecurePii = this.toUserSecurePii(userRecord);
    const userPii = await this.mapUserSecurePiiToUserPii(userSecurePii);
    return { ...userGen, ...userDetails, ...userPii };
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
    const obj = JSON.parse(jsonEncoded);
    const { userEmail, userName, userPhoneNumber } = obj;
    const pii: UserPii = { userEmail, userName, userPhoneNumber };
    return pii;
  }

  public async mapUserPiiToUserSecurePii(
    userPii: UserPii,
  ): Promise<UserSecurePii> {
    const { userEmail, userName, userPhoneNumber } = userPii;
    const jsonEncoded = JSON.stringify({
      userEmail,
      userName,
      userPhoneNumber,
    });
    const [userHashedEmail, userEncryptedPii] = await Promise.all([
      this.emailHashService.getHashHex(userPii.userEmail),
      this.piiEncryptionService.getEncryptedData(jsonEncoded),
    ]);
    return { userHashedEmail, userEncryptedPii };
  }
}
