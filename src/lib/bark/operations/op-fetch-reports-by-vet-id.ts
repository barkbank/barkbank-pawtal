import { Err, Result } from "@/lib/utilities/result";
import { BarkContext } from "../bark-context";
import { BarkReport } from "../models/bark-report";
import { CODE } from "@/lib/utilities/bark-code";

export async function opFetchReportsByVetId(
  context: BarkContext,
  args: { vetId: string },
): Promise<Result<{ reports: BarkReport[] }, typeof CODE.FAILED>> {
  return Err(CODE.FAILED);
}
