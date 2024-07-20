import { z } from "zod";

export const VetAccountSchema = z.object({
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

export type VetAccount = z.infer<typeof VetAccountSchema>;
export type VetClinic = z.infer<typeof VetClinicSchema>;
export type VetProfile = z.infer<typeof VetProfileSchema>;
