import { DogGender, YesNoUnknown } from "../data/db-enums";

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
}
