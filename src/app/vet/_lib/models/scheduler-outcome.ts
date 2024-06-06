import { CALL_OUTCOME } from "@/lib/data/db-enums";

export type SchedulerOutcome =
  | typeof CALL_OUTCOME.APPOINTMENT
  | typeof CALL_OUTCOME.DECLINED;
