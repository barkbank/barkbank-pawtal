import { DbContext, dbQuery } from "@/lib/data/db-utils";
import { TrackingInfo } from "../models/tracker-models";

// WIP: Write test for PawtalEventsDao
export class PawtalEventsDao {
  constructor(private db: DbContext) {}
  async insertTrackingInfo(args: {
    trackingInfo: TrackingInfo;
  }): Promise<boolean> {
    // WIP: migrate local schema.
    const sql = `
    INSERT INTO pawtal_events (
      event_type,
      ctk,
      account_type,
      account_id,
      stk,
      x_pathname
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    `;
    const { trackingInfo } = args;
    const { ctk, accountType, accountId, stk, pathname } = trackingInfo;
    const res = await dbQuery(this.db, sql, [
      "ui.pageload",
      ctk,
      accountType,
      accountId,
      stk,
      pathname,
    ]);
    return res.rows.length === 1;
  }
}
