import { AdminActor, AdminActorConfig } from "./admin-actor";
import { HashService } from "../services/hash";
import { Pool } from "pg";
import { EncryptionService } from "../services/encryption";
import {
  dbGrantCanManageAdminAccounts,
  dbInsertAdmin,
  dbSelectAdminIdByAdminHashedEmail,
} from "../data/db-admins";
import { NO_ADMIN_PERMISSIONS, AdminSpec } from "../data/db-models";
import { encryptAdminPii } from "./admin-pii";
import { AdminPii } from "../data/db-models";

export type AdminActorFactoryConfig = {
  dbPool: Pool;
  emailHashService: HashService;
  piiEncryptionService: EncryptionService;
  rootAdminEmail: string;
};

export class AdminActorFactory {
  private config: AdminActorFactoryConfig;

  constructor(config: AdminActorFactoryConfig) {
    this.config = config;
  }

  public async getAdminActor(adminEmail: string): Promise<AdminActor | null> {
    const { dbPool, emailHashService, piiEncryptionService, rootAdminEmail } =
      this.config;
    const adminHashedEmail = await emailHashService.getHashHex(adminEmail);
    const adminId = await dbSelectAdminIdByAdminHashedEmail(
      dbPool,
      adminHashedEmail,
    );
    const config: AdminActorConfig = {
      dbPool,
      emailHashService,
      piiEncryptionService,
    };
    if (adminId === null && adminEmail !== rootAdminEmail) {
      // Reject attempt to get admin actor
      return null;
    }
    if (adminId !== null && adminEmail !== rootAdminEmail) {
      // Return actor for the normal admin account
      return new AdminActor(adminId, config);
    }
    if (adminId !== null && adminEmail === rootAdminEmail) {
      // Ensure actor for the root admin account can manage admin accounts and return it.
      const actor = new AdminActor(adminId, config);
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
      const adminHashedEmail =
        await emailHashService.getHashHex(rootAdminEmail);
      const adminEncryptedPii = await encryptAdminPii(
        pii,
        piiEncryptionService,
      );
      const spec: AdminSpec = {
        adminHashedEmail,
        adminEncryptedPii,
        ...NO_ADMIN_PERMISSIONS,
        adminCanManageAdminAccounts: true,
      };
      const gen = await dbInsertAdmin(dbPool, spec);
      console.log("Created root admin account");
      return new AdminActor(gen.adminId, config);
    }
    throw new Error("BUG - Unhandled case");
  }
}
