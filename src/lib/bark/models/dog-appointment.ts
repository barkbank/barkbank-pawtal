import { z } from "zod";

export const DogAppointmentSchema = z.object({
  appointmentId: z.string(),
  dogId: z.string(),
  vetId: z.string(),
  vetName: z.string(),
});

export type DogAppointment = z.infer<typeof DogAppointmentSchema>;
