import { test } from "@playwright/test";
import { initLoginKnownUser } from "../_lib/pom/init";
import { doLogoutSequence } from "../_lib/sequences/logout-sequence";

test("user can logout", async ({ page }) => {
  const { knownUser, pomPage } = await initLoginKnownUser(page);
  await doLogoutSequence(pomPage);
});
