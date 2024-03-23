import { Pool } from "pg";
import { UserRecord } from "../data/db-models";
import { UserPii } from "../data/db-models";
import { UserMapper } from "../data/user-mapper";
import { DogMapper } from "../data/dog-mapper";
import { dbSelectUser } from "../data/db-users";
import { DogList, DogListItem } from "./user-models";
import { dbQuery } from "../data/db-utils";
import { DOG_STATUS } from "../bark-models";

export type UserActorConfig = {
  dbPool: Pool;
  userMapper: UserMapper;
  dogMapper: DogMapper;
};

/**
 * Actor for user accounts
 *
 * Responsible for ensuring users only take actions for which they have proper
 * authorisation. E.g. view own PII and not that of another user.
 */
export class UserActor {
  private userId: string;
  private config: UserActorConfig;

  constructor(userId: string, config: UserActorConfig) {
    this.userId = userId;
    this.config = config;
  }

  public getUserId(): string {
    return this.userId;
  }

  public async getOwnUserRecord(): Promise<UserRecord | null> {
    const { dbPool } = this.config;
    const record = await dbSelectUser(dbPool, this.getUserId());
    return record;
  }

  public async getOwnUserPii(): Promise<UserPii | null> {
    const record = await this.getOwnUserRecord();
    if (record === null) {
      return null;
    }
    const { userMapper } = this.config;
    return userMapper.mapUserRecordToUserPii(record);
  }

  public async getDogList(): Promise<DogList> {
    const { dbPool, dogMapper } = this.config;
    const sql = `
    SELECT
      dog_id as "dogId",
      dog_encrypted_oii as "dogEncryptedOii",
      CASE
        WHEN dog_breed = '' AND dog_weight_kg IS NULL THEN $2
        WHEN dog_weight_kg < 20 THEN $4
        WHEN dog_ever_pregnant = 'YES' THEN $5
        WHEN dog_ever_received_transfusion = 'YES' THEN $5
        ELSE $3
      END as "dogStatus"
    FROM dogs
    WHERE user_id = $1
    `;
    const res = await dbQuery(dbPool, sql, [
      this.getUserId(),
      DOG_STATUS.INCOMPLETE,
      DOG_STATUS.ELIGIBLE,
      DOG_STATUS.INELIGIBLE,
      DOG_STATUS.PERMANENTLY_INELIGIBLE,
    ]);
    const dogs = await Promise.all(
      res.rows.map(async (row) => {
        const { dogId, dogStatus } = row;
        const secureOii = dogMapper.toDogSecureOii(row);
        const oii = await dogMapper.mapDogSecureOiiToDogOii(secureOii);
        return {
          dogId,
          dogName: oii.dogName,
          dogStatus,
        } as DogListItem;
      }),
    );
    return { dogs };
  }
}
