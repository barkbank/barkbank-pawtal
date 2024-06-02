import { withBarkContext } from "../_context";
import { mockReportData } from "../_mocks";
import { CODE } from "@/lib/utilities/bark-code";
import { givenAppointment, givenDog, givenVet } from "../_given";
import { opSubmitReport } from "@/lib/bark/operations/op-submit-report";
import { opRecordAppointmentCallOutcome } from "@/lib/bark/operations/op-record-appointment-call-outcome";
import { selectAppointmentSituation } from "@/lib/bark/queries/select-appointment-situation";

describe("opSubmitReport", () => {
  it("should return ERROR_APPOINTMENT_NOT_FOUND when appointment cannot be found", async () => {
    await withBarkContext(async ({ context }) => {
      const { vetId } = await givenVet(context);
      const appointmentId = "12345";
      const reportData = mockReportData();
      const { result, error } = await opSubmitReport(context, {
        appointmentId,
        reportData,
        actorVetId: vetId,
      });
      expect(result).toBeUndefined();
      expect(error).toEqual(CODE.ERROR_APPOINTMENT_NOT_FOUND);
    });
  });
  it("should save report data", async () => {
    await withBarkContext(async ({ context, testContext, dbContext }) => {
      const { vetId } = await givenVet(testContext);
      const { dogId } = await givenDog(testContext, { preferredVetId: vetId });
      const res1 = await opRecordAppointmentCallOutcome(context, {
        dogId,
        vetId,
      });
      const { appointmentId } = res1.result!;
      const reportData = mockReportData();
      const { result, error } = await opSubmitReport(context, {
        appointmentId,
        reportData,
        actorVetId: vetId,
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
  it("should return ERROR_NOT_ALLOWED when the vet does not own the appointment", async () => {
    await withBarkContext(async ({ context }) => {
      const a1 = await givenAppointment(context, { idx: 1 });
      const v2 = await givenVet(context, { vetIdx: 2 });
      const reportData = mockReportData();
      const { result, error } = await opSubmitReport(context, {
        appointmentId: a1.appointmentId,
        reportData,
        actorVetId: v2.vetId,
      });
      expect(error).toEqual(CODE.ERROR_NOT_ALLOWED);
      expect(result).toBeUndefined();
    });
  });
});
