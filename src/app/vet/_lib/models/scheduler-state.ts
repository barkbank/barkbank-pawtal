import { AvailableDog, OwnerContactDetails } from "@/lib/vet/vet-models";
import { SchedulerOutcome } from "./scheduler-outcome";

export type SchedulerState = {
  dogs: AvailableDog[];
  selectedDogId: string | null;
  ownerContactDetails: OwnerContactDetails | null;
  outcomes: Record<string, SchedulerOutcome>;
};
