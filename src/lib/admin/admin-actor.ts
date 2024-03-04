import { Pool } from "pg";
import { Admin } from "../data/db-models";
import { HashService } from "../services/hash";
import { EncryptionService } from "../services/encryption";
import { dbSelectAdmin } from "../data/db-admins";
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
  private adminId: string;
  private config: AdminActorConfig;

  constructor(adminId: string, config: AdminActorConfig) {
    this.adminId = adminId;
    this.config = config;
  }

  public getAdminId(): string {
    return this.adminId;
  }

  private getDbPool(): Pool {
    return this.config.dbPool;
  }

  private getPiiEncryptionService(): EncryptionService {
    return this.config.piiEncryptionService;
  }

  public async getOwnAdmin(): Promise<Admin | null> {
    return dbSelectAdmin(this.getDbPool(), this.getAdminId());
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

  public async canManageAdminAccounts(): Promise<boolean> {
    return false;
  }

  public async canManageVetAccounts(): Promise<boolean> {
    return false;
  }

  public async canManageUserAccounts(): Promise<boolean> {
    return false;
  }

  public async canManageDonors(): Promise<boolean> {
    return false;
  }
}
