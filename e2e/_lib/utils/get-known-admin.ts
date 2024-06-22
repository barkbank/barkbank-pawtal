import { KnownAdmin, KnownAdminSchema } from "../models/known-admin";

export function getKnownAdmin(): KnownAdmin {
  const res: KnownAdmin = {
    adminEmail: "admin1@admin.com",
    adminName: "Oliver Jones",
    adminPhoneNumber: "+6580000001",
  };
  return KnownAdminSchema.parse(res);
}
