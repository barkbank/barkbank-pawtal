import { DogGender, YesNoUnknown } from "../data/db-enums";

/**
 * Dog that is available for scheduling.
 */
type AvailableDog = {
  userId: string;
  dogId: string;
  dogName: string;
  dogBreed: string;
  dogBirthday: Date;
  dogGender: DogGender;
  dogWeightKg: number | null;
  dogEverReceivedTransfusion: YesNoUnknown;
  dogEverPregnant: YesNoUnknown;
};
