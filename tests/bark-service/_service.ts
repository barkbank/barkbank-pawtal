import { BarkService } from "@/lib/bark/bark-service";
import { PgBarkService } from "@/lib/pg-bark/pg-bark-service";
import { withDb } from "../_db_helpers";
import { Pool } from "pg";
import {
  getDogMapper,
  getTextEncryptionService,
  getUserMapper,
} from "../_fixtures";

export type ServiceTestContext = {
  dbPool: Pool;
};

export async function withService(
  testBody: (args: {
    service: BarkService;
    context: ServiceTestContext;
  }) => Promise<void>,
) {
  await withDb(async (dbPool) => {
    const userMapper = getUserMapper();
    const dogMapper = getDogMapper();
    const textEncryptionService = getTextEncryptionService();
    const service = new PgBarkService({
      dbPool,
      userMapper,
      dogMapper,
      textEncryptionService,
    });
    await testBody({ service, context: { dbPool } });
  });
}
