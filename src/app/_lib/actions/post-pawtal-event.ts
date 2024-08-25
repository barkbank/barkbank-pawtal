"use server";

import APP from "@/lib/app";
import { PawtalEventClientSpec } from "@/lib/bark/models/event-models";

export async function postPawtalEvent(args: { spec: PawtalEventClientSpec }) {
  const { spec } = args;
  const tracker = await APP.getTrackerService();
  return tracker.onPawtalEvent({ spec });
}
