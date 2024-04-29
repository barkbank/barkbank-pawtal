import { test, expect } from "@playwright/test";
import { initPomContext } from "../_lib/init/init-pom-context";
import { HeaderComponent } from "../_lib/pom/layout/header-component";

test("header for visitors", async ({page}) => {
  const context = await initPomContext({page});
  const header = new HeaderComponent(context);
  const hasHamburger = await header.hamburgerButton().isVisible();
  if (hasHamburger) {
    await header.hamburgerButton().click();
  }
  await expect(header.logoutLink()).not.toBeVisible();
})
