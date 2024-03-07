import { Pool } from "pg";
import { HashService } from "../services/hash";
import { EncryptionService } from "../services/encryption";
import { Dog, DogStatus, User } from "../data/db-models";
import {
  dbSelectUser,
  dbSelectUserIdByHashedEmail,
  dbTryInsertUser,
} from "../data/db-users";
import { Registration, UserPii, encryptDogOii } from "./user-models";
import {
  dbInsertDog,
  dbInsertDogVetPreference,
  dbSelectDogListByUserId,
} from "../data/db-dogs";
import { dbBegin, dbCommit, dbRelease, dbRollback } from "../data/db-utils";

export type UserAccountServiceConfig = {
  dbPool: Pool;
  emailHashService: HashService;
  piiEncryptionService: EncryptionService;
};

/**
 * Responsible for user account related operations.
 *
 * NOT responsible for authorisation of the operations. That responsibility
 * falls on the actors; i.e. UserActor, VetActor, and AdminActor.
 */
export class UserAccountService {
  private config: UserAccountServiceConfig;

  constructor(config: UserAccountServiceConfig) {
    this.config = config;
  }

  public async getUserIdByEmail(userEmail: string): Promise<string | null> {
    const userHashedEmail =
      await this.getEmailHashService().getHashHex(userEmail);
    const userId = await dbSelectUserIdByHashedEmail(
      this.getDbPool(),
      userHashedEmail,
    );
    return userId;
  }

  public getUser(userId: string): Promise<User | null> {
    return dbSelectUser(this.getDbPool(), userId);
  }

  public getUserPii(user: User): Promise<UserPii> {
    return this.decryptUserPii(user.userEncryptedPii);
  }

  public async createUserAccount(registration: Registration): Promise<boolean> {
    const conn = await this.getDbPool().connect();
    try {
      await dbBegin(conn);
      const { userEmail, userName, userPhoneNumber } = registration.user;
      const [userHashedEmail, userEncryptedPii] = await Promise.all([
        this.getEmailHashService().getHashHex(userEmail),
        this.encryptUserPii({
          userEmail,
          userName,
          userPhoneNumber,
        }),
      ]);
      const userSpec = { userHashedEmail, userEncryptedPii };
      const userGen = await dbTryInsertUser(conn, userSpec);
      if (userGen === null) {
        await dbRollback(conn);
        return false;
      }
      for (const dogRegistration of registration.dogList) {
        const {
          dogName,
          dogBreed,
          dogBirthday,
          dogGender,
          dogWeightKg,
          dogDea1Point1,
          dogEverPregnant,
          dogEverReceivedTransfusion,
          dogPreferredVetIdList,
        } = dogRegistration;
        const dogEncryptedOii = await encryptDogOii(
          { dogName },
          this.getPiiEncryptionService(),
        );
        const dogGen = await dbInsertDog(conn, userGen.userId, {
          dogBreed,
          dogBirthday,
          dogGender,
          dogWeightKg,
          dogDea1Point1,
          dogEverPregnant,
          dogEverReceivedTransfusion,
          dogEncryptedOii,
          dogStatus: DogStatus.NEW_PROFILE,
        });
        for (const vetId of dogPreferredVetIdList) {
          await dbInsertDogVetPreference(conn, dogGen.dogId, vetId);
        }
      }
      await dbCommit(conn);
      return true;
    } catch {
      await dbRollback(conn);
      return false;
    } finally {
      await dbRelease(conn);
    }
  }

  public getUserDogs(userId: string): Promise<Dog[]> {
    return dbSelectDogListByUserId(this.getDbPool(), userId);
  }

  private getDbPool(): Pool {
    return this.config.dbPool;
  }

  private getPiiEncryptionService(): EncryptionService {
    return this.config.piiEncryptionService;
  }

  private getEmailHashService(): HashService {
    return this.config.emailHashService;
  }

  private encryptUserPii(userPii: UserPii): Promise<string> {
    const data = JSON.stringify(userPii);
    return this.getPiiEncryptionService().getEncryptedData(data);
  }

  private async decryptUserPii(userEncryptedPii: string): Promise<UserPii> {
    const service = this.getPiiEncryptionService();
    const data = await service.getDecryptedData(userEncryptedPii);
    return JSON.parse(data) as UserPii;
  }
}
