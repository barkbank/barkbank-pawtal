import { DbContext, dbQuery } from "@/lib/data/db-utils";
import { DogStatuses, DogStatusesSchema } from "../models/dog-statuses";

export class DogStatusesDao {
  constructor(private db: DbContext) {}

  async getDogStatuses(args: { dogId: string }): Promise<DogStatuses | null> {
    const { dogId } = args;
    const sql = `
    WITH
    mCallStats as (
      SELECT
        dog_id,
        COUNT(1) as num_pending_appointments
      FROM calls
      WHERE dog_id = $1
      AND call_outcome = 'APPOINTMENT'
      GROUP BY dog_id
    )
    SELECT
      tStatus.service_status as "dogServiceStatus",
      tStatus.profile_status as "dogProfileStatus",
      tStatus.medical_status as "dogMedicalStatus",
      tStatus.participation_status as "dogParticipationStatus",
      COALESCE(tCall.num_pending_appointments, 0)::int as "numPendingReports"
    FROM dog_statuses as tStatus
    LEFT JOIN mCallStats as tCall on tStatus.dog_id = tCall.dog_id
    WHERE tStatus.dog_id = $1
    `;
    const res = await dbQuery<DogStatuses>(this.db, sql, [dogId]);
    if (res.rows.length !== 1) {
      return null;
    }
    return DogStatusesSchema.parse(res.rows[0]);
  }
}
