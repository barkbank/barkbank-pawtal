import { z } from "zod";

// WIP: Remove VetLoginClinicSchema
export const VetLoginClinicSchema = z.object({
  vetId: z.string(),
  vetEmail: z.string().email(),
  vetName: z.string(),
});

// WIP: Remove VetLoginAccountSchema
export const VetLoginAccountSchema = z.object({
  vetAccountId: z.string(),
  vetAccountEmail: z.string().email(),
  vetAccountName: z.string(),
});

// WIP: Remove VetLoginClinic
export type VetLoginClinic = z.infer<typeof VetLoginClinicSchema>;

// WIP: Remove VetLoginAccount
export type VetLoginAccount = z.infer<typeof VetLoginAccountSchema>;
