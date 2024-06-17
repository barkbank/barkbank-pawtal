import { opFetchReportsByDogId } from "@/lib/bark/operations/op-fetch-reports-by-dog-id";
import { withBarkContext } from "../_context";
import { givenDog, givenUser, givenVet } from "../_given";
import { BarkContext } from "@/lib/bark/bark-context";
import { opRecordAppointmentCallOutcome } from "@/lib/bark/operations/op-record-appointment-call-outcome";
import { opSubmitReport } from "@/lib/bark/operations/op-submit-report";
import { mockReportData } from "../_mocks";
import {
  SINGAPORE_TIME_ZONE,
  parseCommonDate,
} from "@/lib/utilities/bark-time";
import { CODE } from "@/lib/utilities/bark-code";

describe("opFetchReportsByDogId", () => {
  it("returns empty list when dog has no reports", async () => {
    await withBarkContext(async ({ context }) => {
      const d1 = await givenDog(context);
      const { result, error } = await opFetchReportsByDogId(context, {
        dogId: d1.dogId,
      });
      expect(error).toBeUndefined();
      expect(result).toEqual({ reports: [] });
    });
  });

  it("returns reports, newest to oldest", async () => {
    await withBarkContext(async ({ context }) => {
      // Given vet v1
      const { vetId } = await givenVet(context, { vetIdx: 1 });

      // And dog d1, with preferred vet v1
      const { dogId } = await givenDog(context, {
        dogIdx: 1,
        preferredVetId: vetId,
      });

      // And d1 has three reports from v1
      const r1 = await addReport(context, {
        dogId,
        vetId,
        visitTime: toVisitTime("10 May 2023"), // Middle
      });
      const r2 = await addReport(context, {
        dogId,
        vetId,
        visitTime: toVisitTime("10 Jan 2023"), // Oldest
      });
      const r3 = await addReport(context, {
        dogId,
        vetId,
        visitTime: toVisitTime("10 Aug 2023"), // Newest
      });

      // When...
      const { result, error } = await opFetchReportsByDogId(context, { dogId });

      // Then...
      expect(error).toBeUndefined();
      const reports = result!.reports;
      expect(reports[0].reportId).toEqual(r3.reportId);
      expect(reports[1].reportId).toEqual(r1.reportId);
      expect(reports[2].reportId).toEqual(r2.reportId);
    });
  });

  it("returns ERROR_WRONG_OWNER when actorUserId is not the dog owner", async () => {
    await withBarkContext(async ({ context }) => {
      // Given two users u1 and u2
      const u1 = await givenUser(context, { userIdx: 1 });
      const u2 = await givenUser(context, { userIdx: 2 });

      // And a dog d1 belonging to u1
      const d1 = await givenDog(context, { dogIdx: 1, userId: u1.userId });

      // When reports are fetched by actor u2
      const { result, error } = await opFetchReportsByDogId(context, {
        dogId: d1.dogId,
        actorUserId: u2.userId,
      });

      // Then
      expect(error).toEqual(CODE.ERROR_WRONG_OWNER);
      expect(result).toBeUndefined();
    });
  });
});

function toVisitTime(value: string): Date {
  return parseCommonDate(value, SINGAPORE_TIME_ZONE);
}

async function addReport(
  context: BarkContext,
  args: { dogId: string; vetId: string; visitTime: Date },
): Promise<{ appointmentId: string; reportId: string }> {
  const { dogId, vetId, vetId: actorVetId, visitTime } = args;
  const reportData = {
    ...mockReportData(),
    visitTime,
  };
  const res1 = await opRecordAppointmentCallOutcome(context, { dogId, vetId });
  const appointmentId = res1.result!.appointmentId;

  const res2 = await opSubmitReport(context, {
    appointmentId,
    reportData,
    actorVetId,
  });
  const reportId = res2.result!.reportId;
  return { appointmentId, reportId };
}
