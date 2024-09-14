import { withBarkContext } from "../_context";
import { PawtalEventSpec } from "@/lib/bark/models/event-models";
import { PAWTAL_EVENT_TYPE } from "@/lib/bark/enums/pawtal-event-type";
import { AccountType } from "@/lib/auth-models";
import { PawtalEventDao } from "@/lib/bark/daos/pawtal-event-dao";

describe("PawtalEventDao", () => {
  it("can be used to insert an event", async () => {
    await withBarkContext(async ({ context }) => {
      const dao = new PawtalEventDao(context.dbPool);
      const spec: PawtalEventSpec = {
        eventTs: new Date(),
        eventType: PAWTAL_EVENT_TYPE.PAGE_LOAD,
        eventData: {
          clientType: "MOBILE",
          clientIp: "192.168.10.123",
          isRobot: false,
          clientTs: 1724544196849,
          cookies: {
            ctk: "ABCD-1234",
            stk: "1234-ABCD",
          },
        },
        ctk: null,
        accountType: AccountType.ADMIN,
        accountId: "811",
        queryString: "rabbit=1&dog=89",
        pawtalVersion: "0.14.1",
      };
      const { eventId } = await dao.insert({ spec });
      const event = await dao.getByEventId({ eventId });
      expect(event).toMatchObject(spec);
    });
  });
});
