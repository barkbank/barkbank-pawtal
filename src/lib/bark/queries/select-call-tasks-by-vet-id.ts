import { DbContext } from "@/lib/data/db-utils";
import { EncryptedCallTask } from "../models/encrypted-call-task";

export async function selectCallTasksByVetId(
  dbContext: DbContext,
  args: { vetId: string },
): Promise<EncryptedCallTask[]> {
  // WIP: write the sql query
  return [];
}
