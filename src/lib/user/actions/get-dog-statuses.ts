import { Err, Result } from "@/lib/utilities/result";
import { UserActor } from "../user-actor";
import { DogStatuses } from "../user-models";

type ErrorCode = "ERROR_UNAUTHORIZED"

export async function getDogStatuses(actor: UserActor, dogId: string): Promise<Result<DogStatuses, ErrorCode>> {
  return Err("ERROR_UNAUTHORIZED");
}
