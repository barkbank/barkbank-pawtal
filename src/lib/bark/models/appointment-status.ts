import { z } from "zod";

export const APPOINTMENT_STATUS = {
  PENDING: "PENDING",
  REPORTED: "REPORTED",
  CANCELLED: "CANCELLED",
} as const;

export const AppointmentStatusSchema = z.nativeEnum(APPOINTMENT_STATUS);

export type AppointmentStatus = z.infer<typeof AppointmentStatusSchema>;
