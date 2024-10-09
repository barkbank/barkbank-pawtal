import { DbContext, dbQuery } from "@/lib/data/db-utils";
import {
  VetPreference,
  VetPreferenceSchema,
} from "../models/dog-profile-models";
import { z } from "zod";

export class VetPreferenceDao {
  private projection = `
  user_id as "userId",
  dog_id as "dogId",
  vet_id as "vetId"
  `;
  constructor(private db: DbContext) {}

  async insert(args: { pref: VetPreference }): Promise<void> {
    const { pref } = args;
    const sql = `
    INSERT INTO dog_vet_preferences (
      user_id,
      dog_id,
      vet_id
    )
    VALUES ($1, $2, $3)
    ON CONFLICT (dog_id, vet_id) DO NOTHING
    `;
    await dbQuery(this.db, sql, [pref.userId, pref.dogId, pref.vetId]);
  }

  async getByDogAndVet(args: {
    dogId: string;
    vetId: string;
  }): Promise<VetPreference | null> {
    const { dogId, vetId } = args;
    const sql = `
    SELECT ${this.projection}
    FROM dog_vet_preferences
    WHERE dog_id = $1
    AND vet_id = $2
    `;
    const res = await dbQuery(this.db, sql, [dogId, vetId]);
    if (res.rows.length !== 1) {
      return null;
    }
    return VetPreferenceSchema.parse(res.rows[0]);
  }

  async deleteByDog(args: { dogId: string }): Promise<void> {
    const { dogId } = args;
    const sql = `
    DELETE FROM dog_vet_preferences
    WHERE dog_id = $1
    `;
    await dbQuery(this.db, sql, [dogId]);
  }

  async listByDog(args: { dogId: string }): Promise<VetPreference[]> {
    const { dogId } = args;
    const sql = `
    SELECT ${this.projection}
    FROM dog_vet_preferences
    WHERE dog_id = $1
    `;
    const res = await dbQuery<VetPreference>(this.db, sql, [dogId]);
    return z.array(VetPreferenceSchema).parse(res.rows);
  }

  async listByUser(args: { userId: string }): Promise<VetPreference[]> {
    const { userId } = args;
    const sql = `
    SELECT ${this.projection}
    FROM dog_vet_preferences
    WHERE user_id = $1
    `;
    const res = await dbQuery<VetPreference>(this.db, sql, [userId]);
    return z.array(VetPreferenceSchema).parse(res.rows);
  }
}
