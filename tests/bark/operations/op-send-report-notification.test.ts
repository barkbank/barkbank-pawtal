import { opSendReportNotification } from "@/lib/bark/operations/op-send-report-notification";
import { withBarkContext } from "../_context";
import { givenReport } from "../_given";
import { HarnessEmailService } from "../../_harness";

describe("opSendReportNotification", () => {
  it("sends email to owner", async () => {
    await withBarkContext(async ({ context }) => {
      const { reportId, ownerName } = await givenReport(context);
      await opSendReportNotification(context, { reportId });
      const emailService: HarnessEmailService =
        context.emailService as HarnessEmailService;
      expect(emailService.emails[0].recipient.name).toEqual(ownerName);
    });
  });
});
