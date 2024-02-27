import { AdminActor, AdminActorConfig } from "./admin-actor";
import { AdminSpec } from "../data/models";
import APP from "../app";
import { HashService } from "../services/hash";
import { Pool } from "pg";
import { EncryptionService } from "../services/encryption";
import { dbBegin, dbCommit, dbRollbackAndRelease } from "../data/dbUtils";
import {
  dbInsertAdmin,
  dbSelectAdminByAdminHashedEmail,
} from "../data/dbAdmins";
import { AdminPii, encryptAdminPii } from "./admin-pii";

const MOCK_ADMIN_ACCOUNTS: AdminPii[] = [
  {
    adminName: "Samantha Jones",
    adminEmail: "admin1@admin.com",
    adminPhoneNumber: "+65 3123 4567",
  },
  {
    adminName: "Li Hui (李慧)",
    adminEmail: "admin2@admin.com",
    adminPhoneNumber: "+65 3234 5678",
  },
];

async function insertMockAdminAccounts(): Promise<void> {
  const emailHashService = await APP.getEmailHashService();
  const piiEncryptionService = await APP.getPiiEncryptionService();

  const specs: AdminSpec[] = [];
  for (const item of MOCK_ADMIN_ACCOUNTS) {
    const adminHashedEmail = await emailHashService.getHashHex(item.adminEmail);
    const adminEncryptedPii = await encryptAdminPii(item, piiEncryptionService);
    specs.push({ adminHashedEmail, adminEncryptedPii });
  }
  const dbPool = await APP.getDbPool();
  const conn = await dbPool.connect();
  try {
    await dbBegin(conn);
    specs.forEach(async (spec) => {
      const existingAdmin = await dbSelectAdminByAdminHashedEmail(
        conn,
        spec.adminHashedEmail,
      );
      if (existingAdmin !== null) {
        console.warn("MOCK ADMIN EXISTS:", spec);
      } else {
        const newAdminGen = await dbInsertAdmin(conn, spec);
        console.warn("MOCK ADMIN CREATED:", spec, newAdminGen);
      }
    });
    await dbCommit(conn);
  } finally {
    await dbRollbackAndRelease(conn);
  }
}

export type AdminActorFactoryConfig = {
  dbPool: Pool;
  emailHashService: HashService;
  piiEncryptionService: EncryptionService;
};

export class AdminActorFactory {
  private config: AdminActorFactoryConfig;

  constructor(config: AdminActorFactoryConfig) {
    this.config = config;
  }

  public async getAdminActor(adminEmail: string): Promise<AdminActor | null> {
    // TODO: Remove this when we have a way to create admin accounts.
    await insertMockAdminAccounts();

    const { dbPool, emailHashService, piiEncryptionService } = this.config;
    const adminHashedEmail = await emailHashService.getHashHex(adminEmail);
    const admin = await dbSelectAdminByAdminHashedEmail(
      dbPool,
      adminHashedEmail,
    );
    if (admin === null) {
      // TODO: Should ensure an admin account with root email exists.
      return null;
    }
    const config: AdminActorConfig = {
      dbPool,
      emailHashService,
      piiEncryptionService,
    };
    return new AdminActor(admin, config);
  }
}
