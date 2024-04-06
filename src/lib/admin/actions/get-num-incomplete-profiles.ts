import { Err, Result } from "@/lib/utilities/result";
import { AdminActor } from "../admin-actor";

type ErrorCode = "ERROR_UNAUTHORIZED";

/**
 * @returns Number of participating dog profiles that are incomplete.
 */
export async function getNumIncompleteProfiles(
  actor: AdminActor,
): Promise<Result<number, ErrorCode>> {
  return Err("ERROR_UNAUTHORIZED");
}
