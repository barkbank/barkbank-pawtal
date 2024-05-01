import { Ok, Result } from "@/lib/utilities/result";
import { UserActor } from "../user-actor";
import { DogAppointment } from "@/lib/dog/dog-models";
import { CODE } from "@/lib/utilities/bark-code";

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
  return Ok([]);
}
