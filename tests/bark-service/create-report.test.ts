import { withService } from "./bark-test-helpers";
import { mockReportData } from "./bark-mocks";
import { CODE } from "@/lib/utilities/bark-code";

describe("createReport", () => {
  it("should return ERROR_APPOINTMENT_NOT_FOUND when the provided appointment ID does not reference a known appointment", async () => {
    await withService(async ({ service }) => {
      const noSuchAppointmentId = "123456";
      const reportData = mockReportData();
      const { result, error } = await service.createReport(
        noSuchAppointmentId,
        reportData,
      );
      expect(result).toBeUndefined();
      expect(error).toEqual(CODE.ERROR_APPOINTMENT_NOT_FOUND);
    });
  });
});
