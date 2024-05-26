import { BarkReport, BarkReportData } from "@/lib/bark/bark-models";
import { givenDog, givenVet } from "./_given";
import { withService } from "./_service";
import { mockReportData } from "./_mocks";
import { CODE } from "@/lib/utilities/bark-code";

describe("updateReport", () => {
  it("should update report data to the new values", async () => {
    await withService(async ({ service, context }) => {
      // GIVEN an existing report
      const { vetId } = await givenVet(context);
      const { dogId } = await givenDog(context, { preferredVetId: vetId });
      const res1 = await service.addAppointment({ dogId, vetId });
      const { appointmentId } = res1.result!;
      const originalReportData: BarkReportData = {
        ...mockReportData(),
        ineligibilityReason: "test reason",
        dogBodyConditioningScore: 1,
      };
      const res2 = await service.createReport({
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
      const res3 = await service.updateReport({
        reportId,
        reportData: modifiedReportData,
      });
      expect(res3).toEqual(CODE.OK);

      // THEN expect the modifications to be persisted.
      const { result, error } = await service.getReport({ reportId });
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
