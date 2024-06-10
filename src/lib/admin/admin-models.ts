import { YesNoUnknown } from "../bark/enums/yes-no-unknown";
import { DogGender } from "../bark/models/dog-gender";

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
