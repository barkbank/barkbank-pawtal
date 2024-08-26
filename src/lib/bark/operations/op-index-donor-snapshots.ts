import { BarkContext } from "../bark-context";
import { insertDonorSnapshot } from "../queries/insert-donor-snapshot";

export async function opIndexDonorSnapshots(
  context: BarkContext,
  args: { referenceDate: Date },
): Promise<void> {
  const { dbPool } = context;
  const { referenceDate } = args;
  try {
    await insertDonorSnapshot(dbPool, { referenceDate });
  } catch (err) {
    console.error(err);
  }
}
