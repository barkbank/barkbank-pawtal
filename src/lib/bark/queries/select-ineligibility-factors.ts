import { DbContext, dbQuery } from "@/lib/data/db-utils";
import {
  IneligibilityFactors,
  IneligibilityFactorsSchema,
} from "../models/ineligibility-factors";

export async function selectIneligibilityFactors(
  db: DbContext,
  args: { dogId: string },
): Promise<IneligibilityFactors | null> {
  const { dogId } = args;
  const sql = `
  SELECT
    tDog.dog_birthday as "dogBirthday",
    tDog.dog_ever_pregnant as "dogEverPregnant",
    tDog.dog_ever_received_transfusion as "dogEverReceivedTransfusion",
    tLatest.latest_dog_weight_kg as "latestDogWeightKg",
    tLatest.latest_dog_heartworm_result as "latestDogHeartwormResult",
    tLatest.latest_dog_heartworm_observation_time as "latestDogHeartwormObservationTime",
    COALESCE(tLatest.latest_dog_reported_ineligibility, 'NIL') as "latestDogReportedIneligibility",
    tLatest.latest_ineligibility_expiry_time as "latestDogReportedIneligibilityExpiryTime",
    tLatest.latest_blood_donation_time as "latestDonationTime"
  FROM dogs as tDog
  LEFT JOIN latest_values as tLatest on tDog.dog_id = tLatest.dog_id
  WHERE tDog.dog_id = $1
  `;
  const res = await dbQuery<IneligibilityFactors>(db, sql, [dogId]);
  if (res.rows.length !== 1) {
    return null;
  }
  return IneligibilityFactorsSchema.parse(res.rows[0]);
}
