import { Err, Ok, Result } from "@/lib/utilities/result";
import { BarkContext } from "../bark-context";
import { DogAppointment } from "../models/dog-appointment";
import { CODE } from "@/lib/utilities/bark-code";

export async function opFetchDogAppointmentsByDogId(
  context: BarkContext,
  args: { dogId: string; actorUserId?: string },
): Promise<Result<{ appointments: DogAppointment[] }, typeof CODE.FAILED>> {
  try {
    const appointments: DogAppointment[] = [];
    return Ok({ appointments });
  } catch (err) {
    console.error(err);
    return Err(CODE.FAILED);
  }
}
