import { test, expect } from "@playwright/test";
import { loginKnownUser, navbarOf } from "../_lib/pom/init";
import { doLogoutSequence } from "../_lib/sequences/logout-sequence";

test("user can logout", async ({ page }) => {
  const { knownUser, pomPage } = await loginKnownUser(page);
  await doLogoutSequence(pomPage);
});
