import { Err, Ok, Result } from "@/lib/utilities/result";
import { CODE } from "@/lib/utilities/bark-code";
import { BarkContext } from "@/lib/bark/bark-context";
import { selectAppointmentSituation } from "../queries/select-appointment-situation";

export async function BarkAction_hasAppointment(
  context: BarkContext,
  args: {
    dogId: string;
    vetId: string;
  },
): Promise<
  Result<
    { hasAppointment: boolean },
    | typeof CODE.ERROR_DOG_NOT_FOUND
    | typeof CODE.ERROR_VET_NOT_FOUND
    | typeof CODE.ERROR_NOT_PREFERRED_VET
    | typeof CODE.STORAGE_FAILURE
  >
> {
  const { dbPool } = context;
  const { dogId, vetId } = args;
  const situation = await selectAppointmentSituation(dbPool, { dogId, vetId });
  if (!situation.dogExists) {
    return Err(CODE.ERROR_DOG_NOT_FOUND);
  }
  if (!situation.vetExists) {
    return Err(CODE.ERROR_VET_NOT_FOUND);
  }
  if (!situation.isPreferredVet) {
    return Err(CODE.ERROR_NOT_PREFERRED_VET);
  }
  const hasAppointment = situation.hasExistingAppointment;
  return Ok({ hasAppointment });
}
