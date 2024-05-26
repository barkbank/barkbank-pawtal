import { BarkReport, BarkReportData } from "@/lib/bark/bark-models";
import { givenDog, givenVet } from "./_given";
import { withBarkContext } from "./_context";
import { mockReportData } from "./_mocks";
import { CODE } from "@/lib/utilities/bark-code";
import { BarkAction_addAppointment } from "@/lib/bark/actions/add-appointment";
import { BarkAction_createReport } from "@/lib/bark/actions/create-report";
import { BarkAction_getReport } from "@/lib/bark/actions/get-report";
import { BarkAction_updateReport } from "@/lib/bark/actions/update-report";

describe("BarkAction_updateReport", () => {
  it("should update report data to the new values", async () => {
    await withBarkContext(async ({ context, testContext }) => {
      // GIVEN an existing report
      const { vetId } = await givenVet(testContext);
      const { dogId } = await givenDog(testContext, { preferredVetId: vetId });
      const res1 = await BarkAction_addAppointment(context, { dogId, vetId });
      const { appointmentId } = res1.result!;
      const originalReportData: BarkReportData = {
        ...mockReportData(),
        ineligibilityReason: "test reason",
        dogBodyConditioningScore: 1,
      };
      const res2 = await BarkAction_createReport(context, {
        appointmentId,
        reportData: originalReportData,
      });
      const { reportId } = res2.result!;
      console.log({ reportId });

      // WHEN the report is modified
      const modifiedReportData: BarkReportData = {
        ...originalReportData,
        ineligibilityReason: "new reason",
        dogBodyConditioningScore: 10,
      };
      const res3 = await BarkAction_updateReport(context, {
        reportId,
        reportData: modifiedReportData,
      });
      expect(res3).toEqual(CODE.OK);

      // THEN expect the modifications to be persisted.
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
        ...modifiedReportData,
      };
      expect(report).toEqual(expectedReport);
    });
  });
});
