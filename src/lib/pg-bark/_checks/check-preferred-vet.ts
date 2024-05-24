import { dbResultQuery } from "@/lib/data/db-utils";
import { CODE } from "@/lib/utilities/bark-code";
import { PoolClient } from "pg";
import { loadSql } from "../_sql/load-sql";

export async function checkPreferredVet(args: {
  conn: PoolClient;
  dogId: string;
  vetId: string;
}): Promise<
  | typeof CODE.OK
  | typeof CODE.ERROR_DOG_NOT_FOUND
  | typeof CODE.ERROR_VET_NOT_FOUND
  | typeof CODE.ERROR_NOT_PREFERRED_VET
  | typeof CODE.STORAGE_FAILURE
> {
  const { conn, dogId, vetId } = args;
  const sql = loadSql("check-preferred-vet");
  const { result, error } = await dbResultQuery<{
    dogExists: boolean;
    vetExists: boolean;
    isPreferredVet: boolean;
  }>(conn, sql, [dogId, vetId]);
  if (error === CODE.DB_QUERY_FAILURE) {
    return CODE.STORAGE_FAILURE;
  }
  if (result.rows.length !== 1) {
    return CODE.STORAGE_FAILURE;
  }
  const { dogExists, vetExists, isPreferredVet } = result.rows[0];
  if (!dogExists) {
    return CODE.ERROR_DOG_NOT_FOUND;
  }
  if (!vetExists) {
    return CODE.ERROR_VET_NOT_FOUND;
  }
  if (!isPreferredVet) {
    return CODE.ERROR_NOT_PREFERRED_VET;
  }
  return CODE.OK;
}
