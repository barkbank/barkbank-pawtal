import { DogGender, YesNoUnknown } from "../data/db-enums";

export type AvailableDog = {
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
