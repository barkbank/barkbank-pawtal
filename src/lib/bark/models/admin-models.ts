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
  adminHashedEmail: z.string(),
  adminEncryptedPii: z.string(),
  adminCanManageAdminAccounts: z.boolean(),
  adminCanManageVetAccounts: z.boolean(),
  adminCanManageUserAccounts: z.boolean(),
  adminCanManageDonors: z.boolean(),
});

export const EncryptedAdminAccountSpecSchema = EncryptedAdminAccountSchema.omit(
  { adminId: true },
);

export const AdminAccountSpecSchema = AdminAccountSchema.omit({
  adminId: true,
});

export const AdminIdentifierSchema = z.object({
  adminId: z.string(),
});

export type AdminAccount = z.infer<typeof AdminAccountSchema>;
export type AdminPii = z.infer<typeof AdminPiiSchema>;
export type EncryptedAdminAccount = z.infer<typeof EncryptedAdminAccountSchema>;
export type EncryptedAdminAccountSpec = z.infer<
  typeof EncryptedAdminAccountSpecSchema
>;
export type AdminAccountSpec = z.infer<typeof AdminAccountSpecSchema>;
export type AdminIdentifier = z.infer<typeof AdminIdentifierSchema>;
