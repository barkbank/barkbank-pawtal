import { PawtalEventsDao } from "@/lib/bark/daos/pawtal-events-dao";
import { withBarkContext } from "../_context";
import { PageLoadEvent } from "@/lib/bark/models/tracker-models";
import { dbQuery } from "@/lib/data/db-utils";

describe("PawtalEventsDao", () => {
  describe("insertPageLoadEvent", () => {
    it("should insert full event", async () => {
      await withBarkContext(async ({ context }) => {
        const { dbPool } = context;
        const dao = new PawtalEventsDao(dbPool);
        const pageLoadEvent: PageLoadEvent = {
          eventTs: new Date(),
          pathname: "/some/page",
          ctk: "ctk1",
          stk: "stk1",
          accountType: "VET",
          accountId: "123",
          xVetAccountId: "456",
        };
        await dao.insertPageLoadEvent({ pageLoadEvent });
        const sql = `
        SELECT 1
        FROM pawtal_events
        WHERE x_pathname = '/some/page'
        AND ctk = 'ctk1'
        AND account_type = 'VET'
        AND account_id = '123'
        AND stk = 'stk1'
        AND event_type = 'ui.pageload'
        AND x_vet_account_id = '456'
        `;
        const res = await dbQuery(dbPool, sql, []);
        expect(res.rows.length).toEqual(1);
      });
    });
    it("should insert partial event", async () => {
      await withBarkContext(async ({ context }) => {
        const { dbPool } = context;
        const dao = new PawtalEventsDao(dbPool);
        const pageLoadEvent: PageLoadEvent = {
          eventTs: new Date(),
          pathname: "/some/page",
          ctk: "ctk1",
        };
        await dao.insertPageLoadEvent({ pageLoadEvent });
        const sql = `
        SELECT 1
        FROM pawtal_events
        WHERE x_pathname = '/some/page'
        AND ctk = 'ctk1'
        AND account_type IS NULL
        AND account_id IS NULL
        AND stk IS NULL
        AND event_type = 'ui.pageload'
        `;
        const res = await dbQuery(dbPool, sql, []);
        expect(res.rows.length).toEqual(1);
      });
    });
  });
});
