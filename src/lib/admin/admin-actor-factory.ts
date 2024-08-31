import { AdminActor, AdminActorConfig } from "./admin-actor";
import { HashService } from "../services/hash";
import { Pool } from "pg";
import {
  dbGrantCanManageAdminAccounts,
  dbInsertAdmin,
  dbSelectAdminIdByAdminHashedEmail,
} from "../data/db-admins";
import { NO_ADMIN_PERMISSIONS, AdminSpec } from "../data/db-models";
import { AdminPii } from "../data/db-models";
import { AdminMapper } from "../data/admin-mapper";
import { AdminAccountService } from "../bark/services/admin-account-service";
import { AdminAccountSpec } from "../bark/models/admin-models";

export type AdminActorFactoryConfig = {
  dbPool: Pool;
  emailHashService: HashService; // WIP: Remove
  adminMapper: AdminMapper; // WIP: Remove
  rootAdminEmail: string;
  adminAccountService: AdminAccountService;
  adminActorConfig: AdminActorConfig;
};

// WIP: Update this to use AdminAccountService
export class AdminActorFactory {
  constructor(private config: AdminActorFactoryConfig) {}

  public async getAdminActor(adminEmail: string): Promise<AdminActor | null> {
    const { dbPool, rootAdminEmail, adminAccountService, adminActorConfig } =
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
      // WIP: adminAccountService.grantPermissionToManageAdminAccounts
      const didGrant = await dbGrantCanManageAdminAccounts(
        dbPool,
        actor.getAdminId(),
      );
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
        adminCanManageDonors: true,
        adminCanManageUserAccounts: true,
        adminCanManageVetAccounts: true,
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
