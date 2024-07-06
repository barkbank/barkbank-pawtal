import { expect } from "@playwright/test";
import { doLoginKnownVet } from "./do-login-known-vet";
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
  const {
    dog: { dogName },
  } = await doRegister(context);
  await doLogoutSequence(context);
  await doLoginKnownVet(context);
  const pg1 = new VetSchedulePage(context);
  await pg1.goto();

  await expect(pg1.dogCard(dogName).locator()).toBeVisible();
  await pg1.dogCard(dogName).locator().click();
  const isMobile = await doGetIsMobile(context);
  const activityArea = isMobile ? pg1.dogCard(dogName) : pg1.rightSidePane();
  await expect(activityArea.scheduleButton()).toBeVisible();
  await activityArea.scheduleButton().click();
  await expect(activityArea.scheduledBadge()).toBeVisible();

  const nav = new NavComponent(context);
  await nav.vetAppointmentsOption().click();

  const pg2 = new VetAppointmentListPage(context);
  await pg2.checkReady();
  await expect(pg2.appointmentCard({ dogName }).locator()).toBeVisible();

  console.log({
    dogName,
    _msg: "Created appointment and navigated to appointments list page.",
  });

  return { dogName };
}
