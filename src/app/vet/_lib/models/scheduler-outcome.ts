import { CALL_OUTCOME } from "@/lib/bark/enums/call-outcome";

export type SchedulerOutcome =
  | typeof CALL_OUTCOME.APPOINTMENT
  | typeof CALL_OUTCOME.DECLINED;
