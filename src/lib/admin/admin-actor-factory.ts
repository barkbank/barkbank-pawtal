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

export type AdminActorFactoryConfig = {
  dbPool: Pool;
  emailHashService: HashService;
  adminMapper: AdminMapper;
  rootAdminEmail: string;
  adminAccountService: AdminAccountService;
  adminActorConfig: AdminActorConfig;
};

// WIP: Update this to use AdminAccountService
export class AdminActorFactory {
  constructor(private config: AdminActorFactoryConfig) {}

  public async getAdminActor(adminEmail: string): Promise<AdminActor | null> {
    const {
      dbPool,
      emailHashService,
      adminMapper,
      rootAdminEmail,
      adminActorConfig,
    } = this.config;
    const adminHashedEmail = await emailHashService.getHashHex(adminEmail);
    const adminId = await this.getAdminIdByHashedEmail(adminHashedEmail);
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
      const pii: AdminPii = {
        adminEmail: rootAdminEmail,
        adminName: "Root",
        adminPhoneNumber: "",
      };
      const securePii = await adminMapper.mapAdminPiiToAdminSecurePii(pii);
      const spec: AdminSpec = {
        ...securePii,
        ...NO_ADMIN_PERMISSIONS,
        adminCanManageAdminAccounts: true,
      };
      const gen = await dbInsertAdmin(dbPool, spec);
      console.log("Created root admin account");
      return new AdminActor(gen.adminId, adminActorConfig);
    }
    throw new Error("BUG - Unhandled case");
  }

  private async getAdminIdByHashedEmail(
    adminHashedEmail: string,
  ): Promise<string | null> {
    const { dbPool } = this.config;
    const adminId = await dbSelectAdminIdByAdminHashedEmail(
      dbPool,
      adminHashedEmail,
    );
    if (adminId === null) {
      return null;
    }
    return adminId;
  }
}
