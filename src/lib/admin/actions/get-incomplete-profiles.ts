import { Err, Ok, Result } from "@/lib/utilities/result";
import { AdminActor } from "../admin-actor";
import { IncompleteProfile } from "../admin-models";

type ErrorCode = "ERROR_UNAUTHORIZED";

export async function getIncompleteProfiles(
  actor: AdminActor,
  params: {
    limit: number;
    offset: number;
  },
): Promise<Result<IncompleteProfile[], ErrorCode>> {
  const canManageDonors = await actor.canManageDonors();
  if (!canManageDonors) {
    return Err("ERROR_UNAUTHORIZED");
  }
  return Ok([]);
}
