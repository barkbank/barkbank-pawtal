import { DbContext } from "@/lib/data/db-utils";
import { IneligibilityFactors } from "../models/ineligibility-factors";

export async function selectIneligibilityFactors(
  db: DbContext,
  args: { dogId: string },
): Promise<IneligibilityFactors | null> {
  // WIP: Implement query.
  return null;
}
