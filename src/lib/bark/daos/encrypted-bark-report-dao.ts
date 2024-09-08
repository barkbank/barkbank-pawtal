import { DbContext, dbQuery } from "@/lib/data/db-utils";
import { z } from "zod";

export class EncryptedBarkReportDao {
  constructor(private db: DbContext) {}

  async getReportCountByDog(args: {
    dogId: string;
  }): Promise<{ reportCount: number }> {
    const RowSchema = z.object({ reportCount: z.number() });
    const { dogId } = args;
    const sql = `
    SELECT COUNT(1)::integer as "reportCount"
    FROM reports
    WHERE dog_id = $1
    `;
    const res = await dbQuery<typeof RowSchema>(this.db, sql, [dogId]);
    return RowSchema.parse(res.rows[0]);
  }
}
