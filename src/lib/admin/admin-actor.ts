import { Pool } from "pg";
import { Admin } from "../data/models";
import { HashService } from "../services/hash";
import { EncryptionService } from "../services/encryption";
import { dbSelectAdmin } from "../data/dbAdmins";
import { AdminPii, decryptAdminPii } from "./admin-pii";

export type AdminActorConfig = {
  dbPool: Pool;
  emailHashService: HashService;
  piiEncryptionService: EncryptionService;
};

/**
 * Responsible for data access control for a given admin.
 */
export class AdminActor {
  private admin: Admin;
  private config: AdminActorConfig;

  constructor(admin: Admin, config: AdminActorConfig) {
    this.admin = admin;
    this.config = config;
  }

  public getAdminId(): string {
    return this.admin.adminId;
  }

  private getDbPool(): Pool {
    return this.config.dbPool;
  }

  private getPiiEncryptionService(): EncryptionService {
    return this.config.piiEncryptionService;
  }

  public async getOwnAdmin(): Promise<Admin | null> {
    const admin = await dbSelectAdmin(this.getDbPool(), this.getAdminId());
    if (admin === null) {
      return null;
    }
    return admin;
  }

  public async getOwnPii(): Promise<AdminPii | null> {
    const admin = await this.getOwnAdmin();
    if (admin === null) {
      return null;
    }
    const pii = await decryptAdminPii(
      admin.adminEncryptedPii,
      this.getPiiEncryptionService(),
    );
    return pii;
  }
}
