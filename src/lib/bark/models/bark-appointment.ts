import { BarkAppointmentMetadataSchema } from "./bark-appointment-metadata";
import { DogGenderSchema } from "../enums/dog-gender";
import { z } from "zod";

export const BarkAppointmentSchema = BarkAppointmentMetadataSchema.extend({
  dogName: z.string(),
  dogBreed: z.string(),
  dogGender: DogGenderSchema,
  ownerName: z.string(),
});

export type BarkAppointment = z.infer<typeof BarkAppointmentSchema>;
