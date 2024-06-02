import { BarkAppointmentMetadataSchema } from "./bark-appointment-metadata";
import { SpecifiedDogGenderSchema } from "./dog-gender";
import { z } from "zod";

export const BarkAppointmentSchema = BarkAppointmentMetadataSchema.extend({
  dogName: z.string(),
  dogBreed: z.string(),
  dogGender: SpecifiedDogGenderSchema,
  ownerName: z.string(),
});

export type BarkAppointment = z.infer<typeof BarkAppointmentSchema>;
