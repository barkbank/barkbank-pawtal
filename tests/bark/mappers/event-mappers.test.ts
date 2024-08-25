import { AccountType } from "@/lib/auth-models";
import { PAWTAL_EVENT_TYPE } from "@/lib/bark/enums/pawtal-event-type";
import {
  toPawtalEventSpecFromPageLoadEvent,
  toPawtalEventSpecFromSentEmailEvent,
} from "@/lib/bark/mappers/event-mappers";
import { SentEmailEvent } from "@/lib/bark/models/email-models";
import { PawtalEventSpec } from "@/lib/bark/models/event-models";
import { PageLoadEvent } from "@/lib/bark/models/tracker-models";

describe("event-mappers", () => {
  describe("toPawtalEventSpecFromPageLoadEvent", () => {
    it("maps PageLoadEvent to PawtalEventSpec", () => {
      const pageLoadEvent: PageLoadEvent = {
        eventTs: new Date(),
        pathname: "/some/page",
        queryString: "utm=123",
        queryParams: { utm: "123" },
        ctk: "ctk1",
        stk: "stk1",
        accountType: "VET",
        accountId: "123",
        xVetAccountId: "456",
      };
      const spec = toPawtalEventSpecFromPageLoadEvent(pageLoadEvent);
      const expected: PawtalEventSpec = {
        eventTs: pageLoadEvent.eventTs,
        eventType: PAWTAL_EVENT_TYPE.PAGE_LOAD,
        eventData: {
          queryParams: {
            utm: "123",
          },
        },
        queryString: "utm=123",
        pathname: "/some/page",
        ctk: "ctk1",
        stk: "stk1",
        accountType: "VET",
        accountId: "123",
        vetAccountId: "456",
      };
      expect(spec).toMatchObject(expected);
      expect(expected).toMatchObject(spec);
    });
    it("maps empty queryParams to undefined eventData", () => {
      const pageLoadEvent: PageLoadEvent = {
        eventTs: new Date(),
        pathname: "/some/page",
        queryString: "",
        queryParams: {},
        ctk: "ctk1",
        stk: "stk1",
        accountType: "VET",
        accountId: "123",
        xVetAccountId: "456",
      };
      const spec = toPawtalEventSpecFromPageLoadEvent(pageLoadEvent);
      const expected: PawtalEventSpec = {
        eventTs: pageLoadEvent.eventTs,
        eventType: PAWTAL_EVENT_TYPE.PAGE_LOAD,
        eventData: undefined,
        queryString: "",
        pathname: "/some/page",
        ctk: "ctk1",
        stk: "stk1",
        accountType: "VET",
        accountId: "123",
        vetAccountId: "456",
      };
      expect(spec).toMatchObject(expected);
      expect(expected).toMatchObject(spec);
    });
  });
  describe("toPawtalEventSpecFromSentEmailEvent", () => {
    it("maps SentEmailEvent to PawtalEventSpec", () => {
      const event: SentEmailEvent = {
        eventTs: new Date(),
        eventType: PAWTAL_EVENT_TYPE.EMAIL_SENT_WELCOME,
        accountType: AccountType.USER,
        accountId: "34",
      };
      const spec = toPawtalEventSpecFromSentEmailEvent(event);
      // SentEmailEvent is a subset of PawtalEventSpec. Therefore we can compare
      // them directly.
      expect(spec).toMatchObject(event);
      expect(event).toMatchObject(spec);
    });
  });
});
