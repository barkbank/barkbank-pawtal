import { YesNoUnknown } from "../data/db-enums";
import { DogGender } from "../bark/models/dog-gender";

export type AvailableDog = {
  dogId: string;
  dogName: string;
  dogBreed: string;
  dogBirthday: Date;
  dogGender: DogGender;
  dogWeightKg: number | null;
  dogEverReceivedTransfusion: YesNoUnknown;
  dogEverPregnant: YesNoUnknown;
};
