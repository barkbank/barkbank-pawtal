import { Err, Result } from "@/lib/utilities/result";
import { CODE } from "@/lib/utilities/bark-code";
import { PgBarkServiceConfig } from "../pg-bark-service";

export async function addAppointment(
  config: PgBarkServiceConfig,
  args: {
    dogId: string;
    vetId: string;
  },
): Promise<
  Result<
    { appointmentId: string },
    | typeof CODE.ERROR_DOG_NOT_FOUND
    | typeof CODE.ERROR_VET_NOT_FOUND
    | typeof CODE.ERROR_NOT_PREFERRED_VET
    | typeof CODE.ERROR_APPOINTMENT_ALREADY_EXISTS
    | typeof CODE.STORAGE_FAILURE
  >
> {
  return Err(CODE.ERROR_DOG_NOT_FOUND);
}
