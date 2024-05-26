import { Err, Ok, Result } from "@/lib/utilities/result";
import { CODE } from "@/lib/utilities/bark-code";
import { dbResultQuery } from "@/lib/data/db-utils";
import { SQL_QUERY, loadSql } from "../../pg-bark/_sql/load-sql";
import { BarkContext } from "@/lib/bark/bark-context";

export async function BarkAction_hasAppointment(
  context: BarkContext,
  args: {
    dogId: string;
    vetId: string;
  },
): Promise<
  Result<
    { hasAppointment: boolean },
    | typeof CODE.ERROR_DOG_NOT_FOUND
    | typeof CODE.ERROR_VET_NOT_FOUND
    | typeof CODE.ERROR_NOT_PREFERRED_VET
    | typeof CODE.STORAGE_FAILURE
  >
> {
  const { dbPool } = context;
  const { dogId, vetId } = args;
  // WIP: do not use loadSql
  const sql = loadSql(SQL_QUERY.SELECT_CAN_SCHEDULE);
  const { result, error } = await dbResultQuery<{
    dogExists: boolean;
    vetExists: boolean;
    isPreferredVet: boolean;
    hasExistingAppointment: boolean;
  }>(dbPool, sql, [dogId, vetId]);
  if (error === CODE.DB_QUERY_FAILURE) {
    return Err(CODE.STORAGE_FAILURE);
  }
  if (result.rows.length !== 1) {
    return Err(CODE.STORAGE_FAILURE);
  }
  const { dogExists, vetExists, isPreferredVet, hasExistingAppointment } =
    result.rows[0];
  if (!dogExists) {
    return Err(CODE.ERROR_DOG_NOT_FOUND);
  }
  if (!vetExists) {
    return Err(CODE.ERROR_VET_NOT_FOUND);
  }
  if (!isPreferredVet) {
    return Err(CODE.ERROR_NOT_PREFERRED_VET);
  }
  return Ok({
    hasAppointment: hasExistingAppointment,
  });
}