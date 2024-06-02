import { z } from "zod";
import { AppointmentStatusSchema } from "./appointment-status";

export const BarkAppointmentIdsSchema = z.object({
  appointmentId: z.string(),
  appointmentStatus: AppointmentStatusSchema,
  vetId: z.string(),
  dogId: z.string(),
});

export type BarkAppointmentIds = z.infer<typeof BarkAppointmentIdsSchema>;
