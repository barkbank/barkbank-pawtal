import { DbContext, dbQuery } from "@/lib/data/db-utils";
import {
  EncryptedDog,
  EncryptedDogSchema,
  EncryptedDogSpec,
  EncryptedSubDogSpec,
} from "../models/dog-profile-models";
import { z } from "zod";

export class EncryptedDogDao {
  private latestProjection = `
  tDog.user_id as "userId",
  tDog.dog_id as "dogId",
  tDog.dog_encrypted_oii as "dogEncryptedOii",
  tDog.dog_breed as "dogBreed",
  tDog.dog_birthday as "dogBirthday",
  tDog.dog_gender as "dogGender",
  tLatest.latest_dog_weight_kg as "dogWeightKg",
  CASE
    WHEN tLatest.latest_dog_dea1_point1 = 'POSITIVE' THEN 'POSITIVE'::t_dog_antigen_presence
    WHEN tLatest.latest_dog_dea1_point1 = 'NEGATIVE' THEN 'NEGATIVE'::t_dog_antigen_presence
    ELSE 'UNKNOWN'::t_dog_antigen_presence
  END as "dogDea1Point1",
  tDog.dog_ever_pregnant as "dogEverPregnant",
  tDog.dog_ever_received_transfusion as "dogEverReceivedTransfusion"
  `;

  constructor(private db: DbContext) {}

  async insert(args: { spec: EncryptedDogSpec }): Promise<{ dogId: string }> {
    const RowSchema = z.object({ dogId: z.string() });
    type Row = z.infer<typeof RowSchema>;
    const { spec } = args;
    const sql = `
    INSERT INTO dogs (
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
    const res = await dbQuery<Row>(this.db, sql, [
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

  async updateSubDog(args: { dogId: string; spec: EncryptedSubDogSpec }) {
    const { dogId, spec } = args;
    const sql = `
    UPDATE dogs
    SET
      dog_encrypted_oii = $2,
      dog_weight_kg = $3,
      dog_ever_pregnant = $4,
      dog_ever_received_transfusion = $5,
      profile_modification_time = CURRENT_TIMESTAMP
    WHERE
      dog_id = $1
    `;
    await dbQuery(this.db, sql, [
      dogId,
      spec.dogEncryptedOii,
      spec.dogWeightKg,
      spec.dogEverPregnant,
      spec.dogEverReceivedTransfusion,
    ]);
  }

  async get(args: { dogId: string }): Promise<EncryptedDog | null> {
    const { dogId } = args;
    const sql = `
    SELECT ${this.latestProjection}
    FROM dogs as tDog
    LEFT JOIN latest_values as tLatest on tDog.dog_id = tLatest.dog_id
    WHERE tDog.dog_id = $1
    `;
    const res = await dbQuery<EncryptedDog>(this.db, sql, [dogId]);
    if (res.rows.length !== 1) {
      return null;
    }
    return EncryptedDogSchema.parse(res.rows[0]);
  }

  async getOwner(args: { dogId: string }): Promise<{ userId: string } | null> {
    const RowSchema = z.object({ userId: z.string() });
    type Row = z.infer<typeof RowSchema>;
    const { dogId } = args;
    const sql = `
    SELECT user_id as "userId"
    FROM dogs
    WHERE dog_id = $1
    `;
    const res = await dbQuery<Row>(this.db, sql, [dogId]);
    if (res.rows.length !== 1) {
      return null;
    }
    return RowSchema.parse(res.rows[0]);
  }

  async listByUser(args: { userId: string }): Promise<EncryptedDog[]> {
    const { userId } = args;
    const sql = `
    SELECT ${this.latestProjection}
    FROM dogs as tDog
    LEFT JOIN latest_values as tLatest on tDog.dog_id = tLatest.dog_id
    WHERE tDog.user_id = $1
    `;
    const res = await dbQuery<EncryptedDog>(this.db, sql, [userId]);
    return z.array(EncryptedDogSchema).parse(res.rows);
  }

  async listByVet(args: { vetId: string }): Promise<EncryptedDog[]> {
    // TODO: Impl listByVet
    throw new Error("Not implemented");
  }
}
