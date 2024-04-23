import { test } from "@playwright/test";
import { loginKnownUser } from "../_lib/pom/init/login-known-user";
import { doLogoutSequence } from "../_lib/sequences/logout-sequence";

test("user can logout", async ({ page }) => {
  const { pomPage } = await loginKnownUser(page);
  const context = pomPage.context();
  await doLogoutSequence({ context });
});
