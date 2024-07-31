import { DbContext, dbQuery } from "@/lib/data/db-utils";
import { PageLoadEvent } from "../models/tracker-models";

const EVENT_TYPE = {
  PAGE_LOAD: "ui.pageload",
} as const;

// WIP: Write test for PawtalEventsDao
export class PawtalEventsDao {
  constructor(private db: DbContext) {}

  async insertPageLoadEvent(args: {
    pageLoadEvent: PageLoadEvent;
  }): Promise<boolean> {
    // WIP: migrate local schema.
    const sql = `
    INSERT INTO pawtal_events (
      event_ts,
      event_type,
      ctk,
      account_type,
      account_id,
      stk,
      x_pathname
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING 1
    `;
    const { pageLoadEvent: trackingInfo } = args;
    const { eventTs, ctk, accountType, accountId, stk, pathname } =
      trackingInfo;
    const res = await dbQuery(this.db, sql, [
      eventTs,
      EVENT_TYPE.PAGE_LOAD,
      ctk,
      accountType,
      accountId,
      stk,
      pathname,
    ]);
    return res.rows.length === 1;
  }
}
