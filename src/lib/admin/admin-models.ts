import { DogGender, YesNoUnknown } from "../data/db-enums";

export type IncompleteProfile = {
  userId: string;
  dogId: string;
  dogName: string;
  dogGender: DogGender;
  dogBirthday: Date;
  dogBreed: string;
  dogWeightKg: number | null;
  dogEverPregnant: YesNoUnknown;
  dogEverReceivedTransfusion: YesNoUnknown;
};
