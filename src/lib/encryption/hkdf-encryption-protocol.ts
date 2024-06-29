import { z } from "zod";
import { Result } from "../utilities/result";
import { EncryptionProtocol } from "./encryption-protocol";

export const HkdfInputKeyMaterialSchema = z.object({
  ikmId: z.string().min(1).max(8),
  ikmHex: z.string(),
});

export type HkdfInputKeyMaterial = z.infer<typeof HkdfInputKeyMaterialSchema>;

export const HkdfConfigSchema = z.object({
  ikms: z.array(HkdfInputKeyMaterialSchema),
  purpose: z.string(),
});

export type HkdfConfig = z.infer<typeof HkdfConfigSchema>;

export class HkdfEncryptionProtocol implements EncryptionProtocol {
  constructor(private config: HkdfConfig) {}

  async encrypt(data: string): Promise<Result<{ encrypted: string }, string>> {
    throw new Error("Method not implemented.");
  }

  async decrypt(encrypted: string): Promise<Result<{ data: string }, string>> {
    throw new Error("Method not implemented.");
  }

  isProtocolFor(encrypted: string): boolean {
    throw new Error("Method not implemented.");
  }
}
