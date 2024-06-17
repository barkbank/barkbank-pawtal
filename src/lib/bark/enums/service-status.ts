import { z } from "zod";

export const SERVICE_STATUS = {
  AVAILABLE: "AVAILABLE",
  UNAVAILABLE: "UNAVAILABLE",
} as const;

export const ServiceStatusSchema = z.nativeEnum(SERVICE_STATUS);

export type ServiceStatus = z.infer<typeof ServiceStatusSchema>;
