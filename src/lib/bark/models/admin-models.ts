import { z } from "zod";

export const AdminPiiSchema = z.object({
  adminEmail: z.string().email(),
  adminName: z.string(),
  adminPhoneNumber: z.string(),
});

export const AdminPermissionsSchema = z.object({
  adminCanManageAdminAccounts: z.boolean(),
  adminCanManageVetAccounts: z.boolean(),
  adminCanManageUserAccounts: z.boolean(),
  adminCanManageDonors: z.boolean(),
});

export function getEmptyAdminPermissionsRecord(): Record<string, boolean> {
  return Object.keys(AdminPermissionsSchema.shape).reduce(
    (acc, key) => {
      acc[key] = false;
      return acc;
    },
    {} as Record<string, boolean>,
  );
}

/**
 * An object of AdminPermissionsSchema type where all permissions are false.
 */
export const NO_ADMIN_PERMISSIONS = AdminPermissionsSchema.parse(
  getEmptyAdminPermissionsRecord(),
);

export const AdminAccountSchema = z
  .object({
    adminId: z.string(),
  })
  .merge(AdminPiiSchema)
  .merge(AdminPermissionsSchema);

export const EncryptedAdminAccountSchema = z
  .object({
    adminId: z.string(),
    adminHashedEmail: z.string(),
    adminEncryptedPii: z.string(),
  })
  .merge(AdminPermissionsSchema);

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
export type AdminPermissions = z.infer<typeof AdminPermissionsSchema>;
