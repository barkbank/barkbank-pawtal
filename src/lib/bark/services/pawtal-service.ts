import { Err, Ok, Result } from "@/lib/utilities/result";
import { BarkContext } from "../bark-context";
import { CODE } from "@/lib/utilities/bark-code";
import {
  DogIdentifier,
  DogProfile,
  EncryptedDogProfile,
  EncryptedDogProfileSchema,
} from "../models/dog-profile";
import { PoolClient } from "pg";
import { dbBegin, dbCommit, dbRelease, dbRollback } from "@/lib/data/db-utils";
import { EncryptedDogProfileDao } from "../daos/encrypted-dog-profile-dao";
import { DogOii } from "../models/dog-oii";
import { toDogEncryptedOii } from "../mappers/to-dog-encrypted-oii";
import { toDogProfile } from "../mappers/to-dog-profile";

export class PawtalService {
  constructor(private config: { context: BarkContext }) {}

  private context(): BarkContext {
    return this.config.context;
  }

  private async connect(): Promise<PoolClient> {
    return this.config.context.dbPool.connect();
  }

  async addOwnerDog(args: {
    userId: string;
    profile: DogProfile;
  }): Promise<Result<DogIdentifier, typeof CODE.FAILED>> {
    const { userId, profile } = args;
    const conn = await this.connect();
    try {
      await dbBegin(conn);
      const encrypted = await this.toEncryptedDogProfile(profile);
      const dao = new EncryptedDogProfileDao(conn);
      const res = await dao.insert({ userId, profile: encrypted });
      await dbCommit(conn);
      return Ok(res);
    } catch (err) {
      console.error(err);
      return Err(CODE.FAILED);
    } finally {
      await dbRollback(conn);
      await dbRelease(conn);
    }
  }

  async getOwnerDog(args: {
    userId: string;
    dogId: string;
  }): Promise<
    Result<DogProfile, typeof CODE.FAILED | typeof CODE.ERROR_DOG_NOT_FOUND>
  > {
    const { userId, dogId } = args;
    const conn = await this.connect();
    try {
      await dbBegin(conn);
      const dao = new EncryptedDogProfileDao(conn);
      const encrypted = await dao.getOwnerDog({ userId, dogId });
      if (encrypted === null) {
        return Err(CODE.ERROR_DOG_NOT_FOUND);
      }
      const profile = await this.toDogProfile(encrypted);
      await dbCommit(conn);
      return Ok(profile);
    } catch (err) {
      console.error(err);
      return Err(CODE.FAILED);
    } finally {
      await dbRollback(conn);
      await dbRelease(conn);
    }
  }

  async toEncryptedDogProfile(
    profile: DogProfile,
  ): Promise<EncryptedDogProfile> {
    const context = this.context();
    const { dogName, ...others } = profile;
    const dogOii: DogOii = { dogName };
    // TODO: Move all mapping related to DogProfile into this service
    const dogEncryptedOii = await toDogEncryptedOii(context, dogOii);
    const out: EncryptedDogProfile = { dogEncryptedOii, ...others };
    return EncryptedDogProfileSchema.parse(out);
  }

  async toDogProfile(encrypted: EncryptedDogProfile): Promise<DogProfile> {
    // TODO: Move all mapping related to DogProfile into this service
    return toDogProfile(this.context(), encrypted);
  }
}
