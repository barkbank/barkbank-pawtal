import { Locator } from "@playwright/test";
import { PomComponent } from "../core/pom-component";

export class FooterComponent extends PomComponent {
  locator(): Locator {
    return this.page().locator("#bark-footer");
  }
}
