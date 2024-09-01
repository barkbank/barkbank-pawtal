import { VetAccountService } from "../bark/services/vet-account-service";
import {
  VetAccount,
  VetAccountSpec,
  VetClinic,
  VetClinicSpec,
} from "../bark/models/vet-models";
import { UserAccountService } from "../bark/services/user-account-service";
import { RegistrationRequest } from "../bark/models/registration-models";
import { RegistrationService } from "../bark/services/registration-service";
import { AdminAccountService } from "../bark/services/admin-account-service";
import {
  AdminAccount,
  AdminAccountSpec,
  AdminIdentifier,
  AdminPermissions,
  AdminPermissionsSchema,
  NO_ADMIN_PERMISSIONS,
} from "../bark/models/admin-models";
import { Err, Result } from "../utilities/result";
import { CODE } from "../utilities/bark-code";
import { UserAccount } from "../bark/models/user-models";

export type AdminActorConfig = {
  adminAccountService: AdminAccountService;
  vetAccountService: VetAccountService;
  userAccountService: UserAccountService;
  registrationService: RegistrationService;
  rootAdminEmail: string;
};

/**
 * Responsible for data access control for a given admin.
 */
export class AdminActor {
  constructor(
    private adminId: string,
    private config: AdminActorConfig,
  ) {}

  getAdminId(): string {
    return this.adminId;
  }

  async getIsRoot() {
    const { result } = await this.getOwnAdminAccount();
    if (result === undefined) {
      return false;
    }
    const { adminEmail } = result;
    const { rootAdminEmail } = this.config;
    return adminEmail === rootAdminEmail;
  }

  // TODO: Cache the response
  async getOwnAdminAccount() {
    const { adminId } = this;
    return this.config.adminAccountService.getAdminAccountByAdminId({
      adminId,
    });
  }

  async getOwnPermissions(): Promise<AdminPermissions> {
    const { result, error } = await this.getOwnAdminAccount();
    if (error) {
      return NO_ADMIN_PERMISSIONS;
    }
    const permissions = AdminPermissionsSchema.parse(result);
    return permissions;
  }

  async getAllAdminAccounts(): Promise<
    Result<AdminAccount[], typeof CODE.FAILED | typeof CODE.ERROR_NOT_ALLOWED>
  > {
    const permissions = await this.getOwnPermissions();
    if (!permissions.adminCanManageAdminAccounts) {
      return Err(CODE.ERROR_NOT_ALLOWED);
    }
    return this.config.adminAccountService.getAllAdminAccounts();
  }

  async getAdminAccountByAdminId(args: {
    adminId: string;
  }): Promise<
    Result<
      AdminAccount,
      | typeof CODE.FAILED
      | typeof CODE.ERROR_ACCOUNT_NOT_FOUND
      | typeof CODE.ERROR_NOT_ALLOWED
    >
  > {
    const { adminId } = args;
    const permissions = await this.getOwnPermissions();
    if (!permissions.adminCanManageAdminAccounts) {
      return Err(CODE.ERROR_NOT_ALLOWED);
    }
    return this.config.adminAccountService.getAdminAccountByAdminId({
      adminId,
    });
  }

  async createAdminAccount(args: {
    spec: AdminAccountSpec;
  }): Promise<
    Result<AdminIdentifier, typeof CODE.FAILED | typeof CODE.ERROR_NOT_ALLOWED>
  > {
    const { spec } = args;
    const permissions = await this.getOwnPermissions();
    if (!permissions.adminCanManageAdminAccounts) {
      return Err(CODE.ERROR_NOT_ALLOWED);
    }
    return this.config.adminAccountService.createAdminAccount({ spec });
  }

  async updateAdminAccount(args: { adminId: string; spec: AdminAccountSpec }) {
    const { adminId, spec } = args;
    const permissions = await this.getOwnPermissions();
    if (!permissions.adminCanManageAdminAccounts) {
      return CODE.ERROR_NOT_ALLOWED;
    }
    return this.config.adminAccountService.updateAdminAccount({
      adminId,
      spec,
    });
  }

  async deleteAdminAccount(args: { adminId: string }) {
    const { adminId } = args;
    const permissions = await this.getOwnPermissions();
    if (!permissions.adminCanManageAdminAccounts) {
      return CODE.ERROR_NOT_ALLOWED;
    }
    return this.config.adminAccountService.deleteAdminAccount({ adminId });
  }

  async getVetClinics(): Promise<
    Result<
      { clinics: VetClinic[] },
      typeof CODE.FAILED | typeof CODE.ERROR_NOT_ALLOWED
    >
  > {
    const permissions = await this.getOwnPermissions();
    if (!permissions.adminCanManageVetAccounts) {
      return Err(CODE.ERROR_NOT_ALLOWED);
    }
    return this.config.vetAccountService.getVetClinics();
  }

  async getVetClinicByVetId(args: {
    vetId: string;
  }): Promise<
    Result<
      { clinic: VetClinic },
      | typeof CODE.FAILED
      | typeof CODE.ERROR_VET_NOT_FOUND
      | typeof CODE.ERROR_NOT_ALLOWED
    >
  > {
    const { vetId } = args;
    const permissions = await this.getOwnPermissions();
    if (!permissions.adminCanManageVetAccounts) {
      return Err(CODE.ERROR_NOT_ALLOWED);
    }
    return this.config.vetAccountService.getVetClinicByVetId({ vetId });
  }

  async getVetAccountsByVetId(args: {
    vetId: string;
  }): Promise<
    Result<
      { accounts: VetAccount[] },
      typeof CODE.FAILED | typeof CODE.ERROR_NOT_ALLOWED
    >
  > {
    const { vetId } = args;
    const permissions = await this.getOwnPermissions();
    if (!permissions.adminCanManageVetAccounts) {
      return Err(CODE.ERROR_NOT_ALLOWED);
    }
    return this.config.vetAccountService.getVetAccountsByVetId({ vetId });
  }

  async createVetClinic(args: {
    spec: VetClinicSpec;
  }): Promise<
    Result<
      { clinic: VetClinic },
      typeof CODE.FAILED | typeof CODE.ERROR_NOT_ALLOWED
    >
  > {
    const { spec } = args;
    const permissions = await this.getOwnPermissions();
    if (!permissions.adminCanManageVetAccounts) {
      return Err(CODE.ERROR_NOT_ALLOWED);
    }
    return this.config.vetAccountService.createVetClinic({ spec });
  }

  async addVetAccount(args: {
    spec: VetAccountSpec;
  }): Promise<
    Result<
      { account: VetAccount },
      typeof CODE.FAILED | typeof CODE.ERROR_NOT_ALLOWED
    >
  > {
    const { spec } = args;
    const permissions = await this.getOwnPermissions();
    if (!permissions.adminCanManageVetAccounts) {
      return Err(CODE.ERROR_NOT_ALLOWED);
    }
    return this.config.vetAccountService.addVetAccount({ spec });
  }

  async getAllUserAccounts(): Promise<
    Result<UserAccount[], typeof CODE.FAILED | typeof CODE.ERROR_NOT_ALLOWED>
  > {
    const permissions = await this.getOwnPermissions();
    if (!permissions.adminCanManageUserAccounts) {
      return Err(CODE.ERROR_NOT_ALLOWED);
    }
    return this.config.userAccountService.getAll();
  }

  async getUserAccountByUserId(args: {
    userId: string;
  }): Promise<
    Result<
      UserAccount,
      | typeof CODE.FAILED
      | typeof CODE.ERROR_USER_NOT_FOUND
      | typeof CODE.ERROR_NOT_ALLOWED
    >
  > {
    const { userId } = args;
    const permissions = await this.getOwnPermissions();
    if (!permissions.adminCanManageUserAccounts) {
      return Err(CODE.ERROR_NOT_ALLOWED);
    }
    return this.config.userAccountService.getByUserId({ userId });
  }

  async registerWebFlowUsers(args: {
    request: RegistrationRequest;
  }): Promise<
    | typeof CODE.OK
    | typeof CODE.ERROR_ACCOUNT_ALREADY_EXISTS
    | typeof CODE.FAILED
    | typeof CODE.ERROR_NOT_ALLOWED
  > {
    const { request } = args;
    const permissions = await this.getOwnPermissions();
    if (!permissions.adminCanManageUserAccounts) {
      return CODE.ERROR_NOT_ALLOWED;
    }
    return this.config.registrationService.addUserAndDog(request);
  }
}
