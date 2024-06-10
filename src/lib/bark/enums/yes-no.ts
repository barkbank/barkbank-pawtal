import { ObjectValues } from "@/lib/utilities/object-values";
import { z } from "zod";

export const YES_NO_UNKNOWN = {
  YES: "YES",
  NO: "NO",
  UNKNOWN: "UNKNOWN",
} as const;

export const YesNoUnknownSchema = z.nativeEnum(YES_NO_UNKNOWN);

export type YesNoUnknown = z.infer<typeof YesNoUnknownSchema>;
