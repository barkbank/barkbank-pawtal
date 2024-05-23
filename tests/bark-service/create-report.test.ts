import { withService } from "./_service";
import { mockReportData } from "./_mocks";
import { CODE } from "@/lib/utilities/bark-code";

describe("createReport", () => {
  it("should return ERROR_APPOINTMENT_NOT_FOUND when appointment cannot be found", async () => {
    await withService(async ({ service }) => {
      const appointmentId = "12345";
      const reportData = mockReportData();
      const { result, error } = await service.createReport({
        appointmentId,
        reportData,
      });
      expect(result).toBeUndefined();
      expect(error).toEqual(CODE.ERROR_APPOINTMENT_NOT_FOUND);
    });
  });
});
