import { DbContext, dbQuery } from "@/lib/data/db-utils";

export async function selectAppointmentStats(
  dbContext: DbContext,
  args: { dogId: string; vetId: string },
): Promise<{
  dogExists: boolean;
  vetExists: boolean;
  isPreferredVet: boolean;
  hasExistingAppointment: boolean;
}> {
  const { dogId, vetId } = args;
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
  const res = await dbQuery<{
    dogExists: boolean;
    vetExists: boolean;
    isPreferredVet: boolean;
    hasExistingAppointment: boolean;
  }>(dbContext, sql, [dogId, vetId]);
  return res.rows[0];
}
