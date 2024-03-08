import { DogAntigenPresence, DogGender, YesNoUnknown } from "../data/db-models";

/**
 * Models the details about dogs that we collect from the registration form.
 */
export type DogRegistration = {
  dogName: string;

  dogBreed: string;
  dogBirthday: string;
  dogGender: DogGender;
  dogWeightKg: number | null;
  dogDea1Point1: DogAntigenPresence;
  dogEverPregnant: YesNoUnknown;
  dogEverReceivedTransfusion: YesNoUnknown;
  dogPreferredVetIdList: string[];
};

/**
 * Models the details about ths user that we collect from the registration form.
 */
export type UserRegistration = {
  userName: string;
  userEmail: string;
  userPhoneNumber: string;
};

/**
 * Models the details about the user and their dogs that we collect from the
 * registration form.
 */
export type Registration = {
  user: UserRegistration;
  dogList: DogRegistration[];
};
