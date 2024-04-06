import { Pool } from "pg";
import {
  AdminPermissions,
  AdminRecord,
  NO_ADMIN_PERMISSIONS,
} from "../data/db-models";
import { HashService } from "../services/hash";
import { EncryptionService } from "../services/encryption";
import { dbSelectAdmin } from "../data/db-admins";
import { decryptAdminPii } from "./admin-pii";
import { AdminPii } from "../data/db-models";
import { DogMapper } from "../data/dog-mapper";
import { UserMapper } from "../data/user-mapper";

export type AdminActorConfig = {
  dbPool: Pool;
  emailHashService: HashService;
  piiEncryptionService: EncryptionService;
  userMapper: UserMapper;
  dogMapper: DogMapper;
};

/**
 * Responsible for data access control for a given admin.
 */
export class AdminActor {
  private adminId: string;
  private config: AdminActorConfig;
  private promisedAdminRecord: Promise<AdminRecord | null> | null = null;

  constructor(adminId: string, config: AdminActorConfig) {
    this.adminId = adminId;
    this.config = config;
  }

  public getParams(): {
    adminId: string;
    dbPool: Pool;
    emailHashService: HashService;
    piiEncryptionService: EncryptionService;
    userMapper: UserMapper;
    dogMapper: DogMapper;
  } {
    return { adminId: this.adminId, ...this.config };
  }

  public async getPermissions(): Promise<AdminPermissions> {
    const record = await this.getOwnAdminRecord();
    if (record === null) {
      return NO_ADMIN_PERMISSIONS;
    }
    const {
      adminCanManageAdminAccounts,
      adminCanManageVetAccounts,
      adminCanManageUserAccounts,
      adminCanManageDonors,
    } = record;
    const permissions: AdminPermissions = {
      adminCanManageAdminAccounts,
      adminCanManageVetAccounts,
      adminCanManageUserAccounts,
      adminCanManageDonors,
    };
    return permissions;
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

  public getOwnAdminRecord(): Promise<AdminRecord | null> {
    // Caches own admin. It is safe to do this because a new AdminActor is
    // created on every server request as part of session validation; starting
    // from getAuthenticatedAdminActor to new AdminActor in AdminActorFactory.
    if (this.promisedAdminRecord === null) {
      this.promisedAdminRecord = dbSelectAdmin(
        this.getDbPool(),
        this.getAdminId(),
      );
    }
    return this.promisedAdminRecord;
  }

  public async getOwnPii(): Promise<AdminPii | null> {
    const admin = await this.getOwnAdminRecord();
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
    const admin = await this.getOwnAdminRecord();
    return admin ? admin.adminCanManageAdminAccounts : false;
  }

  public async canManageVetAccounts(): Promise<boolean> {
    const admin = await this.getOwnAdminRecord();
    return admin ? admin.adminCanManageVetAccounts : false;
  }

  public async canManageUserAccounts(): Promise<boolean> {
    const admin = await this.getOwnAdminRecord();
    return admin ? admin.adminCanManageUserAccounts : false;
  }

  public async canManageDonors(): Promise<boolean> {
    const admin = await this.getOwnAdminRecord();
    return admin ? admin.adminCanManageDonors : false;
  }
}
