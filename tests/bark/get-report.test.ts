import { BarkReport, BarkReportData } from "@/lib/bark/bark-models";
import { givenDog, givenVet } from "./_given";
import { mockReportData } from "./_mocks";
import { withBarkContext } from "./_context";
import { BarkAction_addAppointment } from "@/lib/bark/operations/add-appointment";
import { BarkAction_createReport } from "@/lib/bark/operations/create-report";
import { BarkAction_getReport } from "@/lib/bark/operations/get-report";

describe("BarkAction_getReport", () => {
  it("should return the report", async () => {
    await withBarkContext(async ({ context, testContext }) => {
      const { vetId } = await givenVet(testContext);
      const { dogId } = await givenDog(testContext, { preferredVetId: vetId });
      const res1 = await BarkAction_addAppointment(context, { dogId, vetId });
      const { appointmentId } = res1.result!;
      const reportData: BarkReportData = {
        ...mockReportData(),
        ineligibilityReason: "test reason",
      };
      const res2 = await BarkAction_createReport(context, {
        appointmentId,
        reportData,
      });
      const { reportId } = res2.result!;
      console.log({ reportId });
      const { result, error } = await BarkAction_getReport(context, {
        reportId,
      });
      expect(error).toBeUndefined();
      const { report } = result!;
      const expectedReport: BarkReport = {
        appointmentId,
        dogId,
        vetId,
        reportId,
        reportCreationTime: report.reportCreationTime,
        reportModificationTime: report.reportModificationTime,
        ...reportData,
      };
      expect(report).toEqual(expectedReport);
    });
  });
});
