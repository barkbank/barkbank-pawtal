import { ObjectValues } from "../utilities/object-values";

export const USER_RESIDENCY = {
  OTHER: "OTHER",
  SINGAPORE: "SINGAPORE",
} as const;

export type UserResidency = ObjectValues<typeof USER_RESIDENCY>;

export const DOG_ANTIGEN_PRESENCE = {
  POSITIVE: "POSITIVE",
  NEGATIVE: "NEGATIVE",
  UNKNOWN: "UNKNOWN",
} as const;

export type DogAntigenPresence = ObjectValues<typeof DOG_ANTIGEN_PRESENCE>;
