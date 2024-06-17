import { CODE } from "@/lib/utilities/bark-code";
import { BarkContext } from "../bark-context";
import { BarkReport } from "../models/bark-report";
import { Err, Result } from "@/lib/utilities/result";

export async function opFetchReportsByDogId(
  context: BarkContext,
  args: { dogId: string; actorUserId?: string },
): Promise<Result<{ reports: BarkReport[] }, typeof CODE.FAILED>> {
  return Err(CODE.FAILED);
}
