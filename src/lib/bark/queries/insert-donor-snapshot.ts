import { DbContext, dbQuery } from "@/lib/data/db-utils";
import { z } from "zod";

const ResultSchema = z.object({ donorCount: z.number() });
type ResultType = z.infer<typeof ResultSchema>;

export async function insertDonorSnapshot(
  db: DbContext,
  args: { referenceDate: Date },
): Promise<ResultType> {
  const { referenceDate } = args;
  const sql = `
  WITH
  mInsertion as (
    INSERT INTO donor_snapshots (
      "day",
      "dog_id",
      "dog_breed",
      "dog_age_months",
      "dog_gender",
      "dog_weight_kg",
      "dog_dea1_point1",
      "dog_ever_pregnant",
      "dog_ever_received_transfusion",
      "dog_medical_status",
      "dog_profile_status",
      "user_id",
      "user_residency"
    )
    SELECT
      ($1 AT TIME ZONE 'Asia/Singapore')::date as "day",
      tDog.dog_id,
      tDog.dog_breed,
      tLatest.latest_dog_age_months as "dog_age_months",
      tDog.dog_gender,
      tLatest.latest_dog_weight_kg as "dog_weight_kg",
      tLatest.latest_dog_dea1_point1 as "dog_dea1_point1",
      tDog.dog_ever_pregnant,
      tDog.dog_ever_received_transfusion,
      tStatus.medical_status as "dog_medical_status",
      tStatus.profile_status as "dog_profile_status",
      tUser.user_id,
      tUser.user_residency
    FROM dogs as tDog
    LEFT JOIN latest_values as tLatest on tDog.dog_id = tLatest.dog_id
    LEFT JOIN dog_statuses as tStatus on tDog.dog_id = tStatus.dog_id
    LEFT JOIN users as tUser on tDog.user_id = tUser.user_id

    RETURNING 1
  )

  SELECT COUNT(*)::INTEGER as "donorCount" FROM mInsertion
  `;
  const res = await dbQuery<ResultType>(db, sql, [referenceDate]);
  return ResultSchema.parse(res.rows[0]);
}
