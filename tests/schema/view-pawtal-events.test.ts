import { DbContext, dbQuery } from "@/lib/data/db-utils";
import { withDb } from "../_db_helpers";
import {
  parseCommonDateTime,
  SINGAPORE_TIME_ZONE,
} from "@/lib/utilities/bark-time";

describe("view_pawtal_events", () => {
  it("should add Singapore Day to events", async () => {
    await withDb(async (db) => {
      const eventTs = parseCommonDateTime(
        "2024-08-03 02:00",
        SINGAPORE_TIME_ZONE,
      );
      const { eventId } = await _insertEventAtTimestamp(db, { eventTs });
      const { day } = await _selectDayStringByEventId(db, { eventId });
      expect(day).toEqual("2024-08-03");
    });
  });
});

async function _insertEventAtTimestamp(
  db: DbContext,
  args: { eventTs: Date },
): Promise<{ eventId: string }> {
  const { eventTs } = args;
  const sql = `
  INSERT INTO pawtal_events (
    event_ts,
    event_type
  ) VALUES ($1, 'test.event')
  RETURNING event_id as "eventId"
  `;
  const res = await dbQuery<{ eventId: string }>(db, sql, [eventTs]);
  return res.rows[0];
}

async function _selectDayStringByEventId(
  db: DbContext,
  args: { eventId: string },
): Promise<{ day: string }> {
  const { eventId } = args;
  const sql = `
  SELECT day::text as "day"
  FROM view_pawtal_events
  WHERE event_id = $1
  `;
  const res = await dbQuery<{ day: string }>(db, sql, [eventId]);
  return res.rows[0];
}
