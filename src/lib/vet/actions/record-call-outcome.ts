import { CODE } from "@/lib/utilities/bark-code";
import { VetActor } from "../vet-actor";
import { CALL_OUTCOME } from "@/lib/bark/enums/call-outcome";
import { Err, Ok, Result } from "@/lib/utilities/result";
import { dbBegin, dbCommit, dbRelease, dbRollback } from "@/lib/data/db-utils";
import { CallDao } from "@/lib/bark/daos/call-dao";
import { CallSpec } from "@/lib/bark/models/call-models";
import { VetPreferenceDao } from "@/lib/bark/daos/vet-preference-dao";

// STEP: Move recordCallOutcome into VetService
export async function recordCallOutcome(
  actor: VetActor,
  args: {
    dogId: string;
    callOutcome: typeof CALL_OUTCOME.APPOINTMENT | typeof CALL_OUTCOME.DECLINED;
  },
): Promise<
  Result<
    { callId: string },
    typeof CODE.ERROR_NOT_PREFERRED_VET | typeof CODE.FAILED
  >
> {
  const { dogId, callOutcome } = args;
  const { dbPool, vetId } = actor.getParams();
  const conn = await dbPool.connect();
  try {
    await dbBegin(conn);
    const prefDao = new VetPreferenceDao(conn);
    const pref = await prefDao.getByDogAndVet({ dogId, vetId });
    if (pref === null) {
      return Err(CODE.ERROR_NOT_PREFERRED_VET);
    }
    const callDao = new CallDao(conn);
    const spec: CallSpec = { dogId, vetId, callOutcome };
    const { callId } = await callDao.insert({ spec });
    await dbCommit(conn);
    return Ok({ callId });
  } catch (err) {
    await dbRollback(conn);
    console.error(err);
    return Err(CODE.FAILED);
  } finally {
    await dbRelease(conn);
  }
}
