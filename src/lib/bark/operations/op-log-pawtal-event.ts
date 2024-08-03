import {
  PawtalEventType,
  PawtalEventTypeSchema,
} from "../enums/pawtal-event-type";

export function opLogPawtalEvent(args: {
  eventType: PawtalEventType;
  params: Record<string, any>;
}) {
  const eventType = PawtalEventTypeSchema.parse(args.eventType);
  const params = args.params;
  if ("eventType" in params) {
    throw new Error("params cannot have reserved name eventType");
  }
  const event = { eventType, ...params };
  const msg = JSON.stringify(event);
  console.log(msg);
}
