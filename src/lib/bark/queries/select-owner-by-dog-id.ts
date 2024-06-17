import { DbContext, dbQuery } from "@/lib/data/db-utils";
import { OwnerInfo, OwnerInfoSchema } from "../models/owner-info";

export async function selectOwnerByDogId(
  dbContext: DbContext,
  args: { dogId: string },
): Promise<OwnerInfo | null> {
  const { dogId } = args;
  const sql = `
  SELECT
    user_id as "ownerUserId"
  FROM dogs
  WHERE dog_id = $1
  `;
  const res = await dbQuery<OwnerInfo>(dbContext, sql, [dogId]);
  if (res.rows.length === 0) {
    return null;
  }
  return OwnerInfoSchema.parse(res.rows[0]);
}
