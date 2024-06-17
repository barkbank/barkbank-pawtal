import { z } from "zod";
import { AppointmentStatusSchema } from "../enums/appointment-status";

export const BarkAppointmentMetadataSchema = z.object({
  appointmentId: z.string(),
  appointmentStatus: AppointmentStatusSchema,
  vetId: z.string(),
  dogId: z.string(),
});

export type BarkAppointmentMetadata = z.infer<
  typeof BarkAppointmentMetadataSchema
>;
