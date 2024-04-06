import { Ok, Result } from "@/lib/utilities/result";
import { AdminActor } from "../admin-actor";
import { IncompleteProfile } from "../admin-models";

type Errors = "ERROR_UNAUTHORIZED";

export async function getIncompleteProfiles(
  actor: AdminActor,
  params: {
    limit: number;
    offset: number;
  },
): Promise<Result<IncompleteProfile[], Errors>> {
  return Ok([]);
}
