import { PomContext } from "../pom/core/pom-object";
import { NavComponent } from "../pom/layout/nav-component";
import { VetSchedulePage } from "../pom/pages/vet-schedule-page";
import { doGetIsMobile } from "./do-get-is-mobile";

export async function doScheduleAppointment(context: PomContext, args: {dogName: string}) {
  const {dogName} = args;
  const nav = new NavComponent(context);
  const pgScheduler = new VetSchedulePage(context);

  const isMobile = await doGetIsMobile(context);

  await nav.vetScheduleOption().click();
  await pgScheduler.checkUrl();
  await pgScheduler.dogCard(dogName).locator().click();
  if (isMobile) {
    await pgScheduler.dogCard(dogName).scheduleButton().click();
  } else {
    await pgScheduler.rightSidePane().scheduleButton().click();
  }
}
