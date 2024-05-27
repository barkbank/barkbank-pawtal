import { withDb } from "../_db_helpers";
import { Pool } from "pg";
import {
  getDogMapper,
  getTextEncryptionService,
  getUserMapper,
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
    const userMapper = getUserMapper();
    const dogMapper = getDogMapper();
    const textEncryptionService = getTextEncryptionService();
    const context: BarkContext = {
      dbPool,
      userMapper,
      dogMapper,
      textEncryptionService,
    };
    await testBody({ context, testContext: { dbPool }, dbContext: dbPool });
  });
}
