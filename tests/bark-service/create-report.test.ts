import { withService } from "./_service";
import { mockReportData } from "./_mocks";
import { CODE } from "@/lib/utilities/bark-code";
import { givenDog, givenVet } from "./_given";

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
  it("should save report data", async () => {
    await withService(async ({ service, context }) => {
      const { vetId } = await givenVet(context);
      const { dogId } = await givenDog(context, { preferredVetId: vetId });
      const res1 = await service.addAppointment({ dogId, vetId });
      const { appointmentId } = res1.result!;
      const reportData = mockReportData();
      const { result, error } = await service.createReport({
        appointmentId,
        reportData,
      });
      expect(result).not.toBeUndefined();
      expect(error).toBeUndefined();
      const { reportId } = result!;
      expect(reportId).toBeTruthy();
      // WIP: expect no outstanding appointment for {dogId, vetId}
    });
  });
});
