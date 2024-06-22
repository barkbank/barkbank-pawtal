import { test, expect } from "@playwright/test";
import { FooterComponent } from "../_lib/pom/layout/footer-component";
import { initPomContext } from "../_lib/init/init-pom-context";
import { doLoginKnownUser } from "../_lib/ops/do-login-known-user";

test("footer for logged-in user", async ({ page }) => {
  const context = await initPomContext({ page });
  await doLoginKnownUser(context);
  const footer = new FooterComponent(context);
  await expect(footer.vetLoginLink()).not.toBeVisible();
  await expect(footer.adminLoginLink()).not.toBeVisible();
});
