import { test, expect } from "@playwright/test";
import { FooterComponent } from "../_lib/pom/layout/footer-component";
import { loginKnownUser } from "../_lib/init/login-known-user";

test("footer for logged-in user", async ({ page }) => {
  const { context } = await loginKnownUser({ page });
  const footer = new FooterComponent(context);
  expect(footer.vetLoginLink()).not.toBeVisible();
  expect(footer.adminLoginLink()).not.toBeVisible();
});
