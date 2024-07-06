import { z } from "zod";

export const BARKBANK_ENV = {
  TEST: "TEST",
  DEV: "DEV",
  PRD: "PRD",
} as const;

export const BarkBankEnvSchema = z.nativeEnum(BARKBANK_ENV);

export type BarkBankEnv = z.infer<typeof BarkBankEnvSchema>;
