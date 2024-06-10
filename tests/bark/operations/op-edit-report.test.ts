import { BarkReport } from "@/lib/bark/models/bark-report";
import { BarkReportData } from "@/lib/bark/models/bark-report-data";
import { givenDog, givenReport, givenVet } from "../_given";
import { withBarkContext } from "../_context";
import { mockReportData } from "../_mocks";
import { CODE } from "@/lib/utilities/bark-code";
import { opRecordAppointmentCallOutcome } from "@/lib/bark/operations/op-record-appointment-call-outcome";
import { opSubmitReport } from "@/lib/bark/operations/op-submit-report";
import { opFetchReport } from "@/lib/bark/operations/op-fetch-report";
import { opEditReport } from "@/lib/bark/operations/op-edit-report";
import { SpecifiedDogGenderSchema } from "@/lib/bark/enums/dog-gender";

describe("opEditReport", () => {
  it("should return ERROR_NOT_ALLOWED if attempting to edit another vet's report", async () => {
    await withBarkContext(async ({ context }) => {
      const { reportId } = await givenReport(context, { idx: 1 });
      const { vetId } = await givenVet(context, { vetIdx: 2 });
      const reportData = mockReportData();
      const res = await opEditReport(context, {
        reportId,
        reportData,
        actorVetId: vetId,
      });
      expect(res).toEqual(CODE.ERROR_NOT_ALLOWED);
    });
  });
  it("should update report data to the new values", async () => {
    await withBarkContext(async ({ context, testContext }) => {
      // GIVEN an existing report
      const { vetId } = await givenVet(testContext);
      const { dogId, dogName, dogBreed, dogGender, ownerName } = await givenDog(
        testContext,
        { preferredVetId: vetId },
      );
      const res1 = await opRecordAppointmentCallOutcome(context, {
        dogId,
        vetId,
      });
      const { appointmentId } = res1.result!;
      const originalReportData: BarkReportData = {
        ...mockReportData(),
        ineligibilityReason: "test reason",
        dogBodyConditioningScore: 1,
      };
      const res2 = await opSubmitReport(context, {
        appointmentId,
        reportData: originalReportData,
        actorVetId: vetId,
      });
      const { reportId } = res2.result!;
      console.log({ reportId });

      // WHEN the report is modified
      const modifiedReportData: BarkReportData = {
        ...originalReportData,
        ineligibilityReason: "new reason",
        dogBodyConditioningScore: 2,
      };
      const res3 = await opEditReport(context, {
        reportId,
        reportData: modifiedReportData,
        actorVetId: vetId,
      });
      expect(res3).toEqual(CODE.OK);

      // THEN expect the modifications to be persisted.
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
        dogGender: SpecifiedDogGenderSchema.parse(dogGender),
        ownerName,
        ...modifiedReportData,
      };
      expect(report).toEqual(expectedReport);
    });
  });
});
