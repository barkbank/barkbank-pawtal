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

  public toAdminPii(source: AdminPii): AdminPii {
    const { adminEmail, adminName, adminPhoneNumber } = source;
    return { adminEmail, adminName, adminPhoneNumber };
  }

  public toAdminSecurePii(source: AdminSecurePii): AdminSecurePii {
    const { adminHashedEmail, adminEncryptedPii } = source;
    return { adminHashedEmail, adminEncryptedPii };
  }

  public toAdminPermissions(source: AdminPermissions): AdminPermissions {
    const {
      adminCanManageAdminAccounts,
      adminCanManageVetAccounts,
      adminCanManageUserAccounts,
      adminCanManageDonors,
    } = source;
    return {
      adminCanManageAdminAccounts,
      adminCanManageVetAccounts,
      adminCanManageUserAccounts,
      adminCanManageDonors,
    };
  }

  public toAdminSpec(source: AdminSpec): AdminSpec {
    const securePii = this.toAdminSecurePii(source);
    const permissions = this.toAdminPermissions(source);
    return { ...securePii, ...permissions };
  }

  public toAdminGen(source: AdminGen): AdminGen {
    const { adminId, adminCreationTime, adminModificationTime } = source;
    return { adminId, adminCreationTime, adminModificationTime };
  }

  public async mapAdminRecordToAdmin(record: AdminRecord): Promise<Admin> {
    const adminSecurePii = this.toAdminSecurePii(record);
    const adminPermissions = this.toAdminPermissions(record);
    const adminGen = this.toAdminGen(record);
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
    return this.toAdminPii(adminPii);
  }

  // TODO: Try to remove this.
  public async mapAdminPiiToAdminSecurePii(
    adminPii: AdminPii,
  ): Promise<AdminSecurePii> {
    const pii = this.toAdminPii(adminPii);
    const jsonEncoded = JSON.stringify(pii);
    const [adminHashedEmail, adminEncryptedPii] = await Promise.all([
      this.emailHashService.getHashHex(adminPii.adminEmail),
      this.piiEncryptionService.getEncryptedData(jsonEncoded),
    ]);
    return { adminHashedEmail, adminEncryptedPii };
  }
}
