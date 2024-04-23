import { test } from "@playwright/test";
import { initLoginKnownUser } from "../_lib/pom/init";
import { doLogoutSequence } from "../_lib/sequences/logout-sequence";

test("user can logout", async ({ page }) => {
  const { pomPage } = await initLoginKnownUser(page);
  const context = pomPage.context();
  await doLogoutSequence({ context });
});
