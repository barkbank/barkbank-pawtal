import { Err, Ok, Result } from "@/lib/utilities/result";
import { BarkContext } from "../bark-context";
import { BarkAppointment } from "../models/bark-appointment";
import { CODE } from "@/lib/utilities/bark-code";
import { selectAppointment } from "../queries/select-appointment";
import { toBarkAppointment } from "../mappers/to-bark-appointment";

export async function opFetchAppointment(
  context: BarkContext,
  args: { appointmentId: string },
): Promise<
  Result<
    { appointment: BarkAppointment },
    typeof CODE.FAILED | typeof CODE.ERROR_APPOINTMENT_NOT_FOUND
  >
> {
  const { dbPool } = context;
  const { appointmentId } = args;
  const encrypted = await selectAppointment(dbPool, { appointmentId });
  if (encrypted === null) {
    return Err(CODE.ERROR_APPOINTMENT_NOT_FOUND);
  }
  const appointment = await toBarkAppointment(context, encrypted);
  return Ok({ appointment });
}
