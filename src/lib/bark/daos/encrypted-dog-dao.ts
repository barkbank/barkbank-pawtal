import { DbContext, dbQuery } from "@/lib/data/db-utils";
import {
  EncryptedDog,
  EncryptedDogSchema,
  EncryptedDogSpec,
} from "../models/dog-profile-models";
import { z } from "zod";

export class EncryptedDogDao {
  // (!) WIP: These should be using dogs and latest_values
  private table = `"dogs"`;
  private projection = `
  user_id as "userId",
  dog_id as "dogId",
  dog_encrypted_oii as "dogEncryptedOii",
  dog_breed as "dogBreed",
  dog_birthday as "dogBirthday",
  dog_gender as "dogGender",
  dog_weight_kg as "dogWeightKg",
  dog_dea1_point1 as "dogDea1Point1",
  dog_ever_pregnant as "dogEverPregnant",
  dog_ever_received_transfusion as "dogEverReceivedTransfusion"
  `;

  constructor(private db: DbContext) {}

  async insert(args: { spec: EncryptedDogSpec }): Promise<{ dogId: string }> {
    const RowSchema = z.object({ dogId: z.string() });
    const { spec } = args;
    const sql = `
    INSERT INTO ${this.table} (
      user_id,
      dog_encrypted_oii,
      dog_breed,
      dog_birthday,
      dog_gender,
      dog_weight_kg,
      dog_dea1_point1,
      dog_ever_pregnant,
      dog_ever_received_transfusion
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING dog_id AS "dogId"
    `;
    const res = await dbQuery<typeof RowSchema>(this.db, sql, [
      spec.userId,
      spec.dogEncryptedOii,
      spec.dogBreed,
      spec.dogBirthday,
      spec.dogGender,
      spec.dogWeightKg,
      spec.dogDea1Point1,
      spec.dogEverPregnant,
      spec.dogEverReceivedTransfusion,
    ]);
    return RowSchema.parse(res.rows[0]);
  }

  async update(args: { dogId: string; spec: EncryptedDogSpec }) {
    const { dogId, spec } = args;
    const sql = `
    UPDATE dogs
    SET
      dog_encrypted_oii = $2,
      dog_breed = $3,
      dog_birthday = $4,
      dog_gender = $5,
      dog_weight_kg = $6,
      dog_dea1_point1 = $7,
      dog_ever_pregnant = $8,
      dog_ever_received_transfusion = $9,
      profile_modification_time = CURRENT_TIMESTAMP
    WHERE
      dog_id = $1
    `;
    await dbQuery(this.db, sql, [
      dogId,
      spec.dogEncryptedOii,
      spec.dogBreed,
      spec.dogBirthday,
      spec.dogGender,
      spec.dogWeightKg,
      spec.dogDea1Point1,
      spec.dogEverPregnant,
      spec.dogEverReceivedTransfusion,
    ]);
  }

  async get(args: { dogId: string }): Promise<EncryptedDog | null> {
    const { dogId } = args;
    const sql = `
    SELECT ${this.projection}
    FROM ${this.table}
    WHERE dog_id = $1
    `;
    const res = await dbQuery<EncryptedDog>(this.db, sql, [dogId]);
    if (res.rows.length !== 1) {
      return null;
    }
    return EncryptedDogSchema.parse(res.rows[0]);
  }

  async getOwner(args: { dogId: string }): Promise<{ userId: string } | null> {
    const { dogId } = args;
    const RowSchema = z.object({ userId: z.string() });
    const sql = `
    SELECT user_id as "userId"
    FROM dogs
    WHERE dog_id = $1
    `;
    const res = await dbQuery<typeof RowSchema>(this.db, sql, [dogId]);
    if (res.rows.length !== 1) {
      return null;
    }
    return RowSchema.parse(res.rows[0]);
  }

  async listByUser(args: { userId: string }): Promise<EncryptedDog[]> {
    const { userId } = args;
    const sql = `
    SELECT ${this.projection}
    FROM ${this.table}
    WHERE user_id = $1
    `;
    const res = await dbQuery<EncryptedDog>(this.db, sql, [userId]);
    return z.array(EncryptedDogSchema).parse(res.rows);
  }

  async listByVet(args: { vetId: string }): Promise<EncryptedDog[]> {
    // TODO: Impl listByVet
    throw new Error("Not implemented");
  }
}
