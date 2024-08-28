import { z } from "zod";

export const AdminAccountSchema = z.object({
  adminId: z.string(),
  adminEmail: z.string().email(),
  adminName: z.string(),
  adminPhoneNumber: z.string(),
  adminCanManageAdminAccounts: z.boolean(),
  adminCanManageVetAccounts: z.boolean(),
  adminCanManageUserAccounts: z.boolean(),
  adminCanManageDonors: z.boolean(),
});

export const AdminPiiSchema = z.object({
  adminEmail: z.string().email(),
  adminName: z.string(),
  adminPhoneNumber: z.string(),
});

export const EncryptedAdminAccountSchema = z.object({
  adminId: z.string(),
  adminHashedEmail: z.string().email(),
  adminEncryptedPii: z.string(),
  adminCanManageAdminAccounts: z.boolean(),
  adminCanManageVetAccounts: z.boolean(),
  adminCanManageUserAccounts: z.boolean(),
  adminCanManageDonors: z.boolean(),
});

export type AdminAccount = z.infer<typeof AdminAccountSchema>;
export type AdminPii = z.infer<typeof AdminPiiSchema>;
export type EncryptedAdminAccount = z.infer<typeof EncryptedAdminAccountSchema>;
