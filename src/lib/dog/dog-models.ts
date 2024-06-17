import { YesNoUnknown } from "../bark/enums/yes-no-unknown";

/**
 * The subset of MyDogProfile that can be modified after the first medical
 * report.
 */
export type SubProfile = {
  dogName: string;
  dogWeightKg: number | null;
  dogEverPregnant: YesNoUnknown;
  dogEverReceivedTransfusion: YesNoUnknown;
  dogPreferredVetId: string;
};

/**
 * An appointment
 */
export type DogAppointment = {
  dogId: string;
  callId: string;
  vetId: string;
  vetName: string;
};

export type DogPreferredVet = {
  dogId: string;
  vetId: string;
  vetEmail: string;
  vetName: string;
  vetPhoneNumber: string;
  vetAddress: string;
};
