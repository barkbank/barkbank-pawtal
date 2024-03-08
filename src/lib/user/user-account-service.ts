import { Pool } from "pg";
import { HashService } from "../services/hash";
import {
  DogRecord,
  DogSecureOii,
  DogSpec,
  DogStatus,
  UserPii,
} from "../data/db-models";
import {
  dbSelectUser,
  dbSelectUserIdByHashedEmail,
  dbTryInsertUser,
} from "../data/db-users";
import { Registration } from "./user-models";
import {
  dbInsertDog,
  dbInsertDogVetPreference,
  dbSelectDogListByUserId,
} from "../data/db-dogs";
import { dbBegin, dbCommit, dbRelease, dbRollback } from "../data/db-utils";
import { UserRecord } from "../data/db-models";
import { UserMapper } from "../data/user-mapper";
import { DogMapper } from "../data/dog-mapper";

export type UserAccountServiceConfig = {
  dbPool: Pool;
  emailHashService: HashService;
  userMapper: UserMapper;
  dogMapper: DogMapper;
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

  public getUserRecord(userId: string): Promise<UserRecord | null> {
    return dbSelectUser(this.getDbPool(), userId);
  }

  public async createUserAccount(registration: Registration): Promise<boolean> {
    const conn = await this.getDbPool().connect();
    try {
      await dbBegin(conn);
      const userPii: UserPii = registration.user;
      const userSpec = await this.getUserMapper().mapUserPiiToUserSpec(userPii);
      const userGen = await dbTryInsertUser(conn, userSpec);
      if (userGen === null) {
        await dbRollback(conn);
        return false;
      }
      for (const dogRegistration of registration.dogList) {
        const { dogName, dogPreferredVetIdList, ...dogDetails } =
          dogRegistration;
        const dogSecureOii: DogSecureOii =
          await this.getDogMapper().mapDogOiiToDogSecureOii({ dogName });
        const dogSpec: DogSpec = {
          ...dogSecureOii,
          ...dogDetails,
          dogStatus: DogStatus.NEW_PROFILE,
        };
        const dogGen = await dbInsertDog(conn, userGen.userId, dogSpec);
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

  public getUserDogRecords(userId: string): Promise<DogRecord[]> {
    return dbSelectDogListByUserId(this.getDbPool(), userId);
  }

  private getDbPool(): Pool {
    return this.config.dbPool;
  }

  private getEmailHashService(): HashService {
    return this.config.emailHashService;
  }

  public getUserMapper(): UserMapper {
    return this.config.userMapper;
  }

  public getDogMapper(): DogMapper {
    return this.config.dogMapper;
  }
}
