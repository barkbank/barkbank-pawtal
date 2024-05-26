import { BarkReport, BarkReportData } from "@/lib/bark/bark-models";
import { givenDog, givenVet } from "./_given";
import { mockReportData } from "./_mocks";
import { withService } from "./_service";

describe("getReport", () => {
  it("should return the report", async () => {
    await withService(async ({ service, context }) => {
      const { vetId } = await givenVet(context);
      const { dogId } = await givenDog(context, { preferredVetId: vetId });
      const res1 = await service.addAppointment({ dogId, vetId });
      const { appointmentId } = res1.result!;
      const reportData: BarkReportData = {
        ...mockReportData(),
        ineligibilityReason: "test reason",
      };
      const res2 = await service.createReport({
        appointmentId,
        reportData,
      });
      const { reportId } = res2.result!;
      console.log({ reportId });
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
        ...reportData,
      };
      expect(report).toEqual(expectedReport);
    });
  });
});
