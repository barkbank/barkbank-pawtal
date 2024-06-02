import { Err, Ok, Result } from "@/lib/utilities/result";
import { BarkContext } from "../bark-context";
import { CODE } from "@/lib/utilities/bark-code";
import { BarkAppointment } from "../models/bark-appointment";
import { selectPendingAppointmentsByVetId } from "../queries/select-pending-appointments-by-vet-id";
import { toBarkAppointment } from "../mappers/to-bark-appointment";

export async function opFetchPendingAppointmentsByVetId(
  context: BarkContext,
  args: { vetId: string },
): Promise<Result<{ appointments: BarkAppointment[] }, typeof CODE.FAILED>> {
  const { dbPool } = context;
  const { vetId } = args;
  try {
    const encryptedAppointments = await selectPendingAppointmentsByVetId(
      dbPool,
      {
        vetId,
      },
    );
    const promisedAppointments = encryptedAppointments.map(
      async (encrypted) => {
        return toBarkAppointment(context, encrypted);
      },
    );
    const appointments: BarkAppointment[] =
      await Promise.all(promisedAppointments);
    return Ok({ appointments });
  } catch (err) {
    console.error(err);
    return Err(CODE.FAILED);
  }
}
