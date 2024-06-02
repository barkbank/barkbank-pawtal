import { DbContext, dbQuery } from "@/lib/data/db-utils";
import { z } from "zod";
import {
  AppointmentSituation,
  AppointmentSituationSchema,
} from "../models/appointment-situation";

const ArgSchema = z.object({
  dogId: z.string(),
  vetId: z.string(),
});

type ArgType = z.infer<typeof ArgSchema>;

export async function selectAppointmentSituation(
  dbContext: DbContext,
  args: ArgType,
): Promise<AppointmentSituation> {
  const { dogId, vetId } = ArgSchema.parse(args);
  const sql = `
  WITH
  mCountMatchingDogs as (
    SELECT COUNT(*) as num_matching_dogs
    FROM dogs
    WHERE dog_id = $1
  ),
  mCountMatchingVets as (
    SELECT COUNT(*) as num_matching_vets
    FROM vets
    WHERE vet_id = $2
  ),
  mCountMatchingPreferences as (
    SELECT COUNT(*) as num_matching_preferences
    FROM dog_vet_preferences
    WHERE dog_id = $1
    AND vet_id = $2
  ),
  mCountPendingAppointments as (
    SELECT COUNT(*) as num_pending_appointments
    FROM calls
    WHERE call_outcome = 'APPOINTMENT'
    AND dog_id = $1
    AND vet_id = $2
  )

  SELECT
    num_matching_dogs = 1 as "dogExists",
    num_matching_vets = 1 as "vetExists",
    num_matching_preferences = 1 as "isPreferredVet",
    num_pending_appointments > 0 as "hasExistingAppointment"
  FROM
    mCountMatchingDogs,
    mCountMatchingVets,
    mCountMatchingPreferences,
    mCountPendingAppointments
  `;
  const res = await dbQuery<AppointmentSituation>(dbContext, sql, [
    dogId,
    vetId,
  ]);
  return AppointmentSituationSchema.parse(res.rows[0]);
}
