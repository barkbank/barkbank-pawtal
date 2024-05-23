import { BarkService } from "@/lib/bark/bark-service";
import { PgBarkService } from "@/lib/pg-bark/pg-bark-service";
import { withDb } from "../_db_helpers";

export async function withService(
  testBody: (args: { service: BarkService }) => Promise<void>,
) {
  await withDb(async (dbPool) => {
    const service = new PgBarkService({ dbPool });
    await testBody({ service });
  });
}
