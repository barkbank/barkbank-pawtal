import { z } from "zod";

export const USER_RESIDENCY = {
  OTHER: "OTHER",
  SINGAPORE: "SINGAPORE",
} as const;

export const UserResidencySchema = z.nativeEnum(USER_RESIDENCY);

export type UserResidency = z.infer<typeof UserResidencySchema>;
