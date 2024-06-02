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

export type OwnerContactDetails = {
  dogId: string;
  userName: string;
  userEmail: string;
  userPhoneNumber: string;

  /**
   * The last time the vet contacted the user.
   */
  vetUserLastContactedTime: Date | null;
};
