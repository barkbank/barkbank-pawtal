import { AppointmentStatusSchema } from "./appointment-status";
import { SpecifiedDogGenderSchema } from "./dog-gender";
import { z } from "zod";

export const EncryptedBarkAppointmentSchema = z.object({
  appointmentId: z.string(),
  appointmentStatus: AppointmentStatusSchema,
  vetId: z.string(),
  dogId: z.string(),
  dogEncryptedOii: z.string(),
  dogBreed: z.string(),
  dogGender: SpecifiedDogGenderSchema,
  userEncryptedPii: z.string(),
});

export type EncryptedBarkAppointment = z.infer<
  typeof EncryptedBarkAppointmentSchema
>;
