import { DogGender, YesNoUnknown } from "../data/db-enums";

export type IncompleteProfile = {
  userId: string;
  dogId: string;
  dogName: string;
  dogGender: DogGender;
  dogBreed: string;
  dogWeightKg: number | null;
  dogEverPregnant: YesNoUnknown;
  dogEverReceivedTransfusion: YesNoUnknown;
};
