import { BarkReport, BarkReportSchema } from "@/lib/bark/models/bark-report";
import { BarkReportData } from "@/lib/bark/models/bark-report-data";
import { givenDog, givenVet } from "../_given";
import { mockReportData } from "../_mocks";
import { withBarkContext } from "../_context";
import { opRecordAppointmentCallOutcome } from "@/lib/bark/operations/op-record-appointment-call-outcome";
import { opSubmitReport } from "@/lib/bark/operations/op-submit-report";
import { opFetchReport } from "@/lib/bark/operations/op-fetch-report";

describe("opFetchReport", () => {
  it("should return the report", async () => {
    await withBarkContext(async ({ context, testContext }) => {
      const { vetId, vetName, vetAddress, vetPhoneNumber } =
        await givenVet(testContext);
      const { dogId, dogName, dogBreed, dogGender, ownerName } = await givenDog(
        testContext,
        { preferredVetId: vetId },
      );
      const res1 = await opRecordAppointmentCallOutcome(context, {
        dogId,
        vetId,
      });
      const { appointmentId } = res1.result!;
      const reportData: BarkReportData = {
        ...mockReportData(),
        ineligibilityReason: "test reason",
      };
      const res2 = await opSubmitReport(context, {
        appointmentId,
        reportData,
        actorVetId: vetId,
      });
      const { reportId } = res2.result!;
      console.log({ reportId });
      const { result, error } = await opFetchReport(context, {
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
        dogName,
        dogBreed,
        dogGender,
        ownerName,
        vetName,
        vetAddress,
        vetPhoneNumber,
        ...reportData,
      };
      expect(report).toEqual(BarkReportSchema.parse(expectedReport));
    });
  });
});
