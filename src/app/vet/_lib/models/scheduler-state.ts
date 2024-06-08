import { AvailableDog } from "@/lib/vet/vet-models";
import { OwnerContactDetails } from "@/lib/bark/models/owner-contact-details";
import { SchedulerOutcome } from "./scheduler-outcome";

export type SchedulerState = {
  dogs: AvailableDog[];
  selectedDogId: string | null;
  ownerContactDetails: OwnerContactDetails | null;
  outcomes: Record<string, SchedulerOutcome>;
};
