"use server";

import { ClientInfo, ClientInfoSchema } from "@/lib/bark/models/tracker-models";
import { CODE } from "@/lib/utilities/bark-code";
import APP from "@/lib/app";

export async function postOnPageLoad(args: {
  clientInfo: ClientInfo;
}): Promise<typeof CODE.OK | typeof CODE.FAILED> {
  try {
    const clientInfo = ClientInfoSchema.parse(args.clientInfo);
    const service = await APP.getTrackerService();
    await service.onPageLoad({ clientInfo });
    return CODE.OK;
  } catch (err) {
    console.error(err);
    return CODE.FAILED;
  }
}
