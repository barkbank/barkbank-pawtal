import { test, expect } from "@playwright/test";
import { initPomContext } from "../_lib/init/init-pom-context";
import { doCreateAppointment } from "../_lib/sequences/do-create-appointment";
import { VetAppointmentListPage } from "../_lib/pom/pages/vet-appointment-list-page";
import { VetCancelAppointmentPage } from "../_lib/pom/pages/vet-cancel-appointment-page";

test("vet can cancel appointment", async ({ page }) => {
  const context = await initPomContext({ page });
  const { dogName } = await doCreateAppointment(context);

  const pg1 = new VetAppointmentListPage(context);
  await pg1.checkUrl();
  await expect(pg1.appointmentCard({ dogName }).locator()).toBeVisible();
  await pg1.appointmentCard({ dogName }).cancelAppointmentButton().click();

  const pg2 = new VetCancelAppointmentPage(context);
  await pg2.checkUrl();
  await pg2.confirmButton().click();

  const pg3 = new VetAppointmentListPage(context);
  await pg3.checkUrl();
  await expect(pg3.appointmentCard({ dogName }).locator()).not.toBeVisible();
});
