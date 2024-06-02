import { SpecifiedDogGenderSchema } from "./dog-gender";
import { z } from "zod";

export const BarkAppointmentSchema = z.object({
  appointmentId: z.string(),
  vetId: z.string(),
  dogId: z.string(),
  dogName: z.string(),
  dogBreed: z.string(),
  dogGender: SpecifiedDogGenderSchema,
  ownerName: z.string(),
});

export type BarkAppointment = z.infer<typeof BarkAppointmentSchema>;
