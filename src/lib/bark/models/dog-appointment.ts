import { z } from "zod";

export const DogAppointmentSchema = z.object({
  dogId: z.string(),
  callId: z.string(),
  vetId: z.string(),
  vetName: z.string(),
});

export type DogAppointment = z.infer<typeof DogAppointmentSchema>;
