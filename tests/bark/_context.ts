import { withDb } from "../_db_helpers";
import {
  getEmailHashService,
  getOiiEncryptionService,
  getPiiEncryptionService,
  getTextEncryptionService,
} from "../_fixtures";
import { BarkContext } from "@/lib/bark/bark-context";
import { DbContext } from "@/lib/data/db-utils";

// TODO: Remove BarkTestContext, for now I have made it the same as BarkContext.
export type BarkTestContext = BarkContext;

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
    const oiiEncryptionService = getOiiEncryptionService();
    const textEncryptionService = getTextEncryptionService();
    const context: BarkContext = {
      dbPool,
      emailHashService,
      piiEncryptionService,
      oiiEncryptionService,
      textEncryptionService,
    };
    await testBody({ context, testContext: context, dbContext: dbPool });
  });
}
