import { ObjectValues } from "@/lib/utilities/object-values";

export const YES_NO_UNKNOWN = {
  YES: "YES",
  NO: "NO",
  UNKNOWN: "UNKNOWN",
} as const;

export type YesNoUnknown = ObjectValues<typeof YES_NO_UNKNOWN>;
