import { CALL_OUTCOME } from "@/lib/data/db-enums";
import { AvailableDog, OwnerContactDetails } from "@/lib/vet/vet-models";

export type SchedulerState = {
  dogs: AvailableDog[];
  selectedDogId: string | null;
  ownerContactDetails: OwnerContactDetails | null;
  outcomes: Record<string, SchedulerOutcome>;
};

export type SchedulerOutcome =
  | typeof CALL_OUTCOME.APPOINTMENT
  | typeof CALL_OUTCOME.DECLINED;
