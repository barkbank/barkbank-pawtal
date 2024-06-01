import { DbContext } from "@/lib/data/db-utils";
import { EncryptedBarkAppointment } from "../bark-models";

export async function selectAppointment(
  dbContext: DbContext,
  args: { appointmentId: string },
): Promise<EncryptedBarkAppointment | null> {
  return null;
}
