import { Err, Ok, Result } from "@/lib/utilities/result";
import { BarkContext } from "../bark-context";
import {
  DogProfile,
  DogProfileSchema,
  DogProfileSpec,
  EncryptedDog,
  EncryptedDogSpec,
  EncryptedDogSpecSchema,
  EncryptedSubDogSpec,
  EncryptedSubDogSpecSchema,
  SubProfileSpec,
  VetPreference,
} from "../models/dog-profile-models";
import { CODE } from "@/lib/utilities/bark-code";
import { toDogEncryptedOii } from "../mappers/to-dog-encrypted-oii";
import { toDogOii } from "../mappers/to-dog-oii";
import { Pool } from "pg";
import { dbTransaction } from "@/lib/data/db-utils";
import { EncryptedDogDao } from "../daos/encrypted-dog-dao";
import { VetPreferenceDao } from "../daos/vet-preference-dao";
import { isEmpty } from "lodash";
import { EncryptedReportDao } from "../daos/encrypted-report-dao";

export class DogProfileService {
  constructor(private config: { context: BarkContext }) {}

  async addDogProfile(args: {
    userId: string;
    spec: DogProfileSpec;
  }): Promise<Result<{ dogId: string }, typeof CODE.FAILED>> {
    const { userId, spec } = args;
    const vetId = spec.dogPreferredVetId;
    return dbTransaction(this.pool(), async (conn) => {
      const dogDao = new EncryptedDogDao(conn);
      const prefDao = new VetPreferenceDao(conn);
      const dog = await this.toEncryptedDogSpec({ userId, spec });
      const { dogId } = await dogDao.insert({ spec: dog });
      if (!isEmpty(vetId)) {
        const pref: VetPreference = { userId, dogId, vetId };
        await prefDao.insert({ pref });
      }
      return Ok({ dogId });
    });
  }

  async getDogProfile(args: {
    userId: string;
    dogId: string;
  }): Promise<
    Result<DogProfile, typeof CODE.FAILED | typeof CODE.ERROR_DOG_NOT_FOUND>
  > {
    const { userId, dogId } = args;
    return dbTransaction(this.pool(), async (conn) => {
      const dogDao = new EncryptedDogDao(conn);
      const preferenceDao = new VetPreferenceDao(conn);
      const dog = await dogDao.get({ dogId });
      if (dog === null) {
        return Err(CODE.ERROR_DOG_NOT_FOUND);
      }
      if (dog.userId !== userId) {
        return Err(CODE.ERROR_DOG_NOT_FOUND);
      }
      const preferences = await preferenceDao.listByDog({ dogId });
      const profile = await this.toDogProfile({ dog, preferences });
      return Ok(profile);
    });
  }

  async listDogProfiles(args: {
    userId: string;
  }): Promise<Result<DogProfile[], typeof CODE.FAILED>> {
    const { userId } = args;
    return dbTransaction(this.pool(), async (conn) => {
      const dogDao = new EncryptedDogDao(conn);
      const preferenceDao = new VetPreferenceDao(conn);
      const dogs = await dogDao.listByUser({ userId });
      const preferences: VetPreference[] = await preferenceDao.listByUser({
        userId,
      });
      const dogPrefs: Record<string, VetPreference[]> = {};
      for (const pref of preferences) {
        if (!dogPrefs[pref.dogId]) {
          dogPrefs[pref.dogId] = [];
        }
        dogPrefs[pref.dogId].push(pref);
      }
      const profiles = await Promise.all(
        dogs.map(async (dog) => {
          return this.toDogProfile({
            dog,
            preferences: dogPrefs[dog.dogId] ?? [],
          });
        }),
      );
      return Ok(profiles);
    });
  }

  async updateDogProfile(args: {
    userId: string;
    dogId: string;
    spec: DogProfileSpec;
  }): Promise<
    Result<
      true,
      | typeof CODE.FAILED
      | typeof CODE.ERROR_DOG_NOT_FOUND
      | typeof CODE.ERROR_CANNOT_UPDATE_FULL_PROFILE
    >
  > {
    const { userId, dogId, spec } = args;
    const vetId = spec.dogPreferredVetId;
    return dbTransaction(this.pool(), async (conn) => {
      const dogDao = new EncryptedDogDao(conn);
      const prefDao = new VetPreferenceDao(conn);
      const reportDao = new EncryptedReportDao(conn);
      const resOwner = await dogDao.getOwner({ dogId });
      if (resOwner === null) {
        return Err(CODE.ERROR_DOG_NOT_FOUND);
      }
      if (resOwner.userId !== userId) {
        return Err(CODE.ERROR_DOG_NOT_FOUND);
      }
      const { reportCount } = await reportDao.getReportCountByDog({ dogId });
      if (reportCount > 0) {
        return Err(CODE.ERROR_CANNOT_UPDATE_FULL_PROFILE);
      }
      const encryptedSpec = await this.toEncryptedDogSpec({ userId, spec });
      await dogDao.update({ dogId, spec: encryptedSpec });
      await prefDao.deleteByDog({ dogId });
      if (!isEmpty(vetId)) {
        await prefDao.insert({ pref: { userId, dogId, vetId } });
      }
      return Ok(true);
    });
  }

  async updateSubProfile(args: {
    userId: string;
    dogId: string;
    spec: SubProfileSpec;
  }): Promise<
    Result<
      true,
      | typeof CODE.FAILED
      | typeof CODE.ERROR_DOG_NOT_FOUND
      | typeof CODE.ERROR_SHOULD_UPDATE_FULL_PROFILE
    >
  > {
    const { userId, dogId, spec } = args;
    const vetId = spec.dogPreferredVetId;
    return dbTransaction(this.pool(), async (conn) => {
      const dogDao = new EncryptedDogDao(conn);
      const prefDao = new VetPreferenceDao(conn);
      const reportDao = new EncryptedReportDao(conn);
      const resOwner = await dogDao.getOwner({ dogId });
      if (resOwner === null) {
        return Err(CODE.ERROR_DOG_NOT_FOUND);
      }
      if (resOwner.userId !== userId) {
        return Err(CODE.ERROR_DOG_NOT_FOUND);
      }
      const { reportCount } = await reportDao.getReportCountByDog({ dogId });
      if (reportCount === 0) {
        return Err(CODE.ERROR_SHOULD_UPDATE_FULL_PROFILE);
      }
      const encryptedSpec = await this.toEncryptedSubDogSpec({ spec });
      await dogDao.updateSubDog({ dogId, spec: encryptedSpec });
      await prefDao.deleteByDog({ dogId });
      if (!isEmpty(vetId)) {
        await prefDao.insert({ pref: { userId, dogId, vetId } });
      }
      return Ok(true);
    });
  }

  private async toDogEncryptedOii(args: {
    dogName: string;
  }): Promise<{ dogEncryptedOii: string }> {
    const { dogName } = args;
    const dogEncryptedOii = await toDogEncryptedOii(this.context(), {
      dogName,
    });
    return { dogEncryptedOii };
  }

  private async toDogName(args: {
    dogEncryptedOii: string;
  }): Promise<{ dogName: string }> {
    const { dogEncryptedOii } = args;
    const { dogName } = await toDogOii(this.context(), dogEncryptedOii);
    return { dogName };
  }

  private async toEncryptedSubDogSpec(args: {
    spec: SubProfileSpec;
  }): Promise<EncryptedSubDogSpec> {
    const { spec } = args;
    const { dogName, ...others } = spec;
    const { dogEncryptedOii } = await this.toDogEncryptedOii({ dogName });
    const out: EncryptedSubDogSpec = { ...others, dogEncryptedOii };
    return EncryptedSubDogSpecSchema.parse(out);
  }

  private async toEncryptedDogSpec(args: {
    userId: string;
    spec: DogProfileSpec;
  }): Promise<EncryptedDogSpec> {
    const { userId, spec } = args;
    const { dogName, ...others } = spec;
    const { dogEncryptedOii } = await this.toDogEncryptedOii({ dogName });
    const out: EncryptedDogSpec = { ...others, dogEncryptedOii, userId };
    return EncryptedDogSpecSchema.parse(out);
  }

  private async toDogProfile(args: {
    dog: EncryptedDog;
    preferences: VetPreference[];
  }): Promise<DogProfile> {
    const { dog, preferences } = args;
    const { dogEncryptedOii, ...others } = dog;
    const { dogName } = await this.toDogName({ dogEncryptedOii });
    const dogPreferredVetId =
      preferences.length === 1 ? preferences[0].vetId : "";
    const out: DogProfile = { dogName, dogPreferredVetId, ...others };
    return DogProfileSchema.parse(out);
  }

  private context(): BarkContext {
    return this.config.context;
  }

  private pool(): Pool {
    return this.context().dbPool;
  }
}
