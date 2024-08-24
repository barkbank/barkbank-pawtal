import { opSendReportNotification } from "@/lib/bark/operations/op-send-report-notification";
import { withBarkContext } from "../_context";
import { givenReport } from "../_given";
import { HarnessEmailService } from "../../_harness";
import { PawtalEventsService } from "@/lib/bark/services/pawtal-events-service";
import { PAWTAL_EVENT_TYPE } from "@/lib/bark/enums/pawtal-event-type";

describe("opSendReportNotification", () => {
  it("sends email to owner", async () => {
    await withBarkContext(async ({ context }) => {
      const { reportId, ownerName } = await givenReport(context);
      const pawtalEventsService = new PawtalEventsService({ context });
      await opSendReportNotification(context, {
        reportId,
        pawtalEventsService,
      });
      const emailService: HarnessEmailService =
        context.emailService as HarnessEmailService;
      expect(emailService.emails[0].recipient.name).toEqual(ownerName);
      expect(
        await pawtalEventsService.getEventCountByType({
          eventType: PAWTAL_EVENT_TYPE.EMAIL_SENT_REPORT_NOTIFICATION,
        }),
      ).toMatchObject({ eventCount: 1 });
    });
  });
});
