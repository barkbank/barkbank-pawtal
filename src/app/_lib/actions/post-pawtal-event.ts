"use server";

import APP from "@/lib/app";
import { PawtalEventSpec } from "@/lib/bark/models/event-models";

export async function postPawtalEvent(args: {spec: PawtalEventSpec}) {
  const {spec} = args;
  const service = await APP.getPawtalEventService();
  return service.submit({spec});
}
