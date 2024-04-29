import { Err, Ok, Result } from "@/lib/utilities/result";
import { UserActor } from "../user-actor";
import { DogStatuses } from "../user-models";
import {
  MedicalStatus,
  ParticipationStatus,
  ProfileStatus,
  ServiceStatus,
} from "@/lib/data/db-enums";
import { dbResultQuery } from "@/lib/data/db-utils";
import { BARK_CODE } from "@/lib/utilities/bark-code";

export async function getDogStatuses(
  actor: UserActor,
  dogId: string,
): Promise<
  Result<
    DogStatuses,
    | typeof BARK_CODE.ERROR_DOG_NOT_FOUND
    | typeof BARK_CODE.ERROR_WRONG_OWNER
    | typeof BARK_CODE.FAILURE_DB_QUERY
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
    return Err(BARK_CODE.ERROR_WRONG_OWNER);
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
  Result<
    Row,
    typeof BARK_CODE.ERROR_DOG_NOT_FOUND | typeof BARK_CODE.FAILURE_DB_QUERY
  >
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
    return Err(BARK_CODE.ERROR_DOG_NOT_FOUND);
  }
  return Ok(res.rows[0]);
}
