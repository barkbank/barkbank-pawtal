import { Err, Result } from "@/lib/utilities/result";
import { BarkContext } from "../bark-context";
import { BarkAppointment } from "../bark-models";
import { CODE } from "@/lib/utilities/bark-code";

export async function opFetchAppointment(
  context: BarkContext,
  args: { appointmentId: string },
): Promise<
  Result<
    BarkAppointment,
    typeof CODE.FAILED | typeof CODE.ERROR_APPOINTMENT_NOT_FOUND
  >
> {
  return Err(CODE.ERROR_APPOINTMENT_NOT_FOUND);
}
