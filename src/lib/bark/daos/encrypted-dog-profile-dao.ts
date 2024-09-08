import { dbQuery } from "@/lib/data/db-utils";
import {
  DogIdentifier,
  DogIdentifierSchema,
  EncryptedDogProfile,
  EncryptedDogProfileSchema,
} from "../models/dog-profile";
import { PoolClient } from "pg";

export class EncryptedDogProfileDao {
  constructor(private conn: PoolClient) {}

  async insert(args: {
    userId: string;
    profile: EncryptedDogProfile;
  }): Promise<DogIdentifier> {
    const { userId, profile } = args;
    const sql = `
    `;
    const res = await dbQuery<DogIdentifier>(this.conn, sql, [
      userId,
      profile.dogBreed,
      profile.dogBirthday,
      profile.dogGender,
      profile.dogWeightKg,
      profile.dogDea1Point1,
      profile.dogEverPregnant,
      profile.dogEverReceivedTransfusion,
    ]);
    const result = DogIdentifierSchema.parse(res.rows[0]);
    const { dogId } = result;
    if (profile.dogPreferredVetId !== "") {
      await this.setPreferredVet({
        userId,
        dogId,
        vetId: profile.dogPreferredVetId,
      });
    }
    return result;
  }

  async setPreferredVet(args: {
    userId: string;
    dogId: string;
    vetId: string;
  }): Promise<void> {
    const { userId, dogId, vetId } = args;
    const sql = ``;
    await dbQuery(this.conn, sql, [userId, dogId, vetId]);
  }

  async getOwnerDog(args: {
    userId: string;
    dogId: string;
  }): Promise<EncryptedDogProfile | null> {
    const { userId, dogId } = args;
    const sql = ``;
    const res = await dbQuery<EncryptedDogProfile>(this.conn, sql, [
      userId,
      dogId,
    ]);
    if (res.rows.length !== 1) {
      return null;
    }
    return EncryptedDogProfileSchema.parse(res.rows[0]);
  }
}
