import { DbContext, dbQuery } from "@/lib/data/db-utils";
import { PageLoadEvent } from "../models/tracker-models";
import { PAWTAL_EVENT_TYPE } from "../enums/pawtal-event-type";

export class PawtalEventsDao {
  constructor(private db: DbContext) {}

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
    const { pageLoadEvent } = args;
    const {
      eventTs,
      ctk,
      accountType,
      accountId,
      stk,
      pathname,
      queryString,
      xVetAccountId,
    } = pageLoadEvent;
    const res = await dbQuery(this.db, sql, [
      eventTs,
      PAWTAL_EVENT_TYPE.PAGE_LOAD,
      ctk,
      accountType,
      accountId,
      stk,
      pathname,
      queryString,
      xVetAccountId,
    ]);
    return res.rows.length === 1;
  }
}
