"use server";

import APP from "@/lib/app";
import {
  PawtalEventClientSpec,
  PawtalEventClientSpecSchema,
  PawtalEventSpec,
} from "@/lib/bark/models/event-models";
import { getOrCreateCtk } from "@/lib/bark/services/tracker-service";

export async function postPawtalEvent(args: { spec: PawtalEventClientSpec }) {
  const clientSpec = PawtalEventClientSpecSchema.parse(args.spec);
  const ctk = getOrCreateCtk();
  const spec: PawtalEventSpec = { eventTs: new Date(), ctk, ...clientSpec };
  const service = await APP.getPawtalEventService();
  return service.submit({ spec });
}
