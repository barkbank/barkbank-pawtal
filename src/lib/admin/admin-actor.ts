import { Pool } from "pg";
import { HashService } from "../services/hash";
import { DogMapper } from "../data/dog-mapper";
import { UserMapper } from "../data/user-mapper";
import { AdminMapper } from "../data/admin-mapper";
import { VetAccountService } from "../bark/services/vet-account-service";
import { VetAccountSpec, VetClinicSpec } from "../bark/models/vet-models";
import { UserAccountService } from "../bark/services/user-account-service";
import { RegistrationRequest } from "../bark/models/registration-models";
import { RegistrationService } from "../bark/services/registration-service";
import { AdminAccountService } from "../bark/services/admin-account-service";
import { AdminAccountSpec } from "../bark/models/admin-models";

export type AdminActorConfig = {
  dbPool: Pool;
  emailHashService: HashService;
  adminMapper: AdminMapper;
  userMapper: UserMapper;
  dogMapper: DogMapper;
  adminAccountService: AdminAccountService;
  vetAccountService: VetAccountService;
  userAccountService: UserAccountService;
  registrationService: RegistrationService;
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

  async getOwnAdminAccount() {
    const { adminId } = this;
    return this.config.adminAccountService.getAdminAccountByAdminId({
      adminId,
    });
  }

  async getAllAdminAccounts() {
    return this.config.adminAccountService.getAllAdminAccounts();
  }

  async getAdminAccountByAdminId(args: { adminId: string }) {
    const { adminId } = args;
    return this.config.adminAccountService.getAdminAccountByAdminId({
      adminId,
    });
  }

  async createAdminAccount(args: { spec: AdminAccountSpec }) {
    const { spec } = args;
    return this.config.adminAccountService.createAdminAccount({ spec });
  }

  async getVetClinics() {
    return this.config.vetAccountService.getVetClinics();
  }

  async getVetAccountsByVetId(args: { vetId: string }) {
    const { vetId } = args;
    return this.config.vetAccountService.getVetAccountsByVetId({ vetId });
  }

  async createVetClinic(args: { spec: VetClinicSpec }) {
    const { spec } = args;
    return this.config.vetAccountService.createVetClinic({ spec });
  }

  async addVetAccount(args: { spec: VetAccountSpec }) {
    const { spec } = args;
    return this.config.vetAccountService.addVetAccount({ spec });
  }

  async getAllUserAccounts() {
    return this.config.userAccountService.getAll();
  }

  async getUserAccountByUserId(args: { userId: string }) {
    const { userId } = args;
    return this.config.userAccountService.getByUserId({ userId });
  }

  async registerWebFlowUsers(args: { request: RegistrationRequest }) {
    const { request } = args;
    return this.config.registrationService.addUserAndDog(request);
  }
}
