import { test, expect } from "@playwright/test";
import { registerTestUser } from "../_lib/init/register-test-user";
import { doLogoutSequence } from "../_lib/sequences/logout-sequence";
import { loginKnownVet } from "../_lib/init/login-known-vet";
import { VetSchedulePage } from "../_lib/pom/pages/vet-schedule-page";
import { isMobile } from "../_lib/e2e-test-utils";

test("vet can record APPOINTMENT call outcome", async ({ page }) => {
  const { context, userEmail, dogName } = await registerTestUser({ page });
  await doLogoutSequence({ context });
  await loginKnownVet({ page });
  const pg1 = new VetSchedulePage(context);
  await pg1.checkUrl();
  await expect(pg1.dogCard(dogName)).toBeVisible();

  if (await isMobile(context)) {
    // TODO: Currently cannot schedule appointments when screen is mobile sized.
    return;
  }

  // WHEN an APPOINTMENT call outcome is recorded bu clicking on the Scheduled
  // button...
  await pg1.dogCard(dogName).click();
  await expect(
    pg1.contactDetails().getByText(userEmail, { exact: true }),
  ).toBeVisible();
  await pg1.scheduledButton().click();

  // THEN the call-card and dog-card should have "Scheduled" badges.
  await expect(pg1.callCardScheduledBadge()).toBeVisible();
  await expect(pg1.dogCardScheduledBadge(dogName)).toBeVisible();

  // THEN WHEN the page is reloaded, the dog card should no longer be visible
  // because it is no longer available for scheduling.
  await pg1.page().reload();
  await expect(pg1.dogCard(dogName)).not.toBeVisible();
});
