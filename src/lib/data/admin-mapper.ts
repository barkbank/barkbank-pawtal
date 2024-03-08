import { EncryptionService } from "../services/encryption";
import { HashService } from "../services/hash";
import {
  Admin,
  AdminGen,
  AdminPermissions,
  AdminPii,
  AdminRecord,
  AdminSecurePii,
  AdminSpec,
} from "./db-models";

export class AdminMapper {
  private emailHashService: HashService;
  private piiEncryptionService: EncryptionService;

  constructor(config: {
    emailHashService: HashService;
    piiEncryptionService: EncryptionService;
  }) {
    this.emailHashService = config.emailHashService;
    this.piiEncryptionService = config.piiEncryptionService;
  }

  public mapAdminRecordToAdminSpec(record: AdminRecord): AdminSpec {
    const { adminId, adminCreationTime, adminModificationTime, ...spec } =
      record;
    return spec;
  }

  public mapAdminRecordToAdminSecurePii(record: AdminRecord): AdminSecurePii {
    const { adminHashedEmail, adminEncryptedPii } = record;
    return { adminHashedEmail, adminEncryptedPii };
  }

  public mapAdminRecordToAdminPermissions(
    record: AdminRecord,
  ): AdminPermissions {
    const {
      adminCanManageAdminAccounts,
      adminCanManageVetAccounts,
      adminCanManageUserAccounts,
      adminCanManageDonors,
    } = record;
    return {
      adminCanManageAdminAccounts,
      adminCanManageVetAccounts,
      adminCanManageUserAccounts,
      adminCanManageDonors,
    };
  }

  public mapAdminRecordToAdminGen(record: AdminRecord): AdminGen {
    const { adminId, adminCreationTime, adminModificationTime } = record;
    return { adminId, adminCreationTime, adminModificationTime };
  }

  public async mapAdminRecordToAdmin(record: AdminRecord): Promise<Admin> {
    const adminSecurePii = this.mapAdminRecordToAdminSecurePii(record);
    const adminPermissions = this.mapAdminRecordToAdminPermissions(record);
    const adminGen = this.mapAdminRecordToAdminGen(record);
    const adminPii = await this.mapAdminSecurePiiToAdminPii(adminSecurePii);
    return { ...adminPii, ...adminPermissions, ...adminGen };
  }

  public async mapAdminSecurePiiToAdminPii(
    securePii: AdminSecurePii,
  ): Promise<AdminPii> {
    const jsonEncoded = await this.piiEncryptionService.getDecryptedData(
      securePii.adminEncryptedPii,
    );
    const adminPii = JSON.parse(jsonEncoded) as AdminPii;
    return adminPii;
  }

  public async mapAdminPiiToAdminSecurePii(
    adminPii: AdminPii,
  ): Promise<AdminSecurePii> {
    const jsonEncoded = JSON.stringify(adminPii);
    const [adminHashedEmail, adminEncryptedPii] = await Promise.all([
      this.emailHashService.getHashHex(adminPii.adminEmail),
      this.piiEncryptionService.getEncryptedData(jsonEncoded),
    ]);
    return { adminHashedEmail, adminEncryptedPii };
  }
}
