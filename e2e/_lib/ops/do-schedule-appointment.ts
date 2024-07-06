import { expect } from "@playwright/test";
import { PomContext } from "../pom/core/pom-object";
import { NavComponent } from "../pom/layout/nav-component";
import { VetSchedulePage } from "../pom/pages/vet-schedule-page";
import { doGetIsMobile } from "./do-get-is-mobile";

export async function doScheduleAppointment(
  context: PomContext,
  args: { dogName: string },
) {
  const { dogName } = args;
  const isMobile = await doGetIsMobile(context);

  const nav = new NavComponent(context);
  const pgScheduler = new VetSchedulePage(context);

  await nav.vetScheduleOption().click();
  await pgScheduler.checkReady();
  await pgScheduler.dogCard(dogName).locator().click();
  if (isMobile) {
    await pgScheduler.dogCard(dogName).scheduleButton().click();
    await expect(pgScheduler.dogCard(dogName).scheduledBadge()).toBeVisible();
  } else {
    await pgScheduler.rightSidePane().scheduleButton().click();
    await expect(pgScheduler.rightSidePane().scheduledBadge()).toBeVisible();
  }
  await pgScheduler.checkReady();
}
