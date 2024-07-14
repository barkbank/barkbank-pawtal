import { z } from "zod";

export const VetLoginClinicSchema = z.object({
  vetId: z.string(),
  vetEmail: z.string().email(),
  vetName: z.string(),
});

export const VetLoginAccountSchema = z.object({
  vetAccountId: z.string(),
  vetAccountEmail: z.string().email(),
  vetAccountName: z.string(),
});

export const VetLoginSchema = z.object({
  clinic: VetLoginClinicSchema,
  account: z.optional(VetLoginAccountSchema),
});

export type VetLoginClinic = z.infer<typeof VetLoginClinicSchema>;
export type VetLoginAccount = z.infer<typeof VetLoginAccountSchema>;
export type VetLogin = z.infer<typeof VetLoginSchema>;
