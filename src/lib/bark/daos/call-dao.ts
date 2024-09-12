import { DbContext, dbQuery } from "@/lib/data/db-utils";
import { CallSpec } from "../models/call-models";
import { z } from "zod";

export class CallDao {
  constructor(private db: DbContext) {}

  async insert(args: { spec: CallSpec }): Promise<{ callId: string }> {
    const RowSchema = z.object({ callId: z.string() });
    type Row = z.infer<typeof RowSchema>;
    const { spec } = args;
    const sql = `
    INSERT INTO calls (
      dog_id,
      vet_id,
      call_outcome,
      encrypted_opt_out_reason
    )
    VALUES ($1, $2, $3, '')
    RETURNING
      call_id as "callId"
    `;
    const res = await dbQuery<Row>(this.db, sql, [
      spec.dogId,
      spec.vetId,
      spec.callOutcome,
    ]);
    return RowSchema.parse(res.rows[0]);
  }
}
