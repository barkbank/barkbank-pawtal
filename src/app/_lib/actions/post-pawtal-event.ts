"use server";

import APP from "@/lib/app";
import {
  PawtalEventClientSpec,
  PawtalEventClientSpecSchema,
} from "@/lib/bark/models/event-models";

export async function postPawtalEvent(args: { spec: PawtalEventClientSpec }) {
  const spec = PawtalEventClientSpecSchema.parse(args.spec);
  const tracker = await APP.getTrackerService();
  return tracker.onPawtalEvent({ spec });
}
