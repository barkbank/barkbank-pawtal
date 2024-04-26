import { Err, Ok, Result } from "@/lib/utilities/result";
import { UserActor } from "../user-actor";
import { DogStatuses } from "../user-models";
import {
  MedicalStatus,
  ParticipationStatus,
  ProfileStatus,
  ServiceStatus,
} from "@/lib/data/db-enums";
import { dbQuery } from "@/lib/data/db-utils";

type ErrorCode = "ERROR_UNAUTHORIZED" | "ERROR_MISSING_DOG";

export async function getDogStatuses(
  actor: UserActor,
  dogId: string,
): Promise<Result<DogStatuses, ErrorCode>> {
  const { userId } = actor.getParams();
  const ctx: Context = { actor, dogId };
  const row: Row | null = await fetchRow(ctx);
  if (row === null) {
    return Err("ERROR_MISSING_DOG");
  }
  const { ownerUserId, ...otherFields } = row;
  if (ownerUserId !== userId) {
    return Err("ERROR_UNAUTHORIZED");
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

async function fetchRow(ctx: Context): Promise<Row | null> {
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
  const res = await dbQuery<Row>(dbPool, sql, [dogId]);
  if (res.rows.length == 0) {
    return null;
  }
  return res.rows[0];
}
