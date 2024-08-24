import { DbContext, dbQuery } from "@/lib/data/db-utils";
import { PageLoadEvent, PageLoadEventSchema } from "../models/tracker-models";
import { PAWTAL_EVENT_TYPE, PawtalEventType } from "../enums/pawtal-event-type";
import { SentEmailEvent, SentEmailEventSchema } from "../models/email-models";
import { z } from "zod";

export class PawtalEventsDao {
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

  async insertPageLoadEvent(args: {
    pageLoadEvent: PageLoadEvent;
  }): Promise<boolean> {
    const sql = `
    INSERT INTO pawtal_events (
      event_ts,
      event_type,
      ctk,
      account_type,
      account_id,
      stk,
      x_pathname,
      x_query_string,
      x_vet_account_id
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING 1
    `;
    const x = PageLoadEventSchema.parse(args.pageLoadEvent);
    const res = await dbQuery(this.db, sql, [
      x.eventTs,
      PAWTAL_EVENT_TYPE.PAGE_LOAD,
      x.ctk,
      x.accountType,
      x.accountId,
      x.stk,
      x.pathname,
      x.queryString,
      x.xVetAccountId,
    ]);
    return res.rows.length === 1;
  }

  async insertSentEmailEvent(args: {
    sentEmailEvent: SentEmailEvent;
  }): Promise<boolean> {
    const sql = `
    INSERT INTO pawtal_events (
      event_ts,
      event_type,
      account_type,
      account_id
    )
    VALUES ($1, $2, $3, $4)
    RETURNING 1
    `;
    const x = SentEmailEventSchema.parse(args.sentEmailEvent);
    const res = await dbQuery(this.db, sql, [
      x.eventTs,
      x.eventType,
      x.accountType,
      x.accountId,
    ]);
    return res.rows.length === 1;
  }
}
