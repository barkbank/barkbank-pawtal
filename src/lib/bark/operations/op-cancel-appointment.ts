import { CODE } from "@/lib/utilities/bark-code";
import { BarkContext } from "../bark-context";

export async function opCancelAppointment(
  context: BarkContext,
  args: { appointmentId: string; actorVetId: string },
): Promise<
  | typeof CODE.OK
  | typeof CODE.ERROR_APPOINTMENT_NOT_FOUND
  | typeof CODE.ERROR_NOT_ALLOWED
> {
  return CODE.OK;
}
