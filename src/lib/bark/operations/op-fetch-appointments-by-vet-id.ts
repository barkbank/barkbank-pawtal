import { Err, Ok, Result } from "@/lib/utilities/result";
import { BarkContext } from "../bark-context";
import { CODE } from "@/lib/utilities/bark-code";
import { BarkAppointment } from "../bark-models";

export async function opFetchAppointmentsByVetId(
  context: BarkContext,
  args: { vetId: string },
): Promise<Result<{ appointments: BarkAppointment[] }, typeof CODE.FAILED>> {
  return Ok({ appointments: [] });
}
