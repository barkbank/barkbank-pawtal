import { test, expect } from "@playwright/test";
import { doLogoutSequence } from "../_lib/ops/do-logout-sequence";
import { doLoginKnownVet } from "../_lib/ops/do-login-known-vet";
import { VetSchedulePage } from "../_lib/pom/pages/vet-schedule-page";
import { doGetIsMobile } from "../_lib/ops/do-get-is-mobile";
import { initPomContext } from "../_lib/init/init-pom-context";
import { doRegister } from "../_lib/ops/do-register";

test("vet can record DECLINED call outcome", async ({ page }) => {
  const context = await initPomContext({ page });
  const {
    user: { userName },
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
  await expect(activityArea.exactText(userName)).toBeVisible();
  await expect(activityArea.declineButton()).toBeVisible();

  await activityArea.declineButton().click();
  await expect(activityArea.declinedBadge()).toBeVisible();
  await expect(pg1.dogCard(dogName).declinedBadge()).toBeVisible();

  await expect(activityArea.scheduleButton()).toBeDisabled();
  await expect(activityArea.declineButton()).toBeDisabled();

  // THEN WHEN the page is reloaded, the dog card should still be visible.
  await pg1.page().reload();
  await expect(pg1.dogCard(dogName).locator()).toBeVisible();
});
