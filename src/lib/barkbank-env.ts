import { z } from "zod";

export const BARKBANK_ENV = {
  DEVELOPMENT: "development",
  TEST: "test",
  PRODUCTION: "production",
} as const;

export const BarkBankEnvSchema = z.nativeEnum(BARKBANK_ENV);

export type BarkBankEnv = z.infer<typeof BarkBankEnvSchema>;
