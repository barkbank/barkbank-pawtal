import { withService } from "./bark-test-helpers";
import { mockReportData } from "./bark-mocks";
import { CODE } from "@/lib/utilities/bark-code";

describe("createReport", () => {
  it("should return ERROR_CALL_NOT_FOUND when the provided callId does not reference a known call", async () => {
    await withService(async ({ service }) => {
      const noSuchCallId = "123456";
      const reportData = mockReportData();
      const { result, error } = await service.createReport(
        noSuchCallId,
        reportData,
      );
      expect(result).toBeUndefined();
      expect(error).toEqual(CODE.ERROR_CALL_NOT_FOUND);
    });
  });
});
