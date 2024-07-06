import { test, expect } from "@playwright/test";
import { initPomContext } from "../_lib/init/init-pom-context";
import { doCreateAppointment } from "../_lib/ops/do-create-appointment";
import { VetAppointmentListPage } from "../_lib/pom/pages/vet-appointment-list-page";
import { VetAppointmentCancelPage } from "../_lib/pom/pages/vet-appointment-cancel-page";

test("vet can cancel appointment", async ({ page }) => {
  const context = await initPomContext({ page });
  const { dogName } = await doCreateAppointment(context);

  const pg1 = new VetAppointmentListPage(context);
  await pg1.checkReady();
  await expect(pg1.appointmentCard({ dogName }).locator()).toBeVisible();
  await pg1.appointmentCard({ dogName }).cancelAppointmentButton().click();

  const pg2 = new VetAppointmentCancelPage(context);
  await pg2.checkUrl();
  await pg2.confirmButton().click();

  const pg3 = new VetAppointmentListPage(context);
  await pg3.checkReady();
  await expect(pg3.appointmentCard({ dogName }).locator()).not.toBeVisible();
});
