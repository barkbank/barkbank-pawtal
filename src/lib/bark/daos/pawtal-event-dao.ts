import { DbContext, dbQuery } from "@/lib/data/db-utils";
import { PawtalEventType } from "../enums/pawtal-event-type";
import { z } from "zod";
import {
  PawtalEvent,
  PawtalEventIdentifier,
  PawtalEventIdentifierSchema,
  PawtalEventSchema,
  PawtalEventSpec,
  PawtalEventSpecSchema,
} from "../models/event-models";

export class PawtalEventDao {
  private projection = `
  event_id as "eventId",
  event_ts as "eventTs",
  event_type as "eventType",
  event_data as "eventData",
  account_type as "accountType",
  account_id as "accountId",
  ctk as "ctk",
  stk as "stk",
  x_pathname as "pathname",
  x_vet_account_id as "vetAccountId",
  x_query_string as "queryString"
  `;

  constructor(private db: DbContext) {}

  async getEventCountByType(args: {
    eventType: PawtalEventType;
  }): Promise<{ eventCount: number }> {
    const sql = `
    SELECT COUNT(*)::INTEGER as "eventCount"
    FROM pawtal_events
    WHERE event_type = $1
    `;
    const RowSchema = z.object({ eventCount: z.number() });
    const res = await dbQuery<typeof RowSchema>(this.db, sql, [args.eventType]);
    return RowSchema.parse(res.rows[0]);
  }

  async getByEventId(args: { eventId: string }): Promise<PawtalEvent | null> {
    const { eventId } = args;
    const sql = `
    SELECT ${this.projection}
    FROM pawtal_events
    WHERE event_id = $1
    `;
    const res = await dbQuery<PawtalEvent>(this.db, sql, [eventId]);
    if (res.rows.length !== 1) {
      return null;
    }
    return PawtalEventSchema.parse(res.rows[0]);
  }

  async insert(args: {
    spec: PawtalEventSpec;
  }): Promise<PawtalEventIdentifier> {
    const sql = `
    INSERT INTO pawtal_events (
      event_ts,
      event_type,
      event_data,
      ctk,
      account_type,
      account_id,
      stk,
      x_pathname,
      x_query_string,
      x_vet_account_id
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING event_id as "eventId"
    `;
    const spec = PawtalEventSpecSchema.parse(args.spec);
    const res = await dbQuery<PawtalEventIdentifier>(this.db, sql, [
      spec.eventTs,
      spec.eventType,
      spec.eventData,
      spec.ctk,
      spec.accountType,
      spec.accountId,
      spec.stk,
      spec.pathname,
      spec.queryString,
      spec.vetAccountId,
    ]);
    return PawtalEventIdentifierSchema.parse(res.rows[0]);
  }
}
