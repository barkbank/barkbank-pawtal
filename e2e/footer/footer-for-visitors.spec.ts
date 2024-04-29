import { test, expect } from "@playwright/test";
import { initPomContext } from "../_lib/init/init-pom-context";
import { FooterComponent } from "../_lib/pom/layout/footer-component";

test("footer for visitors", async ({ page }) => {
  const context = await initPomContext({ page });
  const footer = new FooterComponent(context);
  await expect(footer.vetLoginLink()).toBeVisible();
  await expect(footer.adminLoginLink()).toBeVisible();
});
