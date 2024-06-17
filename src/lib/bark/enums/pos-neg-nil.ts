import { z } from "zod";

export const POS_NEG_NIL = {
  POSITIVE: "POSITIVE",
  NEGATIVE: "NEGATIVE",
  NIL: "NIL",
} as const;

export const PosNegNilSchema = z.nativeEnum(POS_NEG_NIL);

export type PosNegNil = z.infer<typeof PosNegNilSchema>;
