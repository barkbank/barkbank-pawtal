import { AdminActor, AdminActorConfig } from "./admin-actor";
import { Pool } from "pg";
import { AdminAccountService } from "../bark/services/admin-account-service";
import { AdminAccountSpec } from "../bark/models/admin-models";

export type AdminActorFactoryConfig = {
  rootAdminEmail: string;
  adminAccountService: AdminAccountService;
  adminActorConfig: AdminActorConfig;
};

export class AdminActorFactory {
  constructor(private config: AdminActorFactoryConfig) {}

  public async getAdminActor(adminEmail: string): Promise<AdminActor | null> {
    const { rootAdminEmail, adminAccountService, adminActorConfig } =
      this.config;

    const resLookup = await adminAccountService.getAdminIdByAdminEmail({
      adminEmail,
    });
    const adminId = resLookup.result?.adminId ?? null;

    if (adminId === null && adminEmail !== rootAdminEmail) {
      // Reject attempt to get admin actor
      return null;
    }

    if (adminId !== null && adminEmail !== rootAdminEmail) {
      // Return actor for the normal admin account
      return new AdminActor(adminId, adminActorConfig);
    }

    if (adminId !== null && adminEmail === rootAdminEmail) {
      // Ensure actor for the root admin account can manage admin accounts and return it.
      const actor = new AdminActor(adminId, adminActorConfig);
      const didGrant =
        await adminAccountService.grantPermissionsToManageAdminAccounts({
          adminId,
        });
      if (didGrant) {
        console.log(
          "Granted to root admin account the permission to manage admin accounts",
        );
      }
      return actor;
    }

    if (adminId === null && adminEmail === rootAdminEmail) {
      // Create root admin account
      const spec: AdminAccountSpec = {
        adminEmail: rootAdminEmail,
        adminName: "Root",
        adminPhoneNumber: "",
        adminCanManageAdminAccounts: true,
        adminCanManageDonors: false,
        adminCanManageUserAccounts: false,
        adminCanManageVetAccounts: false,
      };
      const resCreate = await adminAccountService.createAdminAccount({ spec });
      if (resCreate.error !== undefined) {
        console.error(resCreate.error);
        return null;
      }
      console.log("Created root admin account");
      return new AdminActor(resCreate.result.adminId, adminActorConfig);
    }

    throw new Error("BUG - Unhandled case");
  }
}
