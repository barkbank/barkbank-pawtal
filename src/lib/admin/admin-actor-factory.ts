import { AdminActor, AdminActorConfig } from "./admin-actor";
import { HashService } from "../services/hash";
import { Pool } from "pg";
import { EncryptionService } from "../services/encryption";
import { dbSelectAdminIdByAdminHashedEmail } from "../data/db-admins";

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
    const { dbPool, emailHashService, piiEncryptionService } = this.config;
    const adminHashedEmail = await emailHashService.getHashHex(adminEmail);
    const adminId = await dbSelectAdminIdByAdminHashedEmail(
      dbPool,
      adminHashedEmail,
    );
    if (adminId === null) {
      // TODO: Should ensure an admin account with root email exists.
      return null;
    }
    const config: AdminActorConfig = {
      dbPool,
      emailHashService,
      piiEncryptionService,
    };
    return new AdminActor(adminId, config);
  }
}
