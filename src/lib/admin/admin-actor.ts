import { Pool } from "pg";
import {
  AdminPermissions,
  AdminRecord,
  NO_ADMIN_PERMISSIONS,
} from "../data/db-models";
import { HashService } from "../services/hash";
import { dbSelectAdmin } from "../data/db-admins";
import { AdminPii } from "../data/db-models";
import { DogMapper } from "../data/dog-mapper";
import { UserMapper } from "../data/user-mapper";
import { AdminMapper } from "../data/admin-mapper";
import { VetAccountService } from "../bark/services/vet-account-service";

export type AdminActorConfig = {
  dbPool: Pool;
  emailHashService: HashService;
  adminMapper: AdminMapper;
  userMapper: UserMapper;
  dogMapper: DogMapper;
  vetAccountService: VetAccountService;
};

/**
 * Responsible for data access control for a given admin.
 */
export class AdminActor {
  private promisedAdminRecord: Promise<AdminRecord | null> | null = null;

  constructor(
    private adminId: string,
    private config: AdminActorConfig,
  ) {}

  async getVetClinics() {
    return this.config.vetAccountService.getVetClinics();
  }

  async getVetAccountsByVetId(args: { vetId: string }) {
    const { vetId } = args;
    return this.config.vetAccountService.getVetAccountsByVetId({ vetId });
  }

  public getParams(): {
    adminId: string;
    dbPool: Pool;
    emailHashService: HashService;
    adminMapper: AdminMapper;
    userMapper: UserMapper;
    dogMapper: DogMapper;
  } {
    return { adminId: this.adminId, ...this.config };
  }

  // TODO: Do we still need permissions?
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

  public getOwnAdminRecord(): Promise<AdminRecord | null> {
    // Caches own admin. It is safe to do this because a new AdminActor is
    // created on every server request as part of session validation; starting
    // from getAuthenticatedAdminActor to new AdminActor in AdminActorFactory.
    const { dbPool, adminId } = this.getParams();
    if (this.promisedAdminRecord === null) {
      this.promisedAdminRecord = dbSelectAdmin(dbPool, adminId);
    }
    return this.promisedAdminRecord;
  }

  public async getOwnPii(): Promise<AdminPii | null> {
    const admin = await this.getOwnAdminRecord();
    if (admin === null) {
      return null;
    }
    const { adminMapper } = this.getParams();
    const securePii = adminMapper.toAdminSecurePii(admin);
    const adminPii = await adminMapper.mapAdminSecurePiiToAdminPii(securePii);
    return adminPii;
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
