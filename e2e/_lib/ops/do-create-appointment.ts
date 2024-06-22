import { expect } from "@playwright/test";
import { loginKnownVet } from "../init/login-known-vet";
import { PomContext } from "../pom/core/pom-object";
import { VetSchedulePage } from "../pom/pages/vet-schedule-page";
import { doLogoutSequence } from "./do-logout-sequence";
import { doGetIsMobile } from "./do-get-is-mobile";
import { NavComponent } from "../pom/layout/nav-component";
import { VetAppointmentListPage } from "../pom/pages/vet-appointment-list-page";
import { doRegister } from "./do-register";

export async function doCreateAppointment(
  context: PomContext,
): Promise<{ dogName: string }> {
  const page = context.page;
  const {
    dog: { dogName },
    user: { userName },
  } = await doRegister(context);
  await doLogoutSequence(context);
  await loginKnownVet({ page });
  const pg1 = new VetSchedulePage(context);
  await pg1.goto();

  await expect(pg1.dogCard(dogName).locator()).toBeVisible();
  await pg1.dogCard(dogName).locator().click();
  const isMobile = await doGetIsMobile(context);
  const activityArea = isMobile ? pg1.dogCard(dogName) : pg1.rightSidePane();
  await expect(activityArea.exactText(userName)).toBeVisible();
  await expect(activityArea.scheduleButton()).toBeVisible();
  await activityArea.scheduleButton().click();

  const nav = new NavComponent(context);
  await nav.vetAppointmentsOption().click();

  const pg2 = new VetAppointmentListPage(context);
  await pg2.checkUrl();

  console.log({
    dogName,
    _msg: "Created appointment and navigated to appointments list page.",
  });

  return { dogName };
}
