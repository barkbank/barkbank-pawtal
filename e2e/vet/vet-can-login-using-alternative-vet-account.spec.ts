import { test, expect } from "@playwright/test";
import { doLogoutSequence } from "../_lib/ops/do-logout-sequence";
import { doLoginKnownVet } from "../_lib/ops/do-login-known-vet";
import { VetSchedulePage } from "../_lib/pom/pages/vet-schedule-page";
import { initPomContext } from "../_lib/init/init-pom-context";
import { doRegister } from "../_lib/ops/do-register";
import { doLoginKnownVetAccount } from "../_lib/ops/do-login-known-vet-account";

test("vet can login using alternative vet account", async ({ page }) => {
  const context = await initPomContext({ page });

  // User registers
  const {
    dog: { dogName },
  } = await doRegister(context);
  await doLogoutSequence(context);

  const pgScheduler = new VetSchedulePage(context);

  // Known vet can see the dog
  await doLoginKnownVet(context);
  await pgScheduler.checkReady();
  await expect(pgScheduler.dogCard(dogName).locator()).toBeVisible();
  await doLogoutSequence(context);

  // Known vet account can also see the dog
  await doLoginKnownVetAccount(context);
  const pg1 = new VetSchedulePage(context);
  await pgScheduler.checkReady();
  await expect(pgScheduler.dogCard(dogName).locator()).toBeVisible();
  await doLogoutSequence(context);
});
