import { BarkReport, BarkReportSchema } from "@/lib/bark/models/report-models";
import { BarkReportData } from "@/lib/bark/models/bark-report-data";
import { givenDog, givenReport, givenUser, givenVet } from "../_given";
import { mockReportData } from "../_mocks";
import { withBarkContext } from "../_context";
import { opRecordAppointmentCallOutcome } from "@/lib/bark/operations/op-record-appointment-call-outcome";
import { opSubmitReport } from "@/lib/bark/operations/op-submit-report";
import { opFetchReport } from "@/lib/bark/operations/op-fetch-report";
import { CODE } from "@/lib/utilities/bark-code";

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
  it("returns ERROR_NOT_ALLOWED if the actorVetId is not the report author", async () => {
    await withBarkContext(async ({ context }) => {
      const r1 = await givenReport(context, { idx: 1337 });
      const v1 = await givenVet(context, { vetIdx: 1 });
      expect(r1.vetId).not.toEqual(v1.vetId);
      const { result, error } = await opFetchReport(context, {
        reportId: r1.reportId,
        actorVetId: v1.vetId,
      });
      expect(result).toBeUndefined();
      expect(error).toEqual(CODE.ERROR_NOT_ALLOWED);
    });
  });
  it("returns ERROR_WRONG_OWNER if the actorUserId is not the owner of the dog", async () => {
    await withBarkContext(async ({ context }) => {
      const r1 = await givenReport(context, { idx: 1337 });
      const u1 = await givenUser(context, { userIdx: 1 });
      expect(r1.ownerUserId).not.toEqual(u1.userId);
      const { result, error } = await opFetchReport(context, {
        reportId: r1.reportId,
        actorUserId: u1.userId,
      });
      expect(result).toBeUndefined();
      expect(error).toEqual(CODE.ERROR_WRONG_OWNER);
    });
  });
});
