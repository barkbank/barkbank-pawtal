import { opFetchReportsByVetId } from "@/lib/bark/operations/op-fetch-reports-by-vet-id";
import { withBarkContext } from "../_context";
import { givenReport, givenVet } from "../_given";
import { BarkReport } from "@/lib/bark/models/bark-report";
import { mockReportData } from "../_mocks";

describe("opFetchReportsByVetId", () => {
  it("should return empty list when vet has no reports", async () => {
    await withBarkContext(async ({ context }) => {
      const { vetId } = await givenVet(context);
      const { result, error } = await opFetchReportsByVetId(context, { vetId });
      expect(error).toBeUndefined();
      expect(result).toEqual([]);
    });
  });
  it("should return reports", async () => {
    await withBarkContext(async ({ context }) => {
      const { vetId } = await givenVet(context, { vetIdx: 999 });
      const a1 = await givenReport(context, { existingVetId: vetId });
      const a2 = await givenReport(context, { existingVetId: vetId });
      const { result, error } = await opFetchReportsByVetId(context, { vetId });
      expect(error).toBeUndefined();
      const { reports } = result!;
      expect(reports.map((r) => r.appointmentId)).toContain(a1.appointmentId);
      expect(reports.map((r) => r.appointmentId)).toContain(a2.appointmentId);

      const report: BarkReport = reports.filter(
        (r) => r.appointmentId === a1.appointmentId,
      )[0];
      const reportData = mockReportData();
      expect(reportData).toMatchObject(report);
      expect(report).toMatchObject(reportData);
    });
  });
});
