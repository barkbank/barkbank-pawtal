import { DOG_GENDER } from "@/lib/data/db-enums";
import { z } from "zod";

export const EncryptedBarkAppointmentSchema = z.object({
  appointmentId: z.string(),
  vetId: z.string(),
  dogId: z.string(),
  dogEncryptedOii: z.string(),
  dogBreed: z.string(),
  dogGender: z.enum([DOG_GENDER.MALE, DOG_GENDER.FEMALE]),
  userEncryptedPii: z.string(),
});

export type EncryptedBarkAppointment = z.infer<
  typeof EncryptedBarkAppointmentSchema
>;
