import { Err, Ok, Result } from "@/lib/utilities/result";
import { BarkContext } from "../bark-context";
import { DogAppointment } from "../models/dog-appointment";
import { CODE } from "@/lib/utilities/bark-code";
import { dbRelease } from "@/lib/data/db-utils";
import { selectOwnerByDogId } from "../queries/select-owner-by-dog-id";
import { selectDogAppointmentsByDogId } from "../queries/select-dog-appointments-by-dog-id";

export async function opFetchDogAppointmentsByDogId(
  context: BarkContext,
  args: { dogId: string; actorUserId?: string },
): Promise<
  Result<
    { appointments: DogAppointment[] },
    | typeof CODE.FAILED
    | typeof CODE.ERROR_DOG_NOT_FOUND
    | typeof CODE.ERROR_WRONG_OWNER
  >
> {
  const { dbPool } = context;
  const { dogId, actorUserId } = args;
  const conn = await dbPool.connect();
  try {
    const ownerInfo = await selectOwnerByDogId(conn, { dogId });
    if (ownerInfo === null) {
      return Err(CODE.ERROR_DOG_NOT_FOUND);
    }
    if (actorUserId !== undefined && ownerInfo.ownerUserId !== actorUserId) {
      return Err(CODE.ERROR_WRONG_OWNER);
    }
    const appointments: DogAppointment[] = await selectDogAppointmentsByDogId(
      conn,
      { dogId },
    );
    return Ok({ appointments });
  } catch (err) {
    console.error(err);
    return Err(CODE.FAILED);
  } finally {
    await dbRelease(conn);
  }
}
