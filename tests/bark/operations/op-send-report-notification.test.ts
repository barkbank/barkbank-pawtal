import { opSendReportNotification } from "@/lib/bark/operations/op-send-report-notification";
import { withBarkContext } from "../_context";
import { givenReport } from "../_given";
import { HarnessEmailService } from "../../_harness";
import { PAWTAL_EVENT_TYPE } from "@/lib/bark/enums/pawtal-event-type";
import { PawtalEventService } from "@/lib/bark/services/pawtal-event-service";

describe("opSendReportNotification", () => {
  it("sends email to owner", async () => {
    await withBarkContext(async ({ context }) => {
      const { reportId, ownerName } = await givenReport(context);
      const pawtalEventService = new PawtalEventService({ context });
      await opSendReportNotification(context, {
        reportId,
        pawtalEventService,
      });
      const emailService: HarnessEmailService =
        context.emailService as HarnessEmailService;
      expect(emailService.emails[0].recipient.name).toEqual(ownerName);
      expect(
        await pawtalEventService.getEventCountByType({
          eventType: PAWTAL_EVENT_TYPE.EMAIL_SENT_REPORT_NOTIFICATION,
        }),
      ).toMatchObject({ eventCount: 1 });
    });
  });
});
