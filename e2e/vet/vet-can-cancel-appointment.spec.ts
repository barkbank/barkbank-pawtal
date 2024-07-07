import { test, expect } from "@playwright/test";
import { initPomContext } from "../_lib/init/init-pom-context";
import { doCreateAppointment } from "../_lib/ops/do-create-appointment";
import { VetAppointmentListPage } from "../_lib/pom/pages/vet-appointment-list-page";
import { VetAppointmentCancelPage } from "../_lib/pom/pages/vet-appointment-cancel-page";
import { ToastComponent } from "../_lib/pom/layout/toast-component";

test("vet can cancel appointment", async ({ page }) => {
  const context = await initPomContext({ page });
  const { dogName } = await doCreateAppointment(context);

  const pgAppointmentList = new VetAppointmentListPage(context);
  const pgAppointmentCancel = new VetAppointmentCancelPage(context);
  const toast = new ToastComponent(context);

  await pgAppointmentList.checkReady();
  await expect(
    pgAppointmentList.appointmentCard({ dogName }).locator(),
  ).toBeVisible();
  await pgAppointmentList
    .appointmentCard({ dogName })
    .cancelAppointmentButton()
    .click();

  await pgAppointmentCancel.checkReady();
  await pgAppointmentCancel.confirmButton().click();

  await expect(toast.locator()).toBeVisible();
  await toast.closeButton().click();
  await expect(toast.locator()).not.toBeVisible();

  await pgAppointmentList.checkReady();
  await expect(
    pgAppointmentList.appointmentCard({ dogName }).locator(),
  ).not.toBeVisible();
});
