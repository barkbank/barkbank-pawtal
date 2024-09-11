import { DbContext, dbQuery } from "@/lib/data/db-utils";
import { z } from "zod";

export class EncryptedReportDao {
  constructor(private db: DbContext) {}

  async getReportCountByDog(args: {
    dogId: string;
  }): Promise<{ reportCount: number }> {
    const RowSchema = z.object({ reportCount: z.number() });
    type Row = z.infer<typeof RowSchema>;
    const { dogId } = args;
    const sql = `
    SELECT COUNT(1)::integer as "reportCount"
    FROM reports
    WHERE dog_id = $1
    `;
    const res = await dbQuery<Row>(this.db, sql, [dogId]);
    return RowSchema.parse(res.rows[0]);
  }
}
