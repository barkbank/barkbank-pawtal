import { withDb } from "../_db_helpers";
import { Pool } from "pg";
import {
  getEmailHashService,
  getOiiEncryptionService,
  getPiiEncryptionService,
  getTextEncryptionService,
} from "../_fixtures";
import { BarkContext } from "@/lib/bark/bark-context";
import { DbContext } from "@/lib/data/db-utils";

export type BarkTestContext = { dbPool: Pool };

export async function withBarkContext(
  testBody: (args: {
    context: BarkContext;
    testContext: BarkTestContext;
    dbContext: DbContext;
  }) => Promise<void>,
) {
  await withDb(async (dbPool) => {
    const emailHashService = getEmailHashService();
    const piiEncryptionService = getPiiEncryptionService();
    const oiiEncrypteionService = getOiiEncryptionService();
    const textEncryptionService = getTextEncryptionService();
    const context: BarkContext = {
      dbPool,
      emailHashService,
      piiEncryptionService,
      oiiEncrypteionService,
      textEncryptionService,
    };
    await testBody({ context, testContext: { dbPool }, dbContext: dbPool });
  });
}
