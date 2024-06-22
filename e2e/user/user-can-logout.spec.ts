import { test } from "@playwright/test";
import { loginKnownUser } from "../_lib/init/login-known-user";
import { doLogoutSequence } from "../_lib/ops/logout-sequence";

test("user can logout", async ({ page }) => {
  const { pomPage } = await loginKnownUser({ page });
  const context = pomPage.context();
  await doLogoutSequence({ context });
});
