import { z } from "zod";

export const DOG_STATUS = {
  INCOMPLETE: "INCOMPLETE",
  ELIGIBLE: "ELIGIBLE",
  INELIGIBLE: "INELIGIBLE",
  PERMANENTLY_INELIGIBLE: "PERMANENTLY_INELIGIBLE",
} as const;

export const DogStatusSchema = z.nativeEnum(DOG_STATUS);

export type DogStatus = z.infer<typeof DogStatusSchema>;
