import { z } from "zod";

export const YES_NO = {
  YES: "YES",
  NO: "NO",
} as const;

export const YesNoSchema = z.nativeEnum(YES_NO);

export type YesNo = z.infer<typeof YesNoSchema>;
