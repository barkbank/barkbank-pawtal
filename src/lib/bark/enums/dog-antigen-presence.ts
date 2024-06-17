import { z } from "zod";

export const DOG_ANTIGEN_PRESENCE = {
  POSITIVE: "POSITIVE",
  NEGATIVE: "NEGATIVE",
  UNKNOWN: "UNKNOWN",
} as const;

export const DogAntigenPresenceSchema = z.nativeEnum(DOG_ANTIGEN_PRESENCE);

export type DogAntigenPresence = z.infer<typeof DogAntigenPresenceSchema>;
