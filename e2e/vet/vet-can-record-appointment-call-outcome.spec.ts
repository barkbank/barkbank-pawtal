import { test, expect } from "@playwright/test";
import { doLogoutSequence } from "../_lib/ops/do-logout-sequence";
import { doLoginKnownVet } from "../_lib/ops/do-login-known-vet";
import { VetSchedulePage } from "../_lib/pom/pages/vet-schedule-page";
import { doGetIsMobile } from "../_lib/ops/do-get-is-mobile";
import { initPomContext } from "../_lib/init/init-pom-context";
import { doRegister } from "../_lib/ops/do-register";

test("vet can record APPOINTMENT call outcome", async ({ page }) => {
  const context = await initPomContext({ page });
  const {
    dog: { dogName },
  } = await doRegister(context);

  await doLogoutSequence(context);
  await doLoginKnownVet(context);
  const pg1 = new VetSchedulePage(context);
  await pg1.checkReady();
  await expect(pg1.dogCard(dogName).locator()).toBeVisible();

  await pg1.dogCard(dogName).locator().click();

  const isMobile = await doGetIsMobile(context);
  const activityArea = isMobile ? pg1.dogCard(dogName) : pg1.rightSidePane();
  await expect(activityArea.scheduleButton()).toBeVisible();

  await activityArea.scheduleButton().click();
  await expect(activityArea.scheduledBadge()).toBeVisible();
  await expect(pg1.dogCard(dogName).scheduledBadge()).toBeVisible();

  await expect(activityArea.scheduleButton()).toBeDisabled();
  await expect(activityArea.declineButton()).toBeDisabled();

  // THEN WHEN the page is reloaded, the dog card should no longer be visible
  // because it is no longer available for scheduling.
  await pg1.page().reload();
  await expect(pg1.dogCard(dogName).locator()).not.toBeVisible();
});
