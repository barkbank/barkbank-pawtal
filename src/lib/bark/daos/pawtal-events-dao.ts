import { DbContext, dbQuery } from "@/lib/data/db-utils";
import { PageLoadEvent, PageLoadEventSchema } from "../models/tracker-models";
import { PAWTAL_EVENT_TYPE, PawtalEventType } from "../enums/pawtal-event-type";
import { SentEmailEvent, SentEmailEventSchema } from "../models/email-models";
import { z } from "zod";
import { isEmpty } from "lodash";
import {
  PawtalEvent,
  PawtalEventIdentifier,
  PawtalEventIdentifierSchema,
  PawtalEventSchema,
  PawtalEventSpec,
  PawtalEventSpecSchema,
} from "../models/event-models";

// WIP: Rename to PawtalEventDao (singular)
export class PawtalEventsDao {
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

  // WIP: Caller of insertPageLoadEvent should convert to PawtalEventSpec and call insert()
  async insertPageLoadEvent(args: {
    pageLoadEvent: PageLoadEvent;
  }): Promise<boolean> {
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
    RETURNING 1
    `;
    const x = PageLoadEventSchema.parse(args.pageLoadEvent);
    const { queryParams } = x;
    const eventData = isEmpty(queryParams) ? undefined : { queryParams };
    const res = await dbQuery(this.db, sql, [
      x.eventTs,
      PAWTAL_EVENT_TYPE.PAGE_LOAD,
      eventData,
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

  // WIP: Caller of insertSentEmailEvent should convert to PawtalEventSpec and call insert()
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
