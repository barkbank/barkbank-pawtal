import { BarkAppointmentSchema } from "./bark-appointment";
import { z } from "zod";

export const EncryptedBarkAppointmentSchema = BarkAppointmentSchema.omit({
  dogName: true,
  ownerName: true,
}).extend({
  dogEncryptedOii: z.string(),
  userEncryptedPii: z.string(),
});

export type EncryptedBarkAppointment = z.infer<
  typeof EncryptedBarkAppointmentSchema
>;
