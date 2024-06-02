import { DbContext } from "@/lib/data/db-utils";
import { EncryptedBarkReport } from "../models/encrypted-bark-report";

export async function selectReportsByVetId(
  dbContext: DbContext,
  args: { vetId: string },
): Promise<EncryptedBarkReport[]> {
  return [];
}
