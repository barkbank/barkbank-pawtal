import { DbContext, dbQuery } from "@/lib/data/db-utils";
import { z } from "zod";

const RowSchema = z.object({
  appointmentId: z.string(),
});

export async function insertAppointment(
  dbContext: DbContext,
  args: { dogId: string; vetId: string },
): Promise<{ appointmentId: string }> {
  const { dogId, vetId } = args;
  const sql = `
  INSERT INTO calls (dog_id, vet_id, call_outcome, encrypted_opt_out_reason)
  VALUES ($1, $2, 'APPOINTMENT', '')
  RETURNING call_id::text as "appointmentId"
  `;
  const res = await dbQuery<{ appointmentId: string }>(dbContext, sql, [
    dogId,
    vetId,
  ]);
  return RowSchema.parse(res.rows[0]);
}
