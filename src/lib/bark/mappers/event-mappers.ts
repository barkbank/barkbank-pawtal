import { isEmpty } from "lodash";
import { PAWTAL_EVENT_TYPE } from "../enums/pawtal-event-type";
import { SentEmailEvent, SentEmailEventSchema } from "../models/email-models";
import { PawtalEventSpec, PawtalEventSpecSchema } from "../models/event-models";
import { PageLoadEvent, PageLoadEventSchema } from "../models/tracker-models";

export function toPawtalEventSpecFromPageLoadEvent(
  src: PageLoadEvent,
): PawtalEventSpec {
  const event = PageLoadEventSchema.parse(src);
  const { xVetAccountId, queryParams, ...others } = event;
  const eventData = isEmpty(queryParams) ? undefined : { queryParams };
  const spec: PawtalEventSpec = {
    eventType: PAWTAL_EVENT_TYPE.PAGE_LOAD,
    eventData,
    vetAccountId: xVetAccountId,
    ...others,
  };
  return PawtalEventSpecSchema.parse(spec);
}

export function toPawtalEventSpecFromSentEmailEvent(
  src: SentEmailEvent,
): PawtalEventSpec {
  const event = SentEmailEventSchema.parse(src);
  const out = PawtalEventSpecSchema.parse(event);
  return out;
}
