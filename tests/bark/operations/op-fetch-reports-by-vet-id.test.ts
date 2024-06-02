import { opFetchReportsByVetId } from "@/lib/bark/operations/op-fetch-reports-by-vet-id";
import { withBarkContext } from "../_context";
import { givenVet } from "../_given";

describe("opFetchReportsByVetId", () => {
  it("should return empty list when vet has no reports", async () => {
    await withBarkContext(async ({ context }) => {
      const { vetId } = await givenVet(context);
      const { result, error } = await opFetchReportsByVetId(context, { vetId });
      expect(error).toBeUndefined();
      expect(result).toEqual([]);
    });
  });
  it("WIP: should return reports", async () => {
    await withBarkContext(async ({ context }) => {});
  });
});
