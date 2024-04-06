import { Err, Ok, Result } from "@/lib/utilities/result";
import { AdminActor } from "../admin-actor";
import { dbQuery } from "@/lib/data/db-utils";

type ErrorCode = "ERROR_UNAUTHORIZED";

/**
 * @returns Number of participating dog profiles that are incomplete.
 */
export async function getNumIncompleteProfiles(
  actor: AdminActor,
): Promise<Result<number, ErrorCode>> {
  const { adminCanManageDonors } = await actor.getPermissions();
  if (!adminCanManageDonors) {
    return Err("ERROR_UNAUTHORIZED");
  }
  const { dbPool } = actor.getParams();
  const sql = `
  SELECT COUNT(1)::integer as "numProfiles"
  FROM dog_statuses
  WHERE profile_status = 'INCOMPLETE'
  AND participation_status = 'PARTICIPATING'
  `;
  const res = await dbQuery(dbPool, sql, []);
  const { numProfiles } = res.rows[0];
  return Ok(numProfiles);
}
