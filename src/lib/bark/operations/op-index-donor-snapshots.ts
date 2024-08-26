import { Err, Ok, Result } from "@/lib/utilities/result";
import { BarkContext } from "../bark-context";
import { insertDonorSnapshot } from "../queries/insert-donor-snapshot";
import { CODE } from "@/lib/utilities/bark-code";

export async function opIndexDonorSnapshots(
  context: BarkContext,
  args: { referenceDate: Date },
): Promise<Result<{ donorCount: number }, typeof CODE.FAILED>> {
  const { dbPool } = context;
  const { referenceDate } = args;
  try {
    const { donorCount } = await insertDonorSnapshot(dbPool, { referenceDate });
    return Ok({ donorCount });
  } catch (err) {
    console.error(err);
    return Err(CODE.FAILED);
  }
}
