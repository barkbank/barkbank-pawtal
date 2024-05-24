import { Err, Result } from "@/lib/utilities/result";
import { CODE } from "@/lib/utilities/bark-code";
import { PgBarkServiceConfig } from "../pg-bark-service";
import { dbBegin, dbRelease } from "@/lib/data/db-utils";
import { checkPreferredVet } from "../_checks/check-preferred-vet";

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
  const conn = await config.dbPool.connect();
  const { dogId, vetId } = args;
  try {
    await dbBegin(conn);
    const chk1 = await checkPreferredVet({ conn, dogId, vetId });
    if (chk1 !== CODE.OK) {
      return Err(chk1);
    }
  } finally {
    await dbRelease(conn);
  }
  return Err(CODE.ERROR_DOG_NOT_FOUND);
}
