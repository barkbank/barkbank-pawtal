import { z } from "zod";

export const VetAccountIdSchema = z.object({ vetAccountId: z.string() });

export const SecureVetAccountSpecSchema = z.object({
  vetId: z.string(),
  vetAccountHashedEmail: z.string(),
  vetAccountEncryptedName: z.string(),
  vetAccountEncryptedEmail: z.string(),
});

export const SecureVetAccountSchema = VetAccountIdSchema.merge(
  SecureVetAccountSpecSchema,
);

export const VetAccountSpecSchema = z.object({
  vetId: z.string(),
  vetAccountEmail: z.string().email(),
  vetAccountName: z.string(),
});

export const VetAccountSchema = VetAccountIdSchema.merge(VetAccountSpecSchema);

export const VetIdSchema = z.object({ vetId: z.string() });
export const VetClinicSpecSchema = z.object({
  vetEmail: z.string().email(),
  vetName: z.string(),
  vetPhoneNumber: z.string(),
  vetAddress: z.string(),
});
export const VetClinicSchema = VetIdSchema.merge(VetClinicSpecSchema);

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
export type SecureVetAccountSpec = z.infer<typeof SecureVetAccountSpecSchema>;
export type VetAccount = z.infer<typeof VetAccountSchema>;
export type VetAccountSpec = z.infer<typeof VetAccountSpecSchema>;
export type VetClinicSpec = z.infer<typeof VetClinicSpecSchema>;
export type VetClinic = z.infer<typeof VetClinicSchema>;
export type VetProfile = z.infer<typeof VetProfileSchema>;
export type VetLogin = z.infer<typeof VetLoginSchema>;
