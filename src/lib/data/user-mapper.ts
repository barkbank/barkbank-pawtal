import { EncryptionService } from "../services/encryption";
import { HashService } from "../services/hash";
import {
  User,
  UserDetails,
  UserGen,
  UserPii,
  UserRecord,
  UserSecurePii,
  UserSpec,
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

  public toUserSpec(source: UserSpec): UserSpec {
    const userSecurePii = this.toUserSecurePii(source);
    const userDetails = this.toUserDetails(source);
    return { ...userSecurePii, ...userDetails };
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
    const securePii = this.toUserSecurePii(userRecord);
    const userPii = await this.mapUserSecurePiiToUserPii(securePii);
    return userPii;
  }

  // TODO: It should be possible to change all usage of this to mapUserEncryptedPiiToUserPii
  public async mapUserSecurePiiToUserPii(
    userSecurePii: UserSecurePii,
  ): Promise<UserPii> {
    return this.mapUserEncryptedPiiToUserPii(userSecurePii);
  }

  public async mapUserEncryptedPiiToUserPii(args: {
    userEncryptedPii: string;
  }): Promise<UserPii> {
    const { userEncryptedPii } = args;
    const jsonEncoded =
      await this.piiEncryptionService.getDecryptedData(userEncryptedPii);
    const obj = JSON.parse(jsonEncoded) as UserPii;
    return this.toUserPii(obj);
  }

  public async mapUserPiiToUserSecurePii(
    userPii: UserPii,
  ): Promise<UserSecurePii> {
    const pii = this.toUserPii(userPii);
    const jsonEncoded = JSON.stringify(pii);
    const [userHashedEmail, userEncryptedPii] = await Promise.all([
      this.emailHashService.getHashHex(userPii.userEmail),
      this.piiEncryptionService.getEncryptedData(jsonEncoded),
    ]);
    return { userHashedEmail, userEncryptedPii };
  }
}
