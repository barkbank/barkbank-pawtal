import { z } from "zod";

export const BarkAppointmentIdsSchema = z.object({
  appointmentId: z.string(),
  vetId: z.string(),
  dogId: z.string(),
});

export type BarkAppointmentIds = z.infer<typeof BarkAppointmentIdsSchema>;
