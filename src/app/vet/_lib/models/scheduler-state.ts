import { OwnerContactDetails } from "@/lib/bark/models/owner-contact-details";
import { SchedulerOutcome } from "./scheduler-outcome";
import { CallTask } from "@/lib/bark/models/call-task";

export type SchedulerState = {
  dogs: CallTask[];
  selectedDogId: string | null;
  ownerContactDetails: OwnerContactDetails | null;
  outcomes: Record<string, SchedulerOutcome>;
};
