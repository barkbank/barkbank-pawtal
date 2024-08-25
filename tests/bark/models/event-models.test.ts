import { PAWTAL_EVENT_TYPE } from "@/lib/bark/enums/pawtal-event-type";
import {
  PawtalEventSpec,
  PawtalEventSpecSchema,
} from "@/lib/bark/models/event-models";

describe("event-models", () => {
  describe("PawtalEventSpecSchema", () => {
    it("accepts the minimal event", () => {
      const spec: PawtalEventSpec = {
        eventTs: new Date(),
        eventType: PAWTAL_EVENT_TYPE.PAGE_LOAD,
      };
      PawtalEventSpecSchema.parse(spec);
    });
    it("accepts event with data", () => {
      // eventData is a JSONValue, which is thoroughly tested in
      // json-schema.test.ts.
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
      };
      PawtalEventSpecSchema.parse(spec);
    });
  });
});
