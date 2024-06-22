import { DbContext, dbQuery } from "@/lib/data/db-utils";
import {
  DogReportCount,
  DogReportCountSchema,
} from "../models/dog-report-count";

export async function selectDogReportCount(
  dbContext: DbContext,
  args: { dogId: string },
): Promise<DogReportCount> {
  const { dogId } = args;
  const sql = `
  SELECT CAST(COUNT(*) AS INTEGER) as "numReports"
  FROM reports
  WHERE dog_id = $1
  `;
  const res = await dbQuery<DogReportCount>(dbContext, sql, [dogId]);
  console.debug(res.rows[0]);
  return DogReportCountSchema.parse(res.rows[0]);
}
