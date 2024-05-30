import { Err, Ok, Result } from "@/lib/utilities/result";
import { BarkContext } from "../bark-context";
import { CODE } from "@/lib/utilities/bark-code";
import { BarkAppointment } from "../bark-models";
import { selectAppointmentsByVetId } from "../queries/select-appointments-by-vet-id";
import { toUserPii } from "../mappers/to-user-pii";
import { toDogOii } from "../mappers/to-dog-oii";

export async function opFetchAppointmentsByVetId(
  context: BarkContext,
  args: { vetId: string },
): Promise<Result<{ appointments: BarkAppointment[] }, typeof CODE.FAILED>> {
  const { dbPool } = context;
  const { vetId } = args;
  try {
    const encryptedAppointments = await selectAppointmentsByVetId(dbPool, {
      vetId,
    });
    const promisedAppointments = encryptedAppointments.map(
      async (encrypted) => {
        const { userEncryptedPii, dogEncryptedOii, ...otherFields } = encrypted;
        const { userName } = await toUserPii(context, userEncryptedPii);
        const { dogName } = await toDogOii(context, dogEncryptedOii);
        return { ...otherFields, ownerName: userName, dogName };
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
