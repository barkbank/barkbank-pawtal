import { withBarkContext } from "../bark/_context";
import { givenDog, givenVet } from "../bark/_given";
import { BarkContext } from "@/lib/bark/bark-context";
import { opRecordAppointmentCallOutcome } from "@/lib/bark/operations/op-record-appointment-call-outcome";
import { opSubmitReport } from "@/lib/bark/operations/op-submit-report";
import { mockReportData } from "../bark/_mocks";
import {
  SINGAPORE_TIME_ZONE,
  parseCommonDate,
} from "@/lib/utilities/bark-time";
import { CODE } from "@/lib/utilities/bark-code";
import { givenUserActor } from "../_fixtures";

describe("UserActor getDogReports and getDogReportCount", () => {
  it("can retrieve empty list of reports when there are no reports", async () => {
    await withBarkContext(async ({ context }) => {
      const u1 = await givenUserActor({ idx: 1, context });
      const d1 = await givenDog(context, { userId: u1.getUserId() });
      const { result, error } = await u1.getDogReports({ dogId: d1.dogId });
      expect(error).toBeUndefined();
      expect(result).toEqual([]);
    });
  });

  it("can retrieve reports reports, newest to oldes, and also count them", async () => {
    await withBarkContext(async ({ context }) => {
      // Given vet v1
      const { vetId } = await givenVet(context, { vetIdx: 1 });

      // And u1
      const u1 = await givenUserActor({ idx: 1, context });

      // And dog d1, with preferred vet v1
      const { dogId } = await givenDog(context, {
        dogIdx: 1,
        userId: u1.getUserId(),
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
      const { result, error } = await u1.getDogReports({ dogId });

      // Then...
      expect(error).toBeUndefined();
      const reports = result!;
      expect(reports[0].reportId).toEqual(r3.reportId);
      expect(reports[1].reportId).toEqual(r1.reportId);
      expect(reports[2].reportId).toEqual(r2.reportId);

      // And when...
      const resCount = await u1.getDogReportCount({ dogId });
      expect(resCount.result?.reportCount).toEqual(3);
    });
  });

  it("checks whether actor is the dog owner", async () => {
    await withBarkContext(async ({ context }) => {
      // Given two users u1 and u2
      const u1 = await givenUserActor({ idx: 1, context });
      const u2 = await givenUserActor({ idx: 2, context });

      // And a dog d1 belonging to u1
      const d1 = await givenDog(context, { dogIdx: 1, userId: u1.getUserId() });

      // When reports are fetched by actor u2
      const { result, error } = await u2.getDogReports({ dogId: d1.dogId });

      // Then
      expect(error).toEqual(CODE.ERROR_DOG_NOT_FOUND);
      expect(result).toBeUndefined();

      // And also when...
      const resCount = await u2.getDogReportCount({ dogId: d1.dogId });
      expect(resCount.error).toEqual(CODE.ERROR_DOG_NOT_FOUND);
    });
  });
});

function toVisitTime(value: string): Date {
  return parseCommonDate(value, SINGAPORE_TIME_ZONE);
}

// TODO: Replace this with VetActor
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
