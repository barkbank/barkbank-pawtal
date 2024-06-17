import { Err, Ok, Result } from "@/lib/utilities/result";
import { UserActor } from "../user-actor";
import { DogStatuses } from "@/lib/dog/dog-models";
import { ParticipationStatus } from "@/lib/bark/enums/participation-status";
import { MedicalStatus } from "@/lib/bark/enums/medical-status";
import { ProfileStatus } from "@/lib/bark/enums/profile-status";
import { ServiceStatus } from "@/lib/bark/enums/service-status";
import { dbResultQuery } from "@/lib/data/db-utils";
import { CODE } from "@/lib/utilities/bark-code";

export async function getDogStatuses(
  actor: UserActor,
  dogId: string,
): Promise<
  Result<
    DogStatuses,
    | typeof CODE.ERROR_DOG_NOT_FOUND
    | typeof CODE.ERROR_WRONG_OWNER
    | typeof CODE.DB_QUERY_FAILURE
  >
> {
  const { userId } = actor.getParams();
  const ctx: Context = { actor, dogId };
  const { result, error } = await fetchRow(ctx);
  if (error !== undefined) {
    return Err(error);
  }
  const { ownerUserId, ...otherFields } = result;
  if (ownerUserId !== userId) {
    return Err(CODE.ERROR_WRONG_OWNER);
  }
  return Ok(otherFields);
}

type Context = {
  actor: UserActor;
  dogId: string;
};

type Row = {
  ownerUserId: string;
  dogServiceStatus: ServiceStatus;
  dogProfileStatus: ProfileStatus;
  dogMedicalStatus: MedicalStatus;
  dogParticipationStatus: ParticipationStatus;
  numPendingReports: number;
};

async function fetchRow(
  ctx: Context,
): Promise<
  Result<Row, typeof CODE.ERROR_DOG_NOT_FOUND | typeof CODE.DB_QUERY_FAILURE>
> {
  const { actor, dogId } = ctx;
  const { dbPool } = actor.getParams();
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
    tStatus.user_id as "ownerUserId",
    tStatus.service_status as "dogServiceStatus",
    tStatus.profile_status as "dogProfileStatus",
    tStatus.medical_status as "dogMedicalStatus",
    tStatus.participation_status as "dogParticipationStatus",
    COALESCE(tCall.num_pending_appointments, 0)::int as "numPendingReports"
  FROM dog_statuses as tStatus
  LEFT JOIN mCallStats as tCall on tStatus.dog_id = tCall.dog_id
  WHERE tStatus.dog_id = $1
  `;
  const { result: res, error } = await dbResultQuery<Row>(dbPool, sql, [dogId]);
  if (error !== undefined) {
    return Err(error);
  }
  if (res.rows.length == 0) {
    return Err(CODE.ERROR_DOG_NOT_FOUND);
  }
  return Ok(res.rows[0]);
}
