import { z } from "zod";

export const SecureVetAccountSchema = z.object({
  vetId: z.string(),
  vetAccountId: z.string(),
  vetAccountHashedEmail: z.string(),
  vetAccountEncryptedName: z.string(),
  vetAccountEncryptedEmail: z.string(),
});

export const VetAccountSchema = z.object({
  vetId: z.string(),
  vetAccountId: z.string(),
  vetAccountEmail: z.string().email(),
  vetAccountName: z.string(),
});

export const VetClinicSchema = z.object({
  vetId: z.string(),
  vetEmail: z.string().email(),
  vetName: z.string(),
  vetPhoneNumber: z.string(),
  vetAddress: z.string(),
});

export const VetProfileSchema = z.object({
  clinic: VetClinicSchema,
  accounts: z.array(VetAccountSchema),
});

/**
 * It is like a profile, but with zero or one account.
 */
export const VetLoginSchema = z.object({
  clinic: VetClinicSchema,
  account: z.optional(VetAccountSchema),
});

export type SecureVetAccount = z.infer<typeof SecureVetAccountSchema>;
export type VetAccount = z.infer<typeof VetAccountSchema>;
export type VetClinic = z.infer<typeof VetClinicSchema>;
export type VetProfile = z.infer<typeof VetProfileSchema>;
export type VetLogin = z.infer<typeof VetLoginSchema>;
