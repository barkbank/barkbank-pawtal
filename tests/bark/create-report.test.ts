import { withBarkContext } from "./_context";
import { mockReportData } from "./_mocks";
import { CODE } from "@/lib/utilities/bark-code";
import { givenDog, givenVet } from "./_given";
import { BarkAction_createReport } from "@/lib/bark/operations/create-report";
import { opRecordAppointmentCallOutcome } from "@/lib/bark/operations/op-record-appointment-call-outcome";
import { selectAppointmentSituation } from "@/lib/bark/queries/select-appointment-situation";

describe("BarkAction_createReport", () => {
  it("should return ERROR_APPOINTMENT_NOT_FOUND when appointment cannot be found", async () => {
    await withBarkContext(async ({ context }) => {
      const appointmentId = "12345";
      const reportData = mockReportData();
      const { result, error } = await BarkAction_createReport(context, {
        appointmentId,
        reportData,
      });
      expect(result).toBeUndefined();
      expect(error).toEqual(CODE.ERROR_APPOINTMENT_NOT_FOUND);
    });
  });
  it("should save report data", async () => {
    await withBarkContext(async ({ context, testContext, dbContext }) => {
      const { vetId } = await givenVet(testContext);
      const { dogId } = await givenDog(testContext, { preferredVetId: vetId });
      const res1 = await opRecordAppointmentCallOutcome(context, { dogId, vetId });
      const { appointmentId } = res1.result!;
      const reportData = mockReportData();
      const { result, error } = await BarkAction_createReport(context, {
        appointmentId,
        reportData,
      });
      expect(result).not.toBeUndefined();
      expect(error).toBeUndefined();
      const { reportId } = result!;
      expect(reportId).toBeTruthy();
      const { hasExistingAppointment } = await selectAppointmentSituation(
        dbContext,
        { dogId, vetId },
      );
      expect(hasExistingAppointment).toBe(false);
    });
  });
});
