import { PomContext } from "../pom/core/pom-object";
import { HeaderComponent } from "../pom/layout/header-component";

export async function doGetIsMobile(context: PomContext): Promise<boolean> {
  const header = new HeaderComponent(context);
  const hamburger = header.hamburgerButton();
  const hasHamburger = await hamburger.isVisible();
  return hasHamburger;
}
