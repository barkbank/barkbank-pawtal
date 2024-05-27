import { DbContext, dbQuery } from "@/lib/data/db-utils";
import { z } from "zod";

const ArgSchema = z.object({
  appointmentId: z.string(),
});

type ArgType = z.infer<typeof ArgSchema>;

const RowSchema = z.object({
  exists: z.boolean(),
});

type RowType = z.infer<typeof RowSchema>;

export async function selectPendingAppointmentExists(
  dbContext: DbContext,
  args: ArgType,
): Promise<RowType> {
  const { appointmentId } = args;
  const sql = `
  SELECT
    COUNT(*) > 0 as exists
  FROM calls
  WHERE call_id = $1
  `;
  const res = await dbQuery<RowType>(dbContext, sql, [appointmentId]);
  return RowSchema.parse(res.rows[0]);
}
