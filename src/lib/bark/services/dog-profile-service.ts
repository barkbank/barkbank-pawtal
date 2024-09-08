import { Err, Ok, Result } from "@/lib/utilities/result";
import { BarkContext } from "../bark-context";
import {
  DogProfile,
  DogProfileSchema,
  DogProfileSpec,
  EncryptedDog,
  EncryptedDogSpec,
  EncryptedDogSpecSchema,
  SubProfileSpec,
  VetPreference,
} from "../models/dog-profile-models";
import { CODE } from "@/lib/utilities/bark-code";
import { toDogEncryptedOii } from "../mappers/to-dog-encrypted-oii";
import { toDogOii } from "../mappers/to-dog-oii";
import { PoolClient } from "pg";
import { dbBegin, dbCommit, dbRelease, dbRollback } from "@/lib/data/db-utils";
import { EncryptedDogDao } from "../daos/encrypted-dog-dao";
import { VetPreferenceDao } from "../daos/vet-preference-dao";
import { isEmpty } from "lodash";

export class DogProfileService {
  constructor(private config: { context: BarkContext }) {}

  async addDogProfile(args: {
    userId: string;
    spec: DogProfileSpec;
  }): Promise<Result<{ dogId: string }, typeof CODE.FAILED>> {
    const conn = await this.connect();
    try {
      await dbBegin(conn);
      const dogDao = new EncryptedDogDao(conn);
      const { userId, spec } = args;
      const dog = await this.toEncryptedDogSpec({ userId, spec });
      const { dogId } = await dogDao.insert({ spec: dog });
      if (!isEmpty(spec.dogPreferredVetId)) {
        const prefDao = new VetPreferenceDao(conn);
        const pref: VetPreference = {
          userId,
          dogId,
          vetId: spec.dogPreferredVetId,
        };
        await prefDao.insert({ pref });
      }
      await dbCommit(conn);
      return Ok({ dogId });
    } catch (err) {
      console.error(err);
      return Err(CODE.FAILED);
    } finally {
      await dbRollback(conn);
      await dbRelease(conn);
    }
  }

  async getDogProfile(args: {
    userId: string;
    dogId: string;
  }): Promise<
    Result<DogProfile, typeof CODE.FAILED | typeof CODE.ERROR_DOG_NOT_FOUND>
  > {
    const conn = await this.connect();
    try {
      await dbBegin(conn);
      const dogDao = new EncryptedDogDao(conn);
      const preferenceDao = new VetPreferenceDao(conn);
      const { userId, dogId } = args;
      const dog = await dogDao.get({ dogId });
      if (dog === null) {
        return Err(CODE.ERROR_DOG_NOT_FOUND);
      }
      if (dog.userId !== userId) {
        return Err(CODE.ERROR_DOG_NOT_FOUND);
      }
      const preferences = await preferenceDao.listByDog({ dogId });
      const profile = await this.toDogProfile({ dog, preferences });
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

  async listDogProfiles(args: {
    userId: string;
  }): Promise<Result<DogProfile[], typeof CODE.FAILED>> {
    throw new Error("Not implemented");
  }

  async updateDogProfile(args: {
    userId: string;
    dogId: string;
    spec: DogProfileSpec;
  }): Promise<
    | typeof CODE.OK
    | typeof CODE.FAILED
    | typeof CODE.ERROR_CANNOT_UPDATE_FULL_PROFILE
  > {
    throw new Error("Not implemented");
  }

  async updateSubProfile(args: {
    userId: string;
    dogId: string;
    spec: SubProfileSpec;
  }): Promise<
    | typeof CODE.OK
    | typeof CODE.FAILED
    | typeof CODE.ERROR_SHOULD_UPDATE_FULL_PROFILE
  > {
    throw new Error("Not implemented");
  }

  private async toEncryptedDogSpec(args: {
    userId: string;
    spec: DogProfileSpec;
  }): Promise<EncryptedDogSpec> {
    const { userId, spec } = args;
    const { dogName, ...others } = spec;
    const dogEncryptedOii = await toDogEncryptedOii(this.context(), {
      dogName,
    });
    const out: EncryptedDogSpec = { ...others, dogEncryptedOii, userId };
    return EncryptedDogSpecSchema.parse(out);
  }

  private async toDogProfile(args: {
    dog: EncryptedDog;
    preferences: VetPreference[];
  }): Promise<DogProfile> {
    const { dog, preferences } = args;
    const { dogEncryptedOii, ...others } = dog;
    const { dogName } = await toDogOii(this.context(), dogEncryptedOii);
    const dogPreferredVetId =
      preferences.length === 1 ? preferences[0].vetId : "";
    const out: DogProfile = { dogName, dogPreferredVetId, ...others };
    return DogProfileSchema.parse(out);
  }

  private context(): BarkContext {
    return this.config.context;
  }

  private async connect(): Promise<PoolClient> {
    return this.context().dbPool.connect();
  }
}
