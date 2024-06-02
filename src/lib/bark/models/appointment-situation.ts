import { z } from "zod";

/**
 * Appointment Situation describes the situation between a given dog and vet. It
 * is used to determine if an appointment can be scheduled.
 */
export const AppointmentSituationSchema = z.object({
  dogExists: z.boolean(),
  vetExists: z.boolean(),
  isPreferredVet: z.boolean(),
  hasExistingAppointment: z.boolean(),
});

export type AppointmentSituation = z.infer<typeof AppointmentSituationSchema>;
