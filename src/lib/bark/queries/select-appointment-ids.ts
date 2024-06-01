import { DbContext, dbQuery } from "@/lib/data/db-utils";
import { BarkAppointmentIds, BarkAppointmentIdsSchema } from "../bark-models";

export async function selectAppointmentIds(
  dbContext: DbContext,
  args: { appointmentId: string },
): Promise<BarkAppointmentIds | null> {
  const { appointmentId } = args;
  const sql = `
  SELECT
    call_id as "appointmentId",
    dog_id as "dogId",
    vet_id as "vetId"
  FROM calls
  WHERE call_id = $1
  AND call_outcome = 'APPOINTMENT'
  `;
  const res = await dbQuery<BarkAppointmentIds>(dbContext, sql, [
    appointmentId,
  ]);
  if (res.rows.length === 0) {
    return null;
  }
  return BarkAppointmentIdsSchema.parse(res.rows[0]);
}
