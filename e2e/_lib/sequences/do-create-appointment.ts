import { expect } from "@playwright/test";
import { loginKnownVet } from "../init/login-known-vet";
import { registerTestUser } from "../init/register-test-user";
import { PomContext } from "../pom/core/pom-object";
import { VetSchedulePage } from "../pom/pages/vet-schedule-page";
import { doLogoutSequence } from "./logout-sequence";
import { getIsMobile } from "../e2e-test-utils";
import { NavComponent } from "../pom/layout/nav-component";
import { VetAppointmentsListPage } from "../pom/pages/vet-appointments-list-page";

export async function doCreateAppointment(
  context: PomContext,
): Promise<{ dogName: string; userEmail: string }> {
  const page = context.page;
  const { userEmail, dogName } = await registerTestUser({ page });
  await doLogoutSequence({ context });
  await loginKnownVet({ page });
  const pg1 = new VetSchedulePage(context);
  await pg1.goto();

  await expect(pg1.dogCard(dogName).locator()).toBeVisible();
  await pg1.dogCard(dogName).locator().click();
  const isMobile = await getIsMobile(context);
  const activityArea = isMobile ? pg1.dogCard(dogName) : pg1.rightSidePane();
  await expect(activityArea.exactText(userEmail)).toBeVisible();
  await expect(activityArea.scheduleButton()).toBeVisible();
  await activityArea.scheduleButton().click();

  const nav = new NavComponent(context);
  await nav.vetAppointmentsOption().click();

  const pg2 = new VetAppointmentsListPage(context);
  await pg2.checkUrl();

  console.log({
    dogName,
    userEmail,
    _msg: "Created appointment and navigated to appointments list page.",
  });

  return { dogName, userEmail };
}
