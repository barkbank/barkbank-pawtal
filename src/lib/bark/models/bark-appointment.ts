import { DOG_GENDER } from "./dog-gender";
import { z } from "zod";

export const BarkAppointmentSchema = z.object({
  appointmentId: z.string(),
  vetId: z.string(),
  dogId: z.string(),
  dogName: z.string(),
  dogBreed: z.string(),
});

export type BarkAppointment = {
  appointmentId: string;
  vetId: string;
  dogId: string;
  dogName: string;
  dogBreed: string;
  dogGender: typeof DOG_GENDER.MALE | typeof DOG_GENDER.FEMALE;
  ownerName: string;
};
