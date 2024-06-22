import { test } from "@playwright/test";
import { doLogoutSequence } from "../_lib/ops/do-logout-sequence";
import { initPomContext } from "../_lib/init/init-pom-context";
import { doLoginKnownUser } from "../_lib/ops/do-login-known-user";

test("user can logout", async ({ page }) => {
  const context = await initPomContext({ page });
  await doLoginKnownUser(context);
  await doLogoutSequence(context);
});
