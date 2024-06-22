import { Err, Ok, Result } from "@/lib/utilities/result";
import { BarkContext } from "../bark-context";
import { CODE } from "@/lib/utilities/bark-code";
import { DogReportCount } from "../models/dog-report-count";
import { selectDogReportCount } from "../queries/select-dog-report-count";

export async function opFetchDogReportCount(
  context: BarkContext,
  args: { dogId: string },
): Promise<Result<DogReportCount, typeof CODE.FAILED>> {
  const { dbPool } = context;
  const { dogId } = args;
  try {
    const res = await selectDogReportCount(dbPool, { dogId });
    return Ok(res);
  } catch (err) {
    console.error(err);
    return Err(CODE.FAILED);
  }
}
