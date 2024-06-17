import { Err, Ok, Result } from "@/lib/utilities/result";
import { UserActor } from "../user-actor";
import {
  DogAppointment,
  DogAppointmentSchema,
} from "@/lib/bark/models/dog-appointment";
import { CODE } from "@/lib/utilities/bark-code";
import {
  dbBegin,
  dbCommit,
  dbRelease,
  dbResultQuery,
  dbRollback,
} from "@/lib/data/db-utils";
import { PoolClient } from "pg";

export async function getDogAppointments(
  actor: UserActor,
  dogId: string,
): Promise<
  Result<
    DogAppointment[],
    | typeof CODE.ERROR_DOG_NOT_FOUND
    | typeof CODE.ERROR_WRONG_OWNER
    | typeof CODE.DB_QUERY_FAILURE
  >
> {
  const { dbPool } = actor.getParams();
  const conn = await dbPool.connect();
  try {
    await dbBegin(conn);
    const ctx = { actor, dogId, conn };
    const resOwner = await checkOwnership(ctx);
    if (resOwner !== CODE.OK) {
      return Err(resOwner);
    }
    const { result, error } = await fetchAppointments(ctx);
    if (error !== undefined) {
      return Err(error);
    }
    await dbCommit(conn);
    return Ok(result);
  } finally {
    await dbRollback(conn);
    await dbRelease(conn);
  }
}

type Context = {
  actor: UserActor;
  dogId: string;
  conn: PoolClient;
};

async function checkOwnership(
  ctx: Context,
): Promise<
  | typeof CODE.OK
  | typeof CODE.ERROR_DOG_NOT_FOUND
  | typeof CODE.ERROR_WRONG_OWNER
  | typeof CODE.DB_QUERY_FAILURE
> {
  const { actor, dogId, conn } = ctx;
  const { userId } = actor.getParams();
  const sql = `
  SELECT user_id as "ownerUserId"
  FROM dogs
  WHERE dog_id = $1
  `;
  const { result, error } = await dbResultQuery<{ ownerUserId: string }>(
    conn,
    sql,
    [dogId],
  );
  if (error !== undefined) {
    return error;
  }
  if (result.rows.length === 0) {
    return CODE.ERROR_DOG_NOT_FOUND;
  }
  if (result.rows[0].ownerUserId !== userId) {
    return CODE.ERROR_WRONG_OWNER;
  }
  return CODE.OK;
}

async function fetchAppointments(
  ctx: Context,
): Promise<Result<DogAppointment[], typeof CODE.DB_QUERY_FAILURE>> {
  const { dogId, conn } = ctx;
  const sql = `
  SELECT
    tCall.dog_id as "dogId",
    tCall.call_id as "appointmentId",
    tCall.vet_id as "vetId",
    tVet.vet_name as "vetName"
  FROM calls as tCall
  LEFT JOIN vets as tVet on tCall.vet_id = tVet.vet_id
  WHERE tCall.dog_id = $1
  AND tCall.call_outcome = 'APPOINTMENT'
  `;
  const { result, error } = await dbResultQuery<DogAppointment>(conn, sql, [
    dogId,
  ]);
  if (error !== undefined) {
    return Err(error);
  }
  return Ok(result.rows.map((row) => DogAppointmentSchema.parse(row)));
}
