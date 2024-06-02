import { DOG_GENDER } from "@/lib/data/db-enums";

export type BarkAppointment = {
  appointmentId: string;
  vetId: string;
  dogId: string;
  dogName: string;
  dogBreed: string;
  dogGender: typeof DOG_GENDER.MALE | typeof DOG_GENDER.FEMALE;
  ownerName: string;
};
